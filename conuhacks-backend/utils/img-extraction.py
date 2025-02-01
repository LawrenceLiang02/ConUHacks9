import cv2
import pytesseract
import re
from PIL import Image
import numpy as np

image_path = "image.png"  # Update with your image path
image = cv2.imread(image_path)

# Preprocess image for better OCR accuracy
def preprocess_image(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)   # Reduce noise
    _, thresh = cv2.threshold(blurred, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)  # Apply thresholding
    return thresh

# Run OCR on preprocessed image
preprocessed_img = preprocess_image(image)
ocr_text = pytesseract.image_to_string(preprocessed_img, lang="eng")  # Extract text

# Define regex patterns to extract grocery items and prices
price_pattern = r"\$\d+\.\d{2}"  # Matches prices like $5.99
item_pattern = r"[A-Za-z\s&-]+(?=\s*\$\d+\.\d{2})"  # Matches items appearing before a price

# Extract data using regex
prices = re.findall(price_pattern, ocr_text)
items = re.findall(item_pattern, ocr_text)

# Clean up extracted data
grocery_list = list(zip(items, prices))

# Display results
print("Extracted Grocery Items & Prices:")
for item, price in grocery_list:
    print(f"- {item.strip()} -> {price}")
