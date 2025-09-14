# Notes to Notion Converter (MVP)

A lightweight web-based tool that lets users upload handwritten Apple Notes, automatically converts them into plain text, and pushes them directly into their Notion workspace.

## Overview

This MVP solves a core problem: handwritten Apple Notes are "stuck" inside Apple's app—hard to copy, search, or use in workflows. This tool removes that friction by turning them into editable, searchable Notion pages.

### Target Users

- Students who want to take lecture notes by hand (on iPad/Apple Pencil) but later organize and search them in Notion.
- Working professionals who capture quick notes or meeting scribbles in Apple Notes but want them stored in Notion for easier integration into calendars, task lists, or projects.

## MVP Feature Set

- **One-way sync only**: Apple Notes → Notion
- **Manual workflow**:
  - User uploads Apple Notes export (PDF or text)
  - System extracts text (OCR for handwriting)
  - System pushes plain text into Notion via OAuth
- **Destination**: Notes stored in a single Notion page or database
- **User Control**: User can choose which notes to export
- **Feedback**: Simple confirmation message after export ("3 notes successfully added to Notion")

## What's Out of Scope (for MVP)

- No two-way sync
- No images, PDFs, or audio media
- No rich formatting
- No metadata (tags, dates, etc.)

## Definition of Success (MVP)

A user uploads one or more handwritten notes, and within 1–2 minutes sees clean text versions inside their Notion workspace.

## Project Structure

```
/
├── frontend/                # Next.js frontend
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   ├── components/      # React components
│   │   └── styles/          # CSS styles
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── next.config.js       # Next.js configuration
│   └── tsconfig.json        # TypeScript configuration
│
└── backend/                 # FastAPI backend
    ├── app/
    │   ├── routers/         # API route handlers
    │   ├── models/          # Data models
    │   ├── services/        # Business logic services
    │   ├── utils/           # Utility functions
    │   └── main.py          # FastAPI application entry point
    └── requirements.txt     # Backend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Python (v3.9 or later)
- Tesseract OCR (for text extraction)

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at http://localhost:3000

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python -m app.main
```

The API will be available at http://localhost:8000

## Development Roadmap

1. **MVP Implementation** (Current Phase)
   - Basic file upload and OCR functionality
   - Simple Notion integration
   - Minimal UI

2. **Future Enhancements** (Post-MVP)
   - Support for rich text formatting
   - Image and media handling
   - Metadata preservation
   - Two-way synchronization
   - Batch processing

## License

This project is proprietary and confidential.