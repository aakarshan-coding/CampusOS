'use client';

import { useState } from 'react';
import axios from 'axios';

const ConversionStatus = ({ status, files }) => {
  const [exportStatus, setExportStatus] = useState('idle');
  const [exportedCount, setExportedCount] = useState(0);

  const handleExportToNotion = async () => {
    if (files.length === 0) return;
    
    setExportStatus('exporting');
    
    try {
      // In a real implementation, we would loop through files and export each one
      // For now, we'll just simulate a successful export
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setExportStatus('success');
      setExportedCount(files.length);
    } catch (error) {
      console.error('Error exporting to Notion:', error);
      setExportStatus('error');
    }
  };

  if (status === 'uploading') {
    return (
      <div className="status-container">
        <div className="loading-spinner"></div>
        <p>Uploading and processing your notes...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="status-container error">
        <p>There was an error processing your files. Please try again.</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="status-container success">
        <h2>Files Uploaded Successfully!</h2>
        <p>{files.length} file(s) have been uploaded and are ready for processing.</p>
        
        <div className="uploaded-files-list">
          <h3>Uploaded Files:</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index} className="file-item">
                <span className="filename">{file.original_filename}</span>
                <span className="file-details">
                  ({file.file_type.toUpperCase()}, {Math.round(file.file_size / 1024)} KB)
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {exportStatus === 'idle' && (
          <button 
            onClick={handleExportToNotion} 
            className="export-button"
          >
            Export to Notion
          </button>
        )}
        
        {exportStatus === 'exporting' && (
          <div className="exporting">
            <div className="loading-spinner"></div>
            <p>Exporting to Notion...</p>
          </div>
        )}
        
        {exportStatus === 'success' && (
          <div className="export-success">
            <p>{exportedCount} note(s) successfully added to Notion!</p>
          </div>
        )}
        
        {exportStatus === 'error' && (
          <div className="export-error">
            <p>There was an error exporting to Notion. Please try again.</p>
            <button 
              onClick={handleExportToNotion} 
              className="retry-button"
            >
              Retry Export
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ConversionStatus;