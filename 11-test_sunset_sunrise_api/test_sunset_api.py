import requests

LAT, LON = 43.47053, -80.56186  # Residence at U of Waterloo
API_URL = "https://api.sunrise-sunset.org/json"
TIMEZONE_ID = "America/Toronto" # If you don't give this argument, the time will be in UTC Britsh time.
DATE = "today"  # 2025-02-05

params = {"lat": LAT, "lng": LON, "formatted": 1, "tzid":TIMEZONE_ID, "date": DATE}
response = requests.get(API_URL, params=params)

if response.status_code == 200:
    print("API Response:", response.json())
else:
    print("Failed to access API. Status Code:", response.status_code)
