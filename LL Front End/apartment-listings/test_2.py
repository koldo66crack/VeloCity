from apify_client import ApifyClient

# Initialize the ApifyClient with your Apify API token
# Replace '<YOUR_API_TOKEN>' with your token.
client = ApifyClient("apify_api_wCxo0Mhc6qLErfmSOt8SckV5vR7mPt0y4VGy")

# Prepare the Actor input
run_input = { "location": ["Morningside Heights"], "search_type": "rent" , "limit": 1000 }

# Run the Actor and wait for it to finish
run = client.actor("jupri/streeteasy-scraper").call(run_input=run_input)

# Fetch and print Actor results from the run's dataset (if there are any)
print("💾 Check your data here: https://console.apify.com/storage/datasets/" + run["defaultDatasetId"])
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(item)

