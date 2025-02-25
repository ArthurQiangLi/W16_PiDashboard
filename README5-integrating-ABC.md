# 1. Integrating ABC parts

![abc parts](./90-markdown-resources/201-ABC%20parts%20requirements.png)

## 1.1. Requirements

### 1.1.1. Backend response:

- '/data1' responses {"sunrise": "07:32", "sunset":17:41}
- '/data2' responses {"weather": snow, "temp": -2.1}

### 1.1.2. Frontend

Frontend is a single webpage comprised of 3 main box: A, B and C. Each part displays as a box.

- B requests '/data1' from backend every 1 min and updates its content (display sunset-sunrise time). B also put a global data set in global.js (A will read it).
- C requests '/data2' from backend every 10 min and updates its content (display weather)
- A has no request, but it needs to read '/data1' result (in global.js). A updates its content (a clock) every 1 second
- When page is loaded, '/data1' and '/data2' is request and all 3 boxes updates.
- Each box has its own .html, .js files so it's easy to manage the project.
- When time is between 'sunrise' and 'sunset', set the theme to 'light', otherwise set the theme 'dark'.

## 1.2. Project Structure

```
/flask_project/
│── app.py
│── static/
│   ├── css/
│   │   ├── style.css
│   ├── js/
│   │   ├── global.js
│   │   ├── box_a.js
│   │   ├── box_b.js
│   │   ├── box_c.js
│── templates/
│   ├── index.html
│   ├── box_a.html
│   ├── box_b.html
│   ├── box_c.html
│── config.py
│── requirements.txt
│── run.py
```
