import os
import re
import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager

def scrape_flyer_images(store: str, region: str):
    
    # Configure Chrome options for headless browsing
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode

    # Initialize WebDriver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.maximize_window()

    try:
        url = f"https://www.circulaires.com/{store}/?region={region}"
        driver.get(url)

        try:
            element = WebDriverWait(driver, 3).until(
                EC.element_to_be_clickable((By.XPATH, "//img[@alt='Circulaire IGA en images']/.."))
            )
            link = driver.find_element(By.XPATH, "//img[@alt='Circulaire IGA en images']/..")
            driver.execute_script("arguments[0].setAttribute('target', '_self');", link)
            link.click()
        except NoSuchElementException:
            print("Flyer link not found!")
            return

        try:
            WebDriverWait(driver, 3).until(
                EC.presence_of_element_located((By.XPATH, f"//a[@href='../page.do?region={region}']"))
            )
            td_element = driver.find_element(By.XPATH, f"//td[@width='65'][@valign='top'][@nowrap]//a[@href='../page.do?region={region}']")
            ActionChains(driver).move_to_element(td_element).click().perform()
        except NoSuchElementException:
            print("Could not find the flyer page link.")
            return

        try:
            WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.TAG_NAME, "table")))
            tables = driver.find_elements(By.TAG_NAME, 'table')
            second_table = tables[1]  # Flyer images usually appear in the second table
            images = second_table.find_elements(By.TAG_NAME, 'img')
        except NoSuchElementException:
            print("No flyer images found.")
            return

        save_folder = f'./flyer/{store}/'
        os.makedirs(save_folder, exist_ok=True)

        def clean_image_url(url):
            return url.split('?')[0]

        def download_image(url, folder):
            try:
                clean_url = clean_image_url(url)
                response = requests.get(clean_url, stream=True)
                if response.status_code == 200:
                    image_name = clean_url.split('/')[-1]
                    image_path = os.path.join(folder, image_name)

                    with open(image_path, 'wb') as file:
                        for chunk in response.iter_content(1024):
                            file.write(chunk)

                    print(f"Image downloaded: {image_name}")
                else:
                    print(f"Failed to download image from {url}")
            except Exception as e:
                print(f"Error downloading {url}: {e}")

        # Download images
        for img in images:
            img_url = img.get_attribute('src')
            if f'/flyer/{store}/' not in img_url:
                download_image(img_url, save_folder)

    finally:
        driver.quit()
        print("Scraping completed.")

scrape_flyer_images(store="supermarche-iga", region="Monteregie")
