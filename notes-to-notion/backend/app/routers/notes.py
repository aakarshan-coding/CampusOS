from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from typing import List, Optional
import os
import uuid
import shutil
from pathlib import Path
import tempfile

# Import our OCR service
from app.services.ocr_service import OCRService
# Import text cleanup service
from app.services.text_cleanup import clean_text, get_cleanup_stats

router = APIRouter()

@router.get("/hello")
async def hello_world():
    """Simple Hello World endpoint"""
    return {"message": "Hello World"}

@router.post("/upload")
async def upload_files(
    files: List[UploadFile] = File(...),
):
    """Upload text or PDF files for processing"""
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = Path("uploads")
        upload_dir.mkdir(exist_ok=True)
        
        uploaded_files = []
        
        for file in files:
            # Validate file type
            if not file.filename:
                continue
                
            file_extension = Path(file.filename).suffix.lower()
            if file_extension not in [".txt", ".pdf"]:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Unsupported file type: {file_extension}. Only .txt and .pdf files are allowed."
                )
            
            # Generate unique filename
            file_id = str(uuid.uuid4())
            safe_filename = f"{file_id}_{file.filename}"
            file_path = upload_dir / safe_filename
            
            # Save file to disk
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            uploaded_files.append({
                "file_id": file_id,
                "original_filename": file.filename,
                "saved_filename": safe_filename,
                "file_size": file_path.stat().st_size,
                "file_type": file_extension
            })
        
        return {
            "message": f"Successfully uploaded {len(uploaded_files)} files",
            "files": uploaded_files
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/convert")
async def convert_to_text(
    file_id: str = Form(...),
):
    """Convert uploaded note to text using OCR"""
    try:
        # Placeholder for OCR conversion logic
        return {"message": "Note converted successfully", "file_id": file_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process")
async def process_pdf(
    file: UploadFile = File(...)
):
    """
    Process uploaded PDF file using OCR to extract text
    
    This endpoint:
    1. Accepts a PDF file upload
    2. Saves it temporarily
    3. Uses OCR to extract text content
    4. Returns the extracted text
    5. Cleans up temporary files
    """
    # Validate file type
    if not file.filename or not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400, 
            detail="Only PDF files are supported for OCR processing"
        )
    
    # Create temporary file to store uploaded PDF
    temp_file = None
    try:
        # Create temporary file with PDF extension
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            # Copy uploaded file content to temporary file
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name
        
        # Extract text from PDF using OCR service
        raw_text = await OCRService.extract_text_from_pdf(temp_file_path)
        
        # Check if text extraction was successful
        if raw_text is None:
            raise HTTPException(
                status_code=422,
                detail="Failed to extract text from PDF. The file may be corrupted or contain no readable text."
            )
        
        # Clean the extracted text
        cleaned_text = clean_text(raw_text)
        
        # Get cleanup statistics
        cleanup_stats = get_cleanup_stats(raw_text, cleaned_text)
        
        # Return results with both raw and cleaned text
        return {
            "message": "PDF processed successfully",
            "filename": file.filename,
            "raw_text": raw_text,
            "cleaned_text": cleaned_text,
            "raw_text_length": len(raw_text),
            "cleaned_text_length": len(cleaned_text),
            "has_text": bool(cleaned_text.strip()),
            "cleanup_stats": cleanup_stats
        }
        
    except Exception as e:
        # Check if it's a Tesseract-related error
        error_message = str(e)
        if "TesseractNotFoundError" in error_message or "Tesseract OCR not found" in error_message:
            raise HTTPException(
                status_code=503, 
                detail="Tesseract OCR not installed. Please install Tesseract OCR and restart the server."
            )
        else:
            raise HTTPException(status_code=500, detail=f"Processing failed: {error_message}")
    finally:
        # Clean up temporary file
        if temp_file and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except Exception as e:
                print(f"Warning: Failed to delete temporary file {temp_file_path}: {e}")


@router.post("/export-to-notion")
async def export_to_notion(
    file_id: str = Form(...),
    notion_page_id: Optional[str] = Form(None),
):
    """Export converted note to Notion"""
    try:
        # Placeholder for Notion export logic
        return {"message": "Note exported to Notion successfully", "file_id": file_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))