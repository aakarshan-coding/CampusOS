import os
import pytesseract
from PIL import Image
from typing import Optional
import logging
import platform

logger = logging.getLogger(__name__)

# Configure Tesseract path for Windows
if platform.system() == 'Windows':
    # Common Tesseract installation paths on Windows
    possible_paths = [
        r'C:\Program Files\Tesseract-OCR\tesseract.exe',
        r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
        r'C:\Users\{}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'.format(os.getenv('USERNAME', '')),
    ]
    
    tesseract_path = None
    for path in possible_paths:
        if os.path.exists(path):
            tesseract_path = path
            break
    
    if tesseract_path:
        pytesseract.pytesseract.tesseract_cmd = tesseract_path
        logger.info(f"Tesseract found at: {tesseract_path}")
    else:
        logger.warning("Tesseract not found in common installation paths. Please install Tesseract OCR.")
        logger.warning("Download from: https://github.com/UB-Mannheim/tesseract/wiki")
        logger.warning("After installation, restart the server.")

class OCRService:
    """Service for performing OCR on images and PDFs"""
    
    @staticmethod
    async def extract_text_from_image(image_path: str) -> Optional[str]:
        """Extract text from an image file using OCR"""
        try:
            # Open the image
            image = Image.open(image_path)
            
            # Perform OCR
            text = pytesseract.image_to_string(image)
            
            return text
        except pytesseract.TesseractNotFoundError as e:
            error_msg = (
                "Tesseract OCR not found. Please install Tesseract OCR:\n"
                "1. Download from: https://github.com/UB-Mannheim/tesseract/wiki\n"
                "2. Install the .exe file\n"
                "3. Restart this server\n"
                f"Error details: {e}"
            )
            logger.error(error_msg)
            raise Exception("Tesseract OCR not installed. Please install Tesseract OCR from https://github.com/UB-Mannheim/tesseract/wiki")
        except Exception as e:
            logger.error(f"Error extracting text from image: {e}")
            raise Exception(f"OCR processing failed: {str(e)}")
    
    @staticmethod
    async def extract_text_from_pdf(pdf_path: str) -> Optional[str]:
        """Extract text from a PDF file using OCR"""
        try:
            # Import pdf2image for PDF to image conversion
            from pdf2image import convert_from_path
            
            # Set poppler path for Windows
            poppler_path = None
            if platform.system() == 'Windows':
                # Use the poppler binaries we downloaded
                current_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
                poppler_path = os.path.join(current_dir, 'poppler', 'poppler-25.07.0', 'Library', 'bin')
                if not os.path.exists(poppler_path):
                    logger.warning(f"Poppler not found at {poppler_path}")
                    poppler_path = None
            
            # Convert PDF pages to images
            if poppler_path:
                pages = convert_from_path(pdf_path, poppler_path=poppler_path)
            else:
                pages = convert_from_path(pdf_path)
            
            extracted_text = ""
            for page_num, page in enumerate(pages, 1):
                try:
                    # Extract text from each page
                    page_text = pytesseract.image_to_string(page)
                    if page_text.strip():
                        extracted_text += f"\n--- Page {page_num} ---\n{page_text}\n"
                except Exception as page_error:
                    logger.warning(f"Error processing page {page_num}: {page_error}")
                    continue
            
            return extracted_text.strip() if extracted_text.strip() else None
            
        except ImportError:
            error_msg = (
                "pdf2image library not found. Installing...\n"
                "Please wait while we install the required dependency."
            )
            logger.error(error_msg)
            # Try to install pdf2image
            try:
                import subprocess
                import sys
                subprocess.check_call([sys.executable, "-m", "pip", "install", "pdf2image"])
                logger.info("pdf2image installed successfully. Please retry the operation.")
                raise Exception("pdf2image was just installed. Please retry your request.")
            except subprocess.CalledProcessError:
                raise Exception("Failed to install pdf2image. Please install manually: pip install pdf2image")
        except pytesseract.TesseractNotFoundError as e:
            error_msg = (
                "Tesseract OCR not found. Please install Tesseract OCR:\n"
                "1. Download from: https://github.com/UB-Mannheim/tesseract/wiki\n"
                "2. Install the .exe file\n"
                "3. Restart this server\n"
                f"Error details: {e}"
            )
            logger.error(error_msg)
            raise Exception("Tesseract OCR not installed. Please install Tesseract OCR from https://github.com/UB-Mannheim/tesseract/wiki")
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            raise Exception(f"PDF OCR processing failed: {str(e)}")