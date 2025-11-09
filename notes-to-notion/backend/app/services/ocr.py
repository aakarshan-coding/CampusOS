from abc import ABC, abstractmethod
from typing import Optional
import os
import tempfile
from pathlib import Path


class OCREngine(ABC):
    """
    Abstract base class for OCR engines.
    This interface allows easy swapping between different OCR providers
    (Tesseract, Google Vision, AWS Textract, etc.)
    """
    
    @abstractmethod
    def extract_text(self, file_path: str) -> str:
        """
        Extract text from a file (PDF, image, etc.)
        
        Args:
            file_path (str): Path to the file to process
            
        Returns:
            str: Extracted text content
            
        Raises:
            OCRError: If text extraction fails
        """
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """
        Check if the OCR engine is properly configured and available
        
        Returns:
            bool: True if engine is ready to use, False otherwise
        """
        pass


class OCRError(Exception):
    """Custom exception for OCR-related errors"""
    pass


def extract_text(file_path: str) -> str:
    """
    Extract text from a PDF file using Google Cloud Vision API.
    
    This function replaces the previous Tesseract implementation with Google Cloud Vision API
    while maintaining the same function signature for compatibility.
    
    Args:
        file_path (str): Path to the PDF file to process
        
    Returns:
        str: Extracted text content from all pages
        
    Raises:
        OCRError: If text extraction fails
        
    Environment Variables Required:
        GOOGLE_APPLICATION_CREDENTIALS: Path to service account JSON file
    """
    try:
        # Import Google Cloud Vision API client
        from google.cloud import vision
        import io
        
        # Verify file exists
        file_path = Path(file_path)
        if not file_path.exists():
            raise OCRError(f"File not found: {file_path}")
        
        # Initialize the Google Cloud Vision client
        client = vision.ImageAnnotatorClient()
        
        # Handle PDF files
        if file_path.suffix.lower() == '.pdf':
            return _extract_text_from_pdf(client, str(file_path))
        else:
            # Handle image files directly
            return _extract_text_from_image(client, str(file_path))
            
    except ImportError:
        raise OCRError(
            "Google Cloud Vision API client not installed. "
            "Install with: pip install google-cloud-vision"
        )
    except Exception as e:
        raise OCRError(f"Failed to extract text: {str(e)}")


def _extract_text_from_pdf(client, pdf_path: str) -> str:
    """
    Extract text from PDF using Google Cloud Vision API.
    
    Args:
        client: Google Cloud Vision client instance
        pdf_path (str): Path to the PDF file
        
    Returns:
        str: Extracted text from all pages
    """
    try:
        # Read the PDF file
        with open(pdf_path, 'rb') as pdf_file:
            pdf_content = pdf_file.read()
        
        # Configure the request for PDF processing
        input_config = {
            'mime_type': 'application/pdf',
            'content': pdf_content
        }
        
        # Configure output (we'll process in memory)
        features = [{'type_': 'DOCUMENT_TEXT_DETECTION'}]
        
        # Make the request to Google Cloud Vision
        request = {
            'requests': [{
                'input_config': input_config,
                'features': features
            }]
        }
        
        # For PDF files, we need to use the async batch annotation
        # But for simplicity, we'll convert PDF to images first
        return _extract_text_from_pdf_via_images(client, pdf_path)
        
    except Exception as e:
        raise OCRError(f"PDF processing failed: {str(e)}")


def _extract_text_from_pdf_via_images(client, pdf_path: str) -> str:
    """
    Extract text from PDF by converting to images first, then using Vision API.
    
    Args:
        client: Google Cloud Vision client instance
        pdf_path (str): Path to the PDF file
        
    Returns:
        str: Extracted text from all pages
    """
    try:
        # Import pdf2image for PDF to image conversion
        from pdf2image import convert_from_path
        import io
        
        # Convert PDF pages to images
        pages = convert_from_path(pdf_path)
        
        extracted_text = []
        
        # Process each page
        for page_num, page_image in enumerate(pages, 1):
            try:
                # Convert PIL image to bytes
                img_byte_arr = io.BytesIO()
                page_image.save(img_byte_arr, format='PNG')
                img_byte_arr = img_byte_arr.getvalue()
                
                # Create Vision API image object
                image = {'content': img_byte_arr}
                
                # Perform text detection
                response = client.text_detection(image=image)
                
                # Extract text from response
                if response.text_annotations:
                    page_text = response.text_annotations[0].description
                    if page_text and page_text.strip():
                        extracted_text.append(f"--- Page {page_num} ---\n{page_text}")
                
                # Check for errors
                if response.error.message:
                    print(f"Warning: Error processing page {page_num}: {response.error.message}")
                    
            except Exception as e:
                print(f"Warning: Failed to process page {page_num}: {e}")
                continue
        
        return "\n\n".join(extracted_text)
        
    except ImportError:
        raise OCRError(
            "pdf2image library not installed. "
            "Install with: pip install pdf2image"
        )
    except Exception as e:
        raise OCRError(f"PDF to image conversion failed: {str(e)}")


def _extract_text_from_image(client, image_path: str) -> str:
    """
    Extract text directly from image file using Google Cloud Vision API.
    
    Args:
        client: Google Cloud Vision client instance
        image_path (str): Path to the image file
        
    Returns:
        str: Extracted text content
    """
    try:
        # Read the image file
        with open(image_path, 'rb') as image_file:
            content = image_file.read()
        
        # Create Vision API image object
        image = {'content': content}
        
        # Perform text detection
        response = client.text_detection(image=image)
        
        # Extract text from response
        if response.text_annotations:
            return response.text_annotations[0].description
        else:
            return ""
            
        # Check for errors
        if response.error.message:
            raise OCRError(f"Vision API error: {response.error.message}")
            
    except Exception as e:
        raise OCRError(f"Image processing failed: {str(e)}")


# Legacy class-based implementation (kept for backward compatibility)
class TesseractOCR(OCREngine):
    """
    Tesseract OCR implementation (legacy).
    Note: This is kept for backward compatibility but not actively used.
    """
    
    def __init__(self, tesseract_cmd: Optional[str] = None):
        self.tesseract_cmd = tesseract_cmd
    
    def is_available(self) -> bool:
        return False  # Disabled in favor of Google Cloud Vision
    
    def extract_text(self, file_path: str) -> str:
        # Redirect to the new standalone function
        return extract_text(file_path)


# Factory function to get OCR engine
def get_ocr_engine(engine_type: str = "google", **kwargs) -> OCREngine:
    """
    Factory function to create OCR engine instances
    
    Args:
        engine_type (str): Type of OCR engine ('google', 'tesseract', etc.)
        **kwargs: Additional arguments for the specific engine
        
    Returns:
        OCREngine: Configured OCR engine instance
        
    Raises:
        ValueError: If engine_type is not supported
    """
    if engine_type.lower() in ["google", "tesseract"]:
        return TesseractOCR(**kwargs)  # Now uses Google Cloud Vision internally
    else:
        raise ValueError(f"Unsupported OCR engine: {engine_type}")