import http.client

conn = http.client.HTTPSConnection("streeteasy-api.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "0d76f1c9c6mshe0191c3ae5293bcp1ab141jsn90338ae5bde7",
    'x-rapidapi-host': "streeteasy-api.p.rapidapi.com"
}

conn.request("GET", "/rentals/search?areas=all-downtown%2Call-midtown&minPrice=2000&maxPrice=4000&minBeds=1&maxBeds=10&minBaths=1&noFee=false&limit=100&offset=0", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))