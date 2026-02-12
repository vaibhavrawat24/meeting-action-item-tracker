import os
import json
import re
import requests
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from models import db, Transcript, ActionItem

load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tracker.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# 🔹 Hugging Face Config
HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL = os.getenv("HF_MODEL", "deepseek-ai/DeepSeek-V3-0324")
HF_API_URL = "https://router.huggingface.co/v1/chat/completions"

with app.app_context():
    db.create_all()


def extract_json_from_text(text):
    """
    Extract JSON list from model response even if extra text is present.
    """
    try:
        match = re.search(r"\[.*\]", text, re.DOTALL)
        if match:
            return json.loads(match.group())
        return []
    except:
        return []


def extract_action_items(transcript_text):
    prompt = f"""
Extract action items from this meeting transcript.

Return ONLY valid JSON list like:
[
  {{
    "task": "task description",
    "owner": "person name or null",
    "due_date": "due date or null",
    "tags": "short tag or null"
  }}
]

Transcript:
{transcript_text}
"""

    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": HF_MODEL,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2
    }

    response = requests.post(HF_API_URL, headers=headers, json=payload)

    try:
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        return extract_json_from_text(content)
    except Exception as e:
        print("HF RAW RESPONSE:", response.text)
        return []


@app.route("/")
def home():
    return render_template("index.html")


# 🔹 Process Transcript
@app.route("/process_transcript", methods=["POST"])
def process_transcript():
    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"error": "No transcript provided"}), 400

    transcript = Transcript(text=text)
    db.session.add(transcript)
    db.session.commit()

    items = extract_action_items(text)

    for item in items:
        action = ActionItem(
            transcript_id=transcript.id,
            task=item.get("task"),
            owner=item.get("owner"),
            due_date=item.get("due_date"),
            tags=item.get("tags")
        )
        db.session.add(action)

    db.session.commit()

    return jsonify({"message": "Processed successfully"})


# 🔹 Get all items
@app.route("/items")
def get_items():
    items = ActionItem.query.all()
    return jsonify([
        {
            "id": i.id,
            "task": i.task,
            "owner": i.owner,
            "due_date": i.due_date,
            "tags": i.tags,
            "done": i.done
        }
        for i in items
    ])


# 🔹 Toggle done
@app.route("/item/<int:item_id>/toggle", methods=["POST"])
def toggle_done(item_id):
    item = ActionItem.query.get_or_404(item_id)
    item.done = not item.done
    db.session.commit()
    return jsonify({"success": True})


# 🔹 Delete item
@app.route("/item/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    item = ActionItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"success": True})


# 🔹 Last 5 transcripts
@app.route("/transcripts")
def last_transcripts():
    transcripts = Transcript.query.order_by(Transcript.created_at.desc()).limit(5)
    return jsonify([
        {
            "id": t.id,
            "text": t.text[:100] + "..."
        }
        for t in transcripts
    ])


if __name__ == "__main__":
    app.run(debug=True)

# 🔹 Add new item manually
@app.route("/item", methods=["POST"])
def add_item():
    data = request.json

    item = ActionItem(
        transcript_id=None,
        task=data.get("task"),
        owner=data.get("owner"),
        due_date=data.get("due_date"),
        tags=data.get("tags"),
        done=False
    )

    db.session.add(item)
    db.session.commit()

    return jsonify({"success": True})


# 🔹 Edit item
@app.route("/item/<int:item_id>", methods=["PUT"])
def edit_item(item_id):
    item = ActionItem.query.get_or_404(item_id)
    data = request.json

    item.task = data.get("task")
    item.owner = data.get("owner")
    item.due_date = data.get("due_date")
    item.tags = data.get("tags")

    db.session.commit()

    return jsonify({"success": True})
