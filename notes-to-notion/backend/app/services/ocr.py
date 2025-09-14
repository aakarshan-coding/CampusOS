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


class TesseractOCR(OCREngine):
    """
    Tesseract OCR implementation.
    Requires tesseract-ocr and pytesseract to be installed.
    """
    
    def __init__(self, tesseract_cmd: Optional[str] = None):
        """
        Initialize Tesseract OCR engine
        
        Args:
            tesseract_cmd (str, optional): Path to tesseract executable.
                                         If None, uses system PATH
        """
        self.tesseract_cmd = tesseract_cmd
        
        # Try to import required libraries
        try:
            import pytesseract
            import pdf2image
            from PIL import Image
            
            self.pytesseract = pytesseract
            self.pdf2image = pdf2image
            self.Image = Image
            
            # Set tesseract command path if provided
            if tesseract_cmd:
                pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
                
        except ImportError as e:
            raise OCRError(f"Required OCR libraries not installed: {e}")
    
    def is_available(self) -> bool:
        """
        Check if Tesseract is properly installed and accessible
        """
        try:
            # Try to get tesseract version
            version = self.pytesseract.get_tesseract_version()
            return version is not None
        except Exception:
            return False
    
    def extract_text(self, file_path: str) -> str:
        """
        Extract text from PDF using Tesseract OCR
        
        Process:
        1. Convert PDF pages to images
        2. Run OCR on each image
        3. Combine text from all pages
        """
        if not self.is_available():
            raise OCRError("Tesseract OCR is not available")
        
        file_path = Path(file_path)
        if not file_path.exists():
            raise OCRError(f"File not found: {file_path}")
        
        try:
            # Convert PDF to images
            if file_path.suffix.lower() == '.pdf':
                return self._extract_from_pdf(str(file_path))
            else:
                # Handle image files directly
                return self._extract_from_image(str(file_path))
                
        except Exception as e:
            raise OCRError(f"Failed to extract text: {str(e)}")
    
    def _extract_from_pdf(self, pdf_path: str) -> str:
        """
        Extract text from PDF by converting to images first
        """
        try:
            # Convert PDF pages to images
            pages = self.pdf2image.convert_from_path(pdf_path)
            
            extracted_text = []
            
            # Process each page
            for page_num, page in enumerate(pages, 1):
                try:
                    # Extract text from this page
                    text = self.pytesseract.image_to_string(page, lang='eng')
                    
                    if text.strip():  # Only add non-empty text
                        extracted_text.append(f"--- Page {page_num} ---\n{text}")
                        
                except Exception as e:
                    # Log error but continue with other pages
                    print(f"Warning: Failed to process page {page_num}: {e}")
                    continue
            
            return "\n\n".join(extracted_text)
            
        except Exception as e:
            raise OCRError(f"PDF processing failed: {str(e)}")
    
    def _extract_from_image(self, image_path: str) -> str:
        """
        Extract text directly from image file
        """
        try:
            image = self.Image.open(image_path)
            text = self.pytesseract.image_to_string(image, lang='eng')
            return text
        except Exception as e:
            raise OCRError(f"Image processing failed: {str(e)}")


# Factory function to get OCR engine
def get_ocr_engine(engine_type: str = "tesseract", **kwargs) -> OCREngine:
    """
    Factory function to create OCR engine instances
    
    Args:
        engine_type (str): Type of OCR engine ('tesseract', 'google', 'aws', etc.)
        **kwargs: Additional arguments for the specific engine
        
    Returns:
        OCREngine: Configured OCR engine instance
        
    Raises:
        ValueError: If engine_type is not supported
    """
    if engine_type.lower() == "tesseract":
        return TesseractOCR(**kwargs)
    else:
        raise ValueError(f"Unsupported OCR engine: {engine_type}")