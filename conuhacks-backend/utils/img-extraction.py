import os
import base64
import json
from typing import List, Dict
from pathlib import Path
from dotenv import load_dotenv
import anthropic

project_root = Path(__file__).parent.parent
load_dotenv(project_root / '.env')

class ClaudeAPI:
    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = "claude-3-5-sonnet-20241022"  # Updated to latest model

    def encode_image(self, image_path: str) -> str:
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    def get_grocery_info(self, image_path: str) -> Dict:
        """Process a single image"""
        try:
            encoded_image = self.encode_image(image_path)
            
            message = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                temperature=0,  # Added for consistent outputs
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "Please analyze this grocery flyer and return a JSON array of items. For each item include: name, price, unit (if applicable), and any special deals. Format as valid JSON."
                            },
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": "image/jpeg",
                                    "data": encoded_image
                                }
                            }
                        ]
                    }
                ]
            )
            
            # Extract the content from the response
            return {
                "image": image_path,
                "content": message.content
            }

        except Exception as e:
            print(f"Error processing {image_path}: {str(e)}")
            return {"error": str(e), "image": image_path}

def process_flyer_images(api_key: str, image_paths: List[str], output_file: str):
    claude = ClaudeAPI(api_key)
    results = []
    
    for image_path in image_paths:
        print(f"\nProcessing {image_path}...")
        result = claude.get_grocery_info(image_path)
        results.append(result)
        
        # Save results after each image in case of failures
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({"results": results}, f, indent=2, ensure_ascii=False)
        print(f"Progress saved to {output_file}")

    print(f"\nAll processing complete. Results saved to {output_file}")

def main():
    # Load environment variables from .env file
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not found in .env file")
    
    if not api_key.startswith("sk-"):
        raise ValueError("Invalid API key format. Should start with 'sk-'")

    # Example image paths
    image_paths = [
        'conuhacks-backend/flyer/supermarche-iga/iga-01.jpg'
    ]

    process_flyer_images(api_key, image_paths, "grocery_results.json")

if __name__ == "__main__":
    main()