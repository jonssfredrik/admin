import json
import urllib.request

# Ask user for the URL
url = input('Enter URL to JSON file: ').strip()

# Fetch and parse the JSON
with urllib.request.urlopen(url) as response:
    data = json.load(response)

# Count entries in the 'data' array
domain_count = len(data['data'])
print(f'Number of domains: {domain_count}')
