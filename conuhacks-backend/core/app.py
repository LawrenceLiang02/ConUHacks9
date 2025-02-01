from flask import Flask, jsonify, request
import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv('API_KEY')
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
FRIDGE_FILE = os.path.join(BASE_DIR, "fridge.txt")
RECIPES_FILE = os.path.join(BASE_DIR, "recipes.json")

recipesList = []
fridge = []

@app.route('/')
def home():
    return "Hello, Flask!"


@app.route('/recipes/getRecipesFromIngredients', methods=['GET'])
def get_recipes_from_ingredients():
    try:
        ingredients = load_fridge()
        print(ingredients)  # Get ingredients from query params
        if not ingredients:
            return jsonify({'error': 'No ingredients provided'}), 400

        ingredients_string = ', '.join(ingredients)

        url = 'https://api.spoonacular.com/recipes/findByIngredients'
        params = {
            'apiKey': API_KEY,
            'ingredients': ingredients_string,
            'number': 10,
            'ranking': 1,
            'ignorePantry': True
        }
        response = requests.get(url, params=params)
        response.raise_for_status()

        save_recipes(response.json())
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

def load_recipes():
    if os.path.exists(RECIPES_FILE):
        with open(RECIPES_FILE, "r") as f:
            return json.load(f)
    return {"results": []}

def save_recipes(recipes):
    try:
        with open(RECIPES_FILE, "w") as f:
            json.dump({"results": recipes}, f, indent=4)
    except IOError as e:
        print(f"Error saving recipes to {RECIPES_FILE}: {e}")


@app.route('/recipes/getRecipeInformation/<int:recipe_id>', methods=['GET'])
def get_recipe_information(recipe_id):
    # Load the recipes from the local file
    recipes = load_recipes().get("results", [])
    recipe = next((r for r in recipes if r.get("id") == recipe_id), None)
    
    if recipe:
        try:
            # If recipe exists, make an API call to get more detailed information
            url = f'https://api.spoonacular.com/recipes/{recipe_id}/information'
            params = {
                'apiKey': API_KEY,
            }
            response = requests.get(url, params=params)
            response.raise_for_status()
            
            # Return the detailed recipe information
            return jsonify(response.json())
        except requests.exceptions.RequestException as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({"error": "Recipe not found"}), 404


def load_fridge():
    if os.path.exists(FRIDGE_FILE):
        with open(FRIDGE_FILE, "r") as f:
            return [line.strip() for line in f.readlines()]
    return []

def save_fridge(fridge):
    with open(FRIDGE_FILE, "w") as f:
        for item in fridge:
            f.write(item + "\n")

@app.route('/recipes/getRecipes', methods=['GET'])
def get_ingredients():
    fridge = load_fridge()
    print(fridge)
    return jsonify(fridge)

@app.route('/recipes/addIngredient', methods=['POST'])
def add_ingredient():
    ingredient = request.json.get("ingredient")
    if not ingredient:
        return jsonify({"error": "No ingredient provided"}), 400
    
    fridge = load_fridge()
    if ingredient not in fridge:
        fridge.append(ingredient)
        save_fridge(fridge)
    return jsonify({"message": "Ingredient added", "fridge": fridge})

@app.route('/recipes/deleteIngredient', methods=['POST'])
def delete_ingredient():
    ingredient = request.json.get("ingredient")
    if not ingredient:
        return jsonify({"error": "No ingredient provided"}), 400
    
    fridge = load_fridge()
    if ingredient in fridge:
        fridge.remove(ingredient)
        save_fridge(fridge)
        return jsonify({"message": "Ingredient removed", "fridge": fridge})
    else:
        return jsonify({"error": "Ingredient not found"}), 404

@app.route('/recipes/searchRecipe', methods=['GET'])
def search_recipe():
    try:
        recipe = request.args.get('recipe', '')
        cuisine = request.args.get('cuisine', '')
        diet = request.args.get('diet', '')
        intolerances = request.args.get('intolerances', '').split(',')
        recipe_type = request.args.get('recipe_type', '')
        
        url = 'https://api.spoonacular.com/recipes/complexSearch'
        params = {
            'apiKey': API_KEY,
            'query': recipe,
            'cuisine': cuisine,
            'diet': diet,
            'intolerances': ','.join(intolerances),
            'type': recipe_type,
            'instructionsRequired': True,
            'fillIngredients': True,
            'addRecipeInformation': True,
            'addRecipeInstructions': True,
            'addRecipeNutrition': True,
            'number': 3
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500
    
#TODO Get recipe by id
#TODO Get top 5 recipes ->> search_recipe()

if __name__ == '__main__':
    app.run(debug=True)