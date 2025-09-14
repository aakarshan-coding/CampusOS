import re
import string

def clean_text(text: str) -> str:
    """
    Clean and normalize OCR output text for better readability.
    
    Args:
        text (str): Raw OCR extracted text
        
    Returns:
        str: Cleaned and formatted text
    """
    if not text or not text.strip():
        return ""
    
    # Remove non-printable characters except newlines and tabs
    printable_chars = set(string.printable)
    text = ''.join(char for char in text if char in printable_chars)
    
    # Normalize multiple spaces to single space
    text = re.sub(r' +', ' ', text)
    
    # Normalize multiple newlines (keep paragraph breaks)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Fix spacing around punctuation
    # Remove space before punctuation
    text = re.sub(r' +([,.!?;:])', r'\1', text)
    # Add space after punctuation if missing
    text = re.sub(r'([,.!?;:])([A-Za-z])', r'\1 \2', text)
    
    # Split long continuous text into paragraphs (every ~500 chars at sentence end)
    sentences = re.split(r'([.!?])\s+', text)
    paragraphs = []
    current_paragraph = ""
    
    for i in range(0, len(sentences), 2):
        sentence = sentences[i]
        punctuation = sentences[i + 1] if i + 1 < len(sentences) else ""
        
        current_paragraph += sentence + punctuation
        
        # Start new paragraph if current one is getting long
        if len(current_paragraph) > 500 and punctuation in '.!?':
            paragraphs.append(current_paragraph.strip())
            current_paragraph = ""
    
    # Add remaining text
    if current_paragraph.strip():
        paragraphs.append(current_paragraph.strip())
    
    # Join paragraphs with double newlines
    result = '\n\n'.join(paragraphs)
    
    # Final cleanup - strip leading/trailing whitespace
    return result.strip()


def get_cleanup_stats(original_text: str, cleaned_text: str) -> dict:
    """
    Get statistics about the text cleanup process.
    
    Args:
        original_text (str): Original text before cleanup
        cleaned_text (str): Text after cleanup
        
    Returns:
        dict: Statistics about the cleanup process
    """
    return {
        "original_length": len(original_text),
        "cleaned_length": len(cleaned_text),
        "characters_removed": len(original_text) - len(cleaned_text),
        "original_lines": original_text.count('\n') + 1 if original_text else 0,
        "cleaned_lines": cleaned_text.count('\n') + 1 if cleaned_text else 0,
        "paragraphs_created": cleaned_text.count('\n\n') + 1 if cleaned_text else 0
    }