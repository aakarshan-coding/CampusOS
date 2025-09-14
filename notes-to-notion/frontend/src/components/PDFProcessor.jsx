'use client';

import { useState } from 'react';
import axios from 'axios';

const PDFProcessor = ({ onProcessingComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [ocrResults, setOcrResults] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [showRawText, setShowRawText] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    
    if (droppedFiles.length > 0) {
      setSelectedFiles(droppedFiles);
    }
  };

  const processFiles = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    setProcessingStatus('processing');
    const results = [];
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        setCurrentFileIndex(i);
        
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const response = await axios.post('http://localhost:8000/api/process', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          results.push({
            ...response.data,
            originalFile: file.name
          });
          
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          
          let errorMessage = error.response?.data?.detail || error.message;
          
          // Check for Tesseract-related errors
          if (errorMessage.includes('Tesseract OCR not installed') || 
              errorMessage.includes('TesseractNotFoundError')) {
            errorMessage = 'Tesseract OCR not installed. Please install Tesseract OCR and restart the server. See TESSERACT_SETUP.md for instructions.';
          }
          
          // Add error result
          results.push({
            filename: file.name,
            originalFile: file.name,
            error: errorMessage,
            has_text: false,
            needsTesseract: errorMessage.includes('Tesseract OCR not installed')
          });
        }
      }
      
      setOcrResults(results);
      setProcessingStatus('completed');
      onProcessingComplete && onProcessingComplete(results);
      
    } catch (error) {
      console.error('Error processing files:', error);
      setProcessingStatus('error');
    }
  };

  const resetProcessor = () => {
    setSelectedFiles([]);
    setOcrResults([]);
    setProcessingStatus('idle');
    setCurrentFileIndex(0);
  };

  if (processingStatus === 'idle') {
    return (
      <div className="pdf-processor">
        <div className="upload-section">
          <h3>Process PDF Files with OCR</h3>
          <p>Upload PDF files to extract and clean text using OCR technology.</p>
          
          <div 
            className={`dropzone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              id="pdf-input"
              multiple 
              accept=".pdf" 
              onChange={handleFileChange} 
              className="file-input"
            />
            <label htmlFor="pdf-input" className="file-label">
              {selectedFiles.length > 0 ? (
                <div className="selected-files">
                  <p>{selectedFiles.length} PDF file(s) selected</p>
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name} ({Math.round(file.size / 1024)} KB)</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="upload-prompt">
                  <p>Drag & drop PDF files here</p>
                  <p>or</p>
                  <button onClick={() => {
                    document.getElementById('pdf-input').click();
                  }} type="button" className="browse-button">
                    Browse PDF files
                  </button>
                  <p className="file-types">Only PDF files are supported</p>
                </div>
              )}
            </label>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="action-buttons">
              <button 
                onClick={processFiles}
                className="process-button"
              >
                Extract Text from {selectedFiles.length} file(s)
              </button>
              <button 
                onClick={resetProcessor}
                className="reset-button"
              >
                Clear Files
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (processingStatus === 'processing') {
    return (
      <div className="pdf-processor">
        <div className="processing-section">
          <div className="loading-spinner"></div>
          <h3>Processing PDF Files...</h3>
          <p>Extracting text from file {currentFileIndex + 1} of {selectedFiles.length}</p>
          <p className="current-file">Current: {selectedFiles[currentFileIndex]?.name}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentFileIndex + 1) / selectedFiles.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (processingStatus === 'error') {
    return (
      <div className="pdf-processor error">
        <h3>Processing Error</h3>
        <p>There was an error processing your files. Please try again.</p>
        <div className="action-buttons">
          <button 
            onClick={processFiles}
            className="retry-button"
          >
            Retry Processing
          </button>
          <button 
            onClick={resetProcessor}
            className="reset-button"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  if (processingStatus === 'completed') {
    const successfulResults = ocrResults.filter(result => !result.error);
    const errorResults = ocrResults.filter(result => result.error);
    
    return (
      <div className="pdf-processor completed">
        <div className="results-header">
          <h3>Text Extraction Complete!</h3>
          <p>
            Successfully processed {successfulResults.length} of {ocrResults.length} file(s)
            {errorResults.length > 0 && (
              <span className="error-count"> ({errorResults.length} failed)</span>
            )}
          </p>
          
          <div className="header-actions">
            <button 
              onClick={resetProcessor}
              className="reset-button"
            >
              Process More Files
            </button>
            
            {successfulResults.length > 0 && (
              <div className="text-toggle">
                <button 
                  onClick={() => setShowRawText(!showRawText)}
                  className={`toggle-button ${showRawText ? 'active' : ''}`}
                >
                  {showRawText ? 'Show Cleaned Text' : 'Show Raw OCR Text'}
                </button>
              </div>
            )}
          </div>
        </div>

        {errorResults.length > 0 && (
          <div className="error-results">
            <h4>Failed Files:</h4>
            {errorResults.map((result, index) => (
              <div key={index} className={`error-item ${result.needsTesseract ? 'tesseract-error' : ''}`}>
                <span className="filename">{result.needsTesseract ? '⚠️' : '❌'} {result.originalFile}</span>
                <span className="error-message">{result.error}</span>
              </div>
            ))}
          </div>
        )}

        {successfulResults.length > 0 && (
          <div className="results-container">
            {successfulResults.map((result, index) => (
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
        )}
        
        {successfulResults.length > 0 && (
          <div className="export-section">
            <button className="export-button">
              Export {successfulResults.length} file(s) to Notion
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default PDFProcessor;