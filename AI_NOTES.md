## 1. What AI Was Used For

AI was used to process raw meeting transcripts and extract structured action items.

Specifically, the model was used to:

- Identify actionable tasks from conversational text
- Detect task owners (if mentioned)
- Detect due dates (if mentioned)
- Convert unstructured text into structured JSON format

The AI model acts as the "intelligence layer" that transforms natural language into structured data suitable for storage and display.

Without AI, this would require complex rule-based NLP logic (regex, heuristics, entity detection), which would be less flexible and harder to maintain.

---

## 2. What Was Implemented and Verified Manually

The following parts were implemented and validated without AI assistance:

- Flask backend routes (CRUD operations)
- Database schema and SQLite integration
- Frontend UI (HTML + Tailwind CSS)
- Modal-based editing system
- Add / Edit / Delete functionality
- Done / Undo toggle logic
- Filtering (All / Open / Done)
- Transcript history tracking (last 5 entries)
- Loading spinner and success feedback UI
- Error handling for API requests
- Debugging HTTP errors (e.g., 405 Method Not Allowed)
- Proper ordering of items (newest first)
- GitHub setup and environment variable configuration

All CRUD operations and UI behaviors were manually tested to ensure correctness.

---

## 3. LLM and Provider Used

- **LLM Provider:** Hugging Face
- **Access Method:** Hugging Face Inference API
- **Model Type:** Instruction-tuned Large Language Model (LLM) for text generation / structured extraction

### Why Hugging Face?

Hugging Face was chosen because:

- It provides easy API access to powerful open-source LLMs
- It supports text generation and instruction-following models
- It allows structured prompting for JSON output
- It is flexible and suitable for rapid prototyping
- It does not require hosting a model locally

---

## 4. Why an LLM Was Appropriate

Meeting transcripts are:

- Unstructured
- Conversational
- Inconsistent in format
- Ambiguous in task assignment

A rule-based approach would struggle with variability.

An LLM is better suited because it can:

- Understand conversational context
- Infer implied ownership
- Recognize time expressions
- Extract multiple tasks from long text
- Handle messy real-world language

---

## 5. Limitations of the Current AI Approach

- Extraction accuracy depends on transcript clarity
- No confidence score is currently stored
- No validation against hallucinated tasks
- No post-processing validation layer
- No fine-tuning specific to meeting transcripts

---

## 6. Potential AI Improvements

- Add confidence scoring
- Add transcript summarization
- Add task priority detection
- Add entity normalization (date standardization)
- Add evaluation metrics for extraction accuracy
- Switch to streaming responses for better UX
- Compare performance across different LLM providers

---

## 7. Design Philosophy

The AI layer is intentionally separated from:

- UI logic
- Database operations
- Task state management

This ensures:

- Clean architecture
- Easier future model replacement
- Scalability for production deployment
- Clear separation of intelligence vs application logic
