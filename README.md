# 📌 Meeting Action Items Tracker (Mini Workspace)

A simple AI-powered web application that extracts action items from meeting transcripts and allows you to manage them in a mini task workspace.

You can check the live project here :- https://meeting-action-item-tracker.onrender.com/ (this takes 50-60 sec to load, since this is hosted for free on render)

# Note
Sometimes the transcripts are not processed because this project is using hugging face api and it has token limits. You can check the status page, /status, it will throw 404 for llm, which means the token limits are expired.

---

## Demo
<img width="924" height="317" alt="image" src="https://github.com/user-attachments/assets/fe31f495-35d6-4284-a545-71af1d48bfb3" />
<img width="620" height="392" alt="image" src="https://github.com/user-attachments/assets/73c3314e-19b2-4a10-9130-3c8cd851a837" />

---
## 🚀 Features Implemented

- Paste a meeting transcript (plain text)
- AI extracts structured action items:
  - Task
  - Owner (if detected)
  - Due date (if detected)
- View extracted action items in a clean UI
- Add new action items manually
- Edit existing action items (modal-based editing)
- Delete action items
- Mark items as done / undo
- Filter items (All / Open / Done)
- View history of the last 5 processed transcripts
---
## What Is not Implemented
- ⚠️ This website is currently not mobile responsive due to time constraints.

---

## 🛠 Tech Stack

- **Backend:** Flask (Python)
- **Frontend:** HTML + Tailwind CSS + Vanilla JavaScript
- **Database:** SQLite
- **AI Processing:** Hugging Face API (LLM-based transcript parsing)

---

## ⚙️ How to Run Locally

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it:

* Mac/Linux:
```bash
  source venv/bin/activate
```
* Windows:
```bash
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Environment Variables

Create a .env file in the root directory:

```bash
HF_API_KEY=your_huggingface_api_key
SECRET_KEY=your_secret_key
```

### 5. Run the Application

```bash
python app.py
```

Open your browser and go to:

```bash
http://127.0.0.1:5000
```

---
## Data Storage

- Action items are stored in a local SQLite database (tracker.db)
- The last 5 processed transcripts are saved and displayed in the history section

---

## 🔎 Status Page (Health Check)

The application includes a health check endpoint to verify system status.

You can access it at:

```bash
http://127.0.0.1:5000/status
```


This endpoint returns a JSON response showing the health of:

- **Backend** – Confirms the Flask server is running
- **Database** – Verifies SQLite connection is working
- **LLM Connection** – Checks connectivity to the Hugging Face API

### Example Response

```json
{
  "backend": "ok",
  "database": "ok",
  "llm_connection": "ok"
}
```

If any dependency fails, the response will indicate the error.

This endpoint helps ensure the system and its external dependencies are functioning correctly.

---
