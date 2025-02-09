# Getting sunset and sunrise time

There are 3 ways I've known here:

1. This site's API is free (by 2025/2/5] [https://sunrise-sunset.org/api] <br> I tested it in this [test_sunset_api.py](./11-test_sunset_sunrise_api/test_sunset_api.py) python code and the result is [test_result.json](./11-test_sunset_sunrise_api/test_result.json).
2. The OpenWeather API also return the sunset-sunrise data as <br> `"sys": { "type": 2, "id": 2099608, "country": "CA", "sunrise": 1738845125, "sunset": 1738881614 },`
3. The is standalone program to calculate base on LAT, LON, and date. I haven't tested this method.

## Example data:

For now I found the most important data are `sunrise`, `sunset`, and `solar_noon`. However, the `solar_noon` is the middle value of sunrise and sunset. So you only need two.

```json
"formatted=1": {
"results": {
    "sunrise": "7:31:29 AM",
    "sunset": "5:41:01 PM",
    "solar_noon": "12:36:15 PM",
    "day_length": "10:09:32",
    "civil_twilight_begin": "7:03:02 AM",
    "civil_twilight_end": "6:09:27 PM",
    "nautical_twilight_begin": "6:29:04 AM",
    "nautical_twilight_end": "6:43:26 PM",
    "astronomical_twilight_begin": "5:55:41 AM",
    "astronomical_twilight_end": "7:16:48 PM"
},
"status": "OK",
"tzid": "America/Toronto"
}

```

## I'll choose the 2nd way by now. [2025-02-06 18:42:01]

In `b.js` I used the '/data1' result and parsed the sunset-sunrise data.
The original json data was like:

```json
"sys": { "type": 2, "id": 2099608, "country": "CA", "sunrise": 1738845125, "sunset": 1738881614 },
"timezone": -18000,
```

```js
// Function to update g_sunData from /data1
function updateSunData(data) {
  if (data.sys && data.sys.sunrise && data.sys.sunset) {
    const timezoneOffset = data.timezone;

    g_sunData.sunrise = convertToLocalTime(data.sys.sunrise, timezoneOffset);
    g_sunData.sunset = convertToLocalTime(data.sys.sunset, timezoneOffset);

    // Calculate Solar Noon (average of sunrise and sunset)
    const solarNoonTimestamp = (data.sys.sunrise + data.sys.sunset) / 2;
    g_sunData.solar_noon = convertToLocalTime(solarNoonTimestamp, timezoneOffset);

    g_sunData.timezone = timezoneOffset;
    //console.log(g_sunData);
  }
}
```

The extracted data was stored to `global.js` which has only one line of code:

```js
var g_sunData = { sunrise: "06:00", sunset: "18:00", solar_noon: "12:00", timezone: -18000 };
```
