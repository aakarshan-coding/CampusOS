'use client';

import { useState } from 'react';
import axios from 'axios';

const OCRProcessor = ({ files, onProcessingComplete }) => {
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [ocrResults, setOcrResults] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [showRawText, setShowRawText] = useState(false);

  const processFiles = async () => {
    if (!files || files.length === 0) return;
    
    setProcessingStatus('processing');
    const results = [];
    
    try {
      // Note: Currently we only have file metadata from upload
      // For demonstration, we'll show mock results
      // In a real implementation, you would either:
      // 1. Process files during upload and store results
      // 2. Store files temporarily and process them here
      // 3. Modify the upload flow to handle processing immediately
      
      for (let i = 0; i < files.length; i++) {
        setCurrentFileIndex(i);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock OCR result with realistic text cleanup examples
        const mockResult = {
          filename: files[i].original_filename,
          raw_text: `--- Page 1 ---\nThis   is   sample   raw   OCR   text   with\n\n\n\nextra   spaces   and   multiple   newlines.\nIt   might   have   weird   spacing,punctuation   issues\nand   other   OCR   artifacts   that   need   cleaning.\n\n\n--- Page 2 ---\nMore   text   from   the   second   page.This\nsentence   has   no   space   after   period.And   this\none   too!What   about   question   marks?\n\n\nEnd   of   document.`,
          cleaned_text: `This is sample raw OCR text with extra spaces and multiple newlines.\n\nIt might have weird spacing, punctuation issues and other OCR artifacts that need cleaning.\n\nMore text from the second page. This sentence has no space after period. And this one too! What about question marks?\n\nEnd of document.`,
          raw_text_length: 387,
          cleaned_text_length: 285,
          has_text: true,
          cleanup_stats: {
            original_length: 387,
            cleaned_length: 285,
            characters_removed: 102,
            original_lines: 12,
            cleaned_lines: 6,
            paragraphs_created: 4
          }
        };
        
        results.push(mockResult);
      }
      
      setOcrResults(results);
      setProcessingStatus('completed');
      onProcessingComplete && onProcessingComplete(results);
      
    } catch (error) {
      console.error('Error processing files:', error);
      setProcessingStatus('error');
    }
  };

  const processFileWithAPI = async (file) => {
    // This function would be used when we have actual file objects
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('http://localhost:8000/api/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to process ${file.name}: ${error.message}`);
    }
  };

  if (processingStatus === 'idle') {
    return (
      <div className="ocr-processor">
        <div className="process-section">
          <h3>Ready to Process Files</h3>
          <p>Click below to extract text from your uploaded files using OCR.</p>
          <button 
            onClick={processFiles}
            className="process-button"
          >
            Extract Text from {files.length} file(s)
          </button>
        </div>
      </div>
    );
  }

  if (processingStatus === 'processing') {
    return (
      <div className="ocr-processor">
        <div className="processing-section">
          <div className="loading-spinner"></div>
          <h3>Processing Files...</h3>
          <p>Extracting text from file {currentFileIndex + 1} of {files.length}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentFileIndex + 1) / files.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (processingStatus === 'error') {
    return (
      <div className="ocr-processor error">
        <h3>Processing Error</h3>
        <p>There was an error processing your files. Please try again.</p>
        <button 
          onClick={processFiles}
          className="retry-button"
        >
          Retry Processing
        </button>
      </div>
    );
  }

  if (processingStatus === 'completed') {
    return (
      <div className="ocr-processor completed">
        <h3>Text Extraction Complete!</h3>
        <p>Successfully processed {ocrResults.length} file(s)</p>
        
        <div className="text-toggle">
          <button 
            onClick={() => setShowRawText(!showRawText)}
            className={`toggle-button ${showRawText ? 'active' : ''}`}
          >
            {showRawText ? 'Show Cleaned Text' : 'Show Raw OCR Text'}
          </button>
        </div>

        <div className="results-container">
          {ocrResults.map((result, index) => (
            <div key={index} className="result-item">
              <div className="result-header">
                <h4>{result.filename}</h4>
                <div className="result-stats">
                  <span className="stat">
                    {showRawText ? result.raw_text_length : result.cleaned_text_length} characters
                  </span>
                  {!showRawText && result.cleanup_stats && (
                    <span className="stat cleanup-stat">
                      {result.cleanup_stats.characters_removed} chars cleaned
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-content">
                <pre className="extracted-text">
                  {showRawText ? result.raw_text : result.cleaned_text}
                </pre>
              </div>
              
              {!showRawText && result.cleanup_stats && (
                <div className="cleanup-summary">
                  <small>
                    Cleanup: {result.cleanup_stats.paragraphs_created} paragraphs, 
                    {result.cleanup_stats.cleaned_lines} lines
                  </small>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="export-section">
          <button className="export-button">
            Export All to Notion
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default OCRProcessor;