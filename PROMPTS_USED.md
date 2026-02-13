This document records the prompts used during development of the Meeting Action Items Tracker project.

It includes:

- The production prompt used in the application
- Development prompts used to build and refine the app

It does NOT include:

- Model responses
- API keys
- Sensitive configuration data

---

# 1️ Production Prompt (Used in app.py)

The following prompt is used inside `extract_action_items()` to extract structured action items from transcripts:

```bash
Extract action items from this meeting transcript.

Return ONLY valid JSON list like:
[
{
"task": "task description",
"owner": "person name or null",
"due_date": "due date or null",
"tags": "short tag or null"
}
]

Transcript:
{transcript_text}
```

---

# 2 Prompt Design Considerations

The production prompt was designed to:

- Minimize hallucinations
- Enforce structured JSON output
- Reduce verbosity
- Lower temperature for consistency
- Avoid extra explanation text

To handle cases where the model still returned extra text,
a regex-based JSON extraction function (`extract_json_from_text`) was implemented to safely parse the output.

---

# 3 Files Containing Prompts

The only file in the project containing a direct LLM prompt is:

- `app.py` → inside `extract_action_items()`

No other backend or frontend files contain AI prompts.

---

# 4 Prompt Engineering Notes

- A strict "Return ONLY valid JSON" instruction was used.
- Low temperature (0.2) was chosen for deterministic outputs.
- JSON format example was included to guide structure.
- Post-processing validation was added to handle malformed responses.

---
