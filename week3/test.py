import requests

jina_url = "https://r.jina.ai/"

def get_site_content(url: str) -> str:
    full_url = jina_url + url
    response = requests.get(full_url)
    return response.text

content = get_site_content("https://github.com/alexeygrigorev/minsearch")
print(f"Content length: {len(content)}")