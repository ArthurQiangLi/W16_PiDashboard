from flask import Flask, jsonify, render_template
from datetime import datetime
import math

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/sun-data')
def get_sun_data():
    return jsonify({
        "sunrise": "07:32",
        "sunset": "17:41",
        "solar_noon": "12:36",

    })

if __name__ == '__main__':
    app.run(debug=True)
