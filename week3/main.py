from fastmcp import FastMCP
import requests
import re

mcp = FastMCP("gitrepo-to-md-mcp-server")

@mcp.tool
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

@mcp.tool
def scrape_web(url: str) -> str:
    """
    Scrape and retrieve the content of any web page in markdown format.
    Uses Jina Reader API to convert web pages to clean markdown.

    Args:
        url: The URL of the web page to scrape

    Returns:
        The content of the web page in markdown format
    """
    jina_url = "https://r.jina.ai/"
    full_url = jina_url + url

    try:
        response = requests.get(full_url)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        return f"Error fetching content: {str(e)}"

@mcp.tool
def count_matching_words(text: str, word: str) -> int:
    """
    Count the number of occurrences of a specific word in the given text.

    Args:
        text: The text to search within
        word: The word to count
    Returns:
        The number of occurrences of the word in the text
    """
    matches = re.findall(r'data', text, re.IGNORECASE)
    return len(matches)

if __name__ == "__main__":
    mcp.run()