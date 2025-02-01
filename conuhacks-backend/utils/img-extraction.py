import pytesseract
from PIL import Image
import json
import re
from typing import List, Dict, Any

class GroceryImageProcessor:
    def __init__(self, image_path: str):
        self.image = Image.open(image_path)
        
    def extract_text(self) -> str:
        """Extract text from image using OCR"""
        return pytesseract.image_to_string(self.image, lang='fra+eng')

    def should_skip_line(self, line: str) -> bool:
        """Check if line should be skipped"""
        skip_patterns = [
            r'Relevez',
            r'défi du mois',
            r'Consulter',
            r'Consult',
            r'DISCOVER YOUR',
            r'OFFER EVERY',
            r'SCENE[+]',
            r'IGA',
            r'carte Scéne[+]',
            r'^\s*$',
            r'FROM THURSDAY',
            r'DU JEUDI',
            r'MYSTÈRE',
            r'MYSTERY',
            r'PTS',
            r'POINTS'
        ]
        return any(re.search(pattern, line, re.IGNORECASE) for pattern in skip_patterns)

    def clean_text(self, text: str) -> str:
        """Clean text by removing unwanted characters and normalizing spaces"""
        text = re.sub(r'[\'"`]', '', text)
        text = re.sub(r'\s+', ' ', text)
        text = text.strip(' .,')
        return text

    def extract_price(self, text: str) -> Dict[str, float]:
        """Extract all price information from text"""
        prices = {}
        
        # Regular price pattern (e.g., 5.97, 10.99)
        price_match = re.search(r'(\d+)[.,](\d{2})', text)
        if price_match:
            prices['price'] = float(f"{price_match.group(1)}.{price_match.group(2)}")
        
        # Scene+ card prices
        scene_match = re.search(r'avec\s+carte\s+(?:Scene|Scéne)[+]\s*(\d+)[.,](\d{2})', text, re.IGNORECASE)
        if scene_match:
            prices['scene_price'] = float(f"{scene_match.group(1)}.{scene_match.group(2)}")
            
        regular_match = re.search(r'sans\s+carte\s+(?:Scene|Scéne)[+]\s*(\d+)[.,](\d{2})', text, re.IGNORECASE)
        if regular_match:
            prices['regular_price'] = float(f"{regular_match.group(1)}.{regular_match.group(2)}")
            
        return prices

    def extract_volume(self, text: str) -> str:
        """Extract volume/weight information"""
        volume_match = re.search(r'(\d+)\s*(ml|g|kg|L)', text, re.IGNORECASE)
        if volume_match:
            return f"{volume_match.group(1)}{volume_match.group(2).lower()}"
        return ""

    def merge_product_info(self, items: List[Dict]) -> List[Dict]:
        """Merge related product information and remove duplicates"""
        merged = []
        current_item = None
        
        for item in items:
            name = item.get('name', '').upper()
            
            # Start new item if it's a main product
            if any(keyword in name for keyword in ['PIZZA', 'SAUMON', 'CHOU-FLEUR', 'COURONNE', 'GRUAU', 'MARGARINE', 'BLEUETS', 'SOUPE']):
                if current_item:
                    merged.append(current_item)
                current_item = item
            # Merge with current item if it's related information
            elif current_item:
                # Add missing price
                if 'price' in item and 'price' not in current_item:
                    current_item['price'] = item['price']
                # Add missing volume
                if 'volume' in item and 'volume' not in current_item:
                    current_item['volume'] = item['volume']
                # Merge description
                if 'description' in item:
                    if 'description' not in current_item:
                        current_item['description'] = item['description']
                    elif item['description'] not in current_item['description']:
                        current_item['description'] += f" / {item['description']}"
        
        if current_item:
            merged.append(current_item)
            
        return merged

    def process_items(self) -> List[Dict[Any, Any]]:
        """Process the extracted text into structured item data"""
        text = self.extract_text()
        lines = [self.clean_text(line) for line in text.split('\n') if line.strip()]
        
        items = []
        current_item = None
        
        for i, line in enumerate(lines):
            if self.should_skip_line(line):
                continue
                
            prices = self.extract_price(line)
            volume = self.extract_volume(line)
            
            # Start new item if line contains price or looks like a product name
            if prices or re.search(r'[A-Z]{3,}', line):
                if current_item:
                    items.append(current_item)
                current_item = {'name': line}
                if prices:
                    current_item.update(prices)
                if volume:
                    current_item['volume'] = volume
                    
                # Look ahead for description
                if i + 1 < len(lines) and not self.should_skip_line(lines[i + 1]):
                    next_line = lines[i + 1]
                    if not self.extract_price(next_line):
                        current_item['description'] = next_line
            
            # Add to current item if it exists
            elif current_item:
                if 'description' not in current_item:
                    current_item['description'] = line
        
        if current_item:
            items.append(current_item)
            
        # Merge related items and clean up
        items = self.merge_product_info(items)
        
        # Add units based on volume or product type
        for item in items:
            if 'volume' in item:
                if 'ml' in item['volume']:
                    item['unit'] = '/bottle'
                elif 'g' in item['volume'] or 'kg' in item['volume']:
                    item['unit'] = '/package'
            else:
                item['unit'] = '/unit'
        
        return items

    def output_json(self) -> str:
        """Output the processed items as a formatted JSON string"""
        items = self.process_items()
        return json.dumps({"items": items}, indent=2, ensure_ascii=False)

def main():
    # Initialize processor with image path
    processor = GroceryImageProcessor('conuhacks-backend/flyer/supermarche-iga/iga-02.jpg')
    
    # Get JSON output
    items = processor.process_items()
    
    # Print formatted output
    print("items =", json.dumps(items, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()