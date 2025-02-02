import csv
from flask import Flask, jsonify, request
import requests
import os
import json
from dotenv import load_dotenv
from flask_cors import CORS 
import re
load_dotenv()
 # Import CORS

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv('API_KEY')
print(API_KEY)
PIXABAY_API_KEY = os.getenv('PIXABAY_API_KEY')
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
FRIDGE_FILE = os.path.join(BASE_DIR, "fridge.txt")
RECIPES_FILE = os.path.join(BASE_DIR, "recipes.json")
LOBBY_DATA_FILE = os.path.join(BASE_DIR, "store/rooms.json")  # Ensure the full path is correct

# Ensure the directory exists before writing to the file
os.makedirs(os.path.dirname(LOBBY_DATA_FILE), exist_ok=True)
PIXABAY_URL = "https://pixabay.com/api/"

ingredients__mock_list = ['apple', 'sugar', 'flour']

recipesList = []
fridge = []


def get_lobby_by_id(lobby_id):
    if os.path.exists(LOBBY_DATA_FILE):
        with open(LOBBY_DATA_FILE, 'r') as file:
            lobbies = json.load(file)
            lobby = next((lobby for lobby in lobbies if lobby['lobbyId'] == lobby_id), None)
            if lobby:
                return lobby
    return None  

@app.route('/')
def home():
    return "Hello, Flask!"


@app.route('/recipes/getRecipesFromIngredients', methods=['GET'])
def get_recipes_from_ingredients():
    try:
        fridge = load_fridge()
        # iga_discounts = load_grocery_json("iga_results.json")
        # metro_discounts = load_grocery_json("metro_results.json")
        # super_discounts = load_grocery_json("super_results.json")
        fridge_names = extract_names(fridge)
        
        ingredients = fridge_names #+ iga_discounts + metro_discounts + super_discounts
        if not ingredients:
            return jsonify({'error': 'No ingredients provided'}), 400

        ingredients_string = ', '.join(ingredient for ingredient in ingredients)
        
        url = 'https://api.spoonacular.com/recipes/findByIngredients'
        params = {
            'apiKey': API_KEY,
            'ingredients': ingredients_string,
            'number':5,
            'ranking': 1,
            'ignorePantry': True
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        #save_recipes(response.json())
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recipes/getRecipesFromIngredientsForRecommendations', methods=['GET'])
def get_recipes_from_ingredients_recommendations():
    try:
        ingredients = load_fridge()
        print(ingredients)  # Get ingredients from query params
        if not ingredients:
            return jsonify({'error': 'No ingredients provided'}), 400

        ingredients_string = ', '.join(ingredient['name'] for ingredient in ingredients)
        
        url = 'https://api.spoonacular.com/recipes/findByIngredients'
        params = {
            'apiKey': API_KEY,
            'ingredients': ingredients_string,
            'number':10,
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

@app.route('/recipes/getBulkRecipeInformation', methods=['GET'])
def get_bulk_recipe_information():
    try:
        # Get recipe IDs from query parameter
        # Example: /recipes/getBulkRecipeInformation?ids=123,456,789
        recipe_ids = request.args.get('ids', '')
        
        if not recipe_ids:
            return jsonify({"error": "No recipe IDs provided"}), 400
            
        # Make API call to get bulk recipe information
        url = 'https://api.spoonacular.com/recipes/informationBulk'
        params = {
            'apiKey': API_KEY,
            'ids': recipe_ids  # The API expects comma-separated IDs
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        # Return the detailed recipe information for all requested recipes
        return jsonify(response.json())
        
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500


def load_fridge(filename="fridge.txt"):
    try:
        with open(filename, "r", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            return [dict(row) for row in reader]
    except FileNotFoundError:
        print(f"Error: The file '{filename}' was not found.")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

def extract_names(items):
    return [item["name"] for item in items if isinstance(item, dict) and "name" in item]

def save_fridge(fridge):
    with open("fridge.txt", "w") as f:
        f.write("name,quantity,imageUrl\n")
        for item in fridge:
            f.write(f"{item['name']},{item['quantity']},{item['imageUrl']}\n")

@app.route('/recipes/getFridgeItems', methods=['GET'])
def get_fridge_items():
    fridge = load_fridge()
    return jsonify(fridge)

@app.route('/recipes/addFridgeItem', methods=['POST'])
def add_fridge(filename="fridge.txt"):
    name = request.json.get("name")
    quantity = request.json.get("quantity")

    if not name or not quantity:
        return jsonify({"error": "Missing name or quantity"}), 400
    
    params = {
        "key": PIXABAY_API_KEY,
        "q": name,
        "image_type": "photo",
        "pretty": True,
        "category": "food"
    }
    response = requests.get(PIXABAY_URL, params=params)
    print("Pixabay API URL:", response.url)
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch image"}), 500
    
    data = response.json()
    if "hits" in data and len(data["hits"]) > 0:
        image_url = data["hits"][0]["webformatURL"]
    else:
        print("no Images found")

    try:
        with open(filename, "a", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow([name.lower(), quantity, image_url])  # Append new item

        return jsonify({"message": "Ingredient added successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/recipes/deleteFridgeItem', methods=['POST'])
def delete_fridge_item():
    ingredient = request.json.get("ingredient")
    if not ingredient:
        return jsonify({"error": "No ingredient provided"}), 400

    fridge = load_fridge()
    ingredient_lower = ingredient.lower().strip()

    filtered_fridge = [item for item in fridge if item["name"].lower().strip() != ingredient_lower]

    if len(filtered_fridge) == len(fridge):
        return jsonify({"error": "Ingredient not found"}), 404

    save_fridge(filtered_fridge)

    return jsonify({"message": f"Ingredient '{ingredient}' removed", "fridge": filtered_fridge})


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
    

@app.route('/recipes/searchByCuisine', methods=['GET'])
def search_by_cuisine():
    try:
        cuisine = request.args.get('cuisine', '')  # Required cuisine parameter
        number = request.args.get('number', 10, type=int)  # Optional number of recipes, default 10
        diet = request.args.get('diet', '')  # Optional diet filter
        type = request.args.get('type', '')  # Optional recipe type filter
        intolerances = request.args.get('intolerances', '').split(',')  # Optional intolerances
        
        # Validate cuisine is provided
        if not cuisine:
            return jsonify({'error': 'Cuisine is required'}), 400
        
        url = 'https://api.spoonacular.com/recipes/complexSearch'
        params = {
            'apiKey': API_KEY,
            'cuisine': cuisine,
            'diet': diet,
            'type': type,
            'intolerances': ','.join([i.strip() for i in intolerances if i.strip()]),
            'instructionsRequired': True,
            'fillIngredients': True,
            'addRecipeInformation': True,
            'addRecipeNutrition': True,
            'number': min(number, 100)  # Limit to 100 recipes max
        }
        
        # Remove empty string parameters
        params = {k: v for k, v in params.items() if v}
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500



#TODO Get recipe by id
#TODO Get top 5 recipes ->> search_recipe()
@app.route('/recipes/topRecipesFromIngredients', methods=['GET'])
def get_top_recipes_from_ingredients():
    try:
        cuisine = request.args.get('cuisine', '')
        GROCERY_FILE = os.path.join(BASE_DIR, "simplified_results.json")
        with open(GROCERY_FILE, 'r') as f:
            grocery_data = json.load(f)

        comestible_categories = [
            'frozen_and_prepared', 
            'pantry', 
            'meat_and_seafood', 
            'dairy_and_cheese', 
            'produce', 
            'snacks',
            'snacks_and_treats'
        ]
        
        ingredients = []
        for category in comestible_categories:
            if category in grocery_data['categories']:
                for item in grocery_data['categories'][category].keys():
                    # Clean the ingredient name
                    cleaned_item = re.sub(r'\(.*?\)', '', item).lower().strip()
                    
                    # Split multi-word items and clean individual words
                    ingredient_words = cleaned_item.split()
                    
                    for word in ingredient_words:
                        # Filter out non-food words and very short words
                        if (len(word) > 2 and 
                            word not in ['the', 'and', 'or', 'mix', 'size', 'fresh'] and
                            not word.isdigit()):
                            ingredients.append(word)
        
        ingredients = list(dict.fromkeys(ingredients))
        ingredients = ingredients[:20]
        
        specific_ingredients = [
            # 'chicken', 'pasta', 'tomato', 'cheese', 
            # 'salmon', 'pizza', 'vegetables', 'noodles'
        ]
        
        # Use complexSearch instead of findByIngredients
        url = 'https://api.spoonacular.com/recipes/complexSearch'
        params = {
            'apiKey': API_KEY,
            'ingredients': ', '.join(specific_ingredients),
            'cuisine': cuisine,  # Optional cuisine filter
            'instructionsRequired': True,
            'fillIngredients': True,
            'addRecipeInformation': True,
            'number': 3,  # Top 5 recipes
        }
        
        params = {k: v for k, v in params.items() if v}
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        response_data = response.json()

        return jsonify(response_data)
    
    except requests.exceptions.RequestException as e:
        print(f"Request Error: {e}")
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        print(f"Unexpected Error: {e}")
        return jsonify({'error': str(e)}), 500
# Endpoint to create a lobby
@app.route('/create-lobby', methods=['POST'])
def create_lobby():
    lobby_data = request.json
    lobby_id = lobby_data['lobbyId']
    
    # Load existing lobbies or create an empty list
    if os.path.exists(LOBBY_DATA_FILE):
        with open(LOBBY_DATA_FILE, 'r') as file:
            lobbies = json.load(file)
    else:
        lobbies = []

    # Add new lobby to the list
    lobbies.append(lobby_data)

    # Save the updated lobbies data
    with open(LOBBY_DATA_FILE, 'w') as file:
        json.dump(lobbies, file, indent=2)

    return jsonify({'message': 'Lobby created successfully'}), 200


@app.route('/lobby/<lobby_id>', methods=['GET'])
def get_lobby(lobby_id):
    # Assuming you fetch the lobby details from a database or file
    lobby = get_lobby_by_id(lobby_id)  # This function retrieves the lobby info by ID
    
    if lobby is None:
        return jsonify({'error': 'Lobby not found'}), 404
    
    return jsonify({
        'name': lobby['title'],
        'date': lobby['date']
    })


# Endpoint to submit dietary information for a lobby
@app.route('/submit-dietary-info/<lobby_id>', methods=['POST'])
def submit_dietary_info(lobby_id):
    dietary_info = request.json
    
    # Load existing lobbies
    if os.path.exists(LOBBY_DATA_FILE):
        with open(LOBBY_DATA_FILE, 'r') as file:
            lobbies = json.load(file)
    else:
        return jsonify({'message': 'No lobby data found'}), 404

    # Find the lobby by ID
    lobby = next((lobby for lobby in lobbies if lobby['lobbyId'] == lobby_id), None)

    if not lobby:
        return jsonify({'message': 'Lobby not found'}), 404

    # Append the dietary information to the participants
    if 'participants' not in lobby:
        lobby['participants'] = []

    lobby['participants'].append(dietary_info)

    # Save the updated lobbies data
    with open(LOBBY_DATA_FILE, 'w') as file:
        json.dump(lobbies, file, indent=2)

    return jsonify({'message': 'Dietary information submitted successfully'}), 200


@app.route('/get-participants/<lobby_id>', methods=['GET'])
def get_participants(lobby_id):
    if os.path.exists(LOBBY_DATA_FILE):
        with open(LOBBY_DATA_FILE, 'r') as file:
            lobbies = json.load(file)
    else:
        return jsonify({'message': 'No lobby data found'}), 404

    lobby = next((lobby for lobby in lobbies if lobby['lobbyId'] == lobby_id), None)

    if not lobby:
        return jsonify({'message': 'Lobby not found'}), 404

    participants = lobby.get('participants', [])

    return jsonify({'participants': participants}), 200



@app.route('/recipes/groceries', methods=['GET'])
def get_groceries():
    grocery_discounts = {
        "iga": load_grocery_with_price_json("iga_results.json"),
        "metro": load_grocery_with_price_json("metro_results.json"),
        "super c": load_grocery_with_price_json("super_results.json"),
    }
    
    return jsonify(grocery_discounts)

def load_grocery_json(filename="iga_results.json"):
    with open(filename, 'r') as file:
        data = json.load(file)

    food_names = []
    for category, items in data["categories"].items():
        food_names.extend(items.keys())

    return food_names

def load_grocery_with_price_json(filename="iga_results.json"):
    try:
        with open(filename, 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        return []
    
    food_items = []
    for category, items in data["categories"].items():
        for name, price in items.items():
            food_items.append({"name": name, "price": price})
    
    return food_items


if __name__ == '__main__':
    app.run(debug=True)