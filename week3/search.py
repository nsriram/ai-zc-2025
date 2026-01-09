import zipfile
import os
from pathlib import Path
import minsearch

def extract_and_index_docs():
    """Extract md/mdx files from fastmcp zip and index them with minsearch"""

    zip_path = "fastmcp-main.zip"
    documents = []

    # Open and read the zip file
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        # Get all files in the zip
        file_list = zip_ref.namelist()

        # Filter for md and mdx files
        md_files = [f for f in file_list if f.endswith('.md') or f.endswith('.mdx')]

        print(f"Found {len(md_files)} markdown files")

        # Read each file
        for file_path in md_files:
            # Read the content
            with zip_ref.open(file_path) as f:
                content = f.read().decode('utf-8', errors='ignore')

            # Remove the first part of the path (fastmcp-main/)
            cleaned_path = '/'.join(file_path.split('/')[1:])

            # Skip if the cleaned path is empty (root level files that got filtered out)
            if cleaned_path:
                documents.append({
                    'filename': cleaned_path,
                    'content': content
                })

    print(f"Indexed {len(documents)} documents")

    # Initialize minsearch index
    index = minsearch.Index(
        text_fields=['content', 'filename'],
        keyword_fields=[]
    )

    # Fit the index with documents
    index.fit(documents)

    return index

def search_docs(index, query, top_k=5):
    """Search for documents using the query"""
    results = index.search(
        query,
        boost_dict={'content': 1, 'filename': 2},
        num_results=top_k
    )
    return results

if __name__ == "__main__":
    print("Extracting and indexing documents...")
    index = extract_and_index_docs()

    print("\nSearching for 'demo'...")
    results = search_docs(index, "demo", top_k=5)

    print(f"\nTop 5 results for query 'demo':")
    for i, result in enumerate(results, 1):
        print(f"{i}. {result['filename']}")
