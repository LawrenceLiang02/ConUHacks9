from flask import Flask, jsonify, request
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv('API_KEY')
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
FRIDGE_FILE = os.path.join(BASE_DIR, "fridge.txt")

recipesList = []
fridge = []

@app.route('/')
def home():
    return "Hello, Flask!"


@app.route('/recipes/getRecipesFromIngredients', methods=['GET'])
def get_recipes_from_ingredients():
    try:
        ingredients = request.args.get('ingredients', '')  # Get ingredients from query params
        if not ingredients:
            return jsonify({'error': 'No ingredients provided'}), 400

        url = 'https://api.spoonacular.com/recipes/findByIngredients'
        params = {
            'apiKey': API_KEY,
            'ingredients': ingredients,
            'number': 5,
            'ranking': 2,
            'ignorePantry': True
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recipes/getRecipeById')
def get_recipe_by_id(recipe_id):
    return recipesList[recipe_id];

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
#TODO Get fridge incredients
#TODO Create ingredient
#TODO Delete ingredient

if __name__ == '__main__':
    app.run(debug=True)
