# Tesseract OCR Setup Guide

To use the PDF processing features, you need to install Tesseract OCR on your Windows machine.

## Installation Steps

### 1. Download Tesseract OCR
- Visit: https://github.com/UB-Mannheim/tesseract/wiki
- Download the latest Windows installer (e.g., `tesseract-ocr-w64-setup-5.3.0.20221222.exe`)

### 2. Install Tesseract OCR
1. Run the downloaded `.exe` file
2. Choose your preferred language (English is recommended)
3. Accept the license agreement
4. Choose installation location (default is recommended: `C:\Program Files\Tesseract-OCR`)
5. Select components to install (keep all defaults selected)
6. Complete the installation

### 3. Verify Installation
1. Open Command Prompt (cmd)
2. Type: `tesseract --version`
3. If successful, you should see version information

### 4. Restart the Backend Server
After installing Tesseract, restart the backend server:
1. Stop the current server (Ctrl+C in the backend terminal)
2. Restart with: `python -m app.main`

## Troubleshooting

### If Tesseract is not found:
1. Make sure you installed it in one of these locations:
   - `C:\Program Files\Tesseract-OCR\tesseract.exe`
   - `C:\Program Files (x86)\Tesseract-OCR\tesseract.exe`

2. Add Tesseract to your PATH environment variable:
   - Open System Properties → Advanced → Environment Variables
   - Edit the "Path" variable under System Variables
   - Add the Tesseract installation directory (e.g., `C:\Program Files\Tesseract-OCR`)
   - Restart your computer

### Common Issues:
- **"TesseractNotFoundError"**: Tesseract is not installed or not in PATH
- **"pdf2image not found"**: This should auto-install, but you can manually run `pip install pdf2image`
- **Permission errors**: Run Command Prompt as Administrator when installing

## Features Available After Setup

✅ **PDF Text Extraction**: Extract text from PDF files using OCR

✅ **Multi-page Support**: Process PDFs with multiple pages

✅ **Text Cleanup**: Automatic text cleaning and formatting

✅ **Batch Processing**: Process multiple PDF files at once

✅ **Error Handling**: Graceful handling of processing errors

## Need Help?

If you encounter issues:
1. Check the backend server logs for detailed error messages
2. Ensure Tesseract is properly installed and accessible
3. Try restarting both frontend and backend servers
4. Verify your PDF files are not corrupted or password-protected