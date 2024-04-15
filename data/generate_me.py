from bs4 import BeautifulSoup
import requests
from datetime import datetime as dt
import json
import os

def find_news():
    html_text = requests.get('https://www.republika.co.id/').text
    soup = BeautifulSoup(html_text, 'lxml')
    news = soup.find_all('li', class_='list-group-item list-border conten1')
    data = []

    # Memeriksa apakah file JSON sudah ada dan memiliki data
    if os.path.exists('./data.json') and os.path.getsize('./data.json') > 0:
        with open('./data.json', 'r') as f:
            existing_data = json.load(f)
    else:
        existing_data = []

    existing_titles = [item['Judul'] for item in existing_data]

    for new in news:
        title = new.h3.text.strip()
        categories = new.find('span', class_='kanal-info').text
        waktu = new.find('div', class_='date').text.split('-')
        waktu_publish = waktu[1].strip()
        waktu_scrap = dt.now().strftime("%d %b %Y %H:%M:%S")
        tautan = new.a['href']
        info = {
            "Judul": title,
            "Kategori": categories,
            "Waktu Publish": waktu_publish,
            "Waktu Scrapping": waktu_scrap,
            "Tautan": tautan
        }
        if title not in existing_titles:
            data.append(info)
            existing_titles.append(title)

    # Menggabungkan data baru dengan data yang sudah ada jika ada
    all_data = existing_data + data

    # Menulis data ke file JSON
    with open('./data.json', 'w') as f:
        json.dump(all_data, f, indent=2)

if __name__ == '__main__':
    find_news()
