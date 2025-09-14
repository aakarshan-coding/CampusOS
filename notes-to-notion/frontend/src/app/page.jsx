'use client';

import { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import ConversionStatus from '../components/ConversionStatus';
import OCRProcessor from '../components/OCRProcessor';
import PDFProcessor from '../components/PDFProcessor';

export default function Home() {

  //show user the status of their project loading
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isNotionConnected, setIsNotionConnected] = useState(false);
  const [ocrResults, setOcrResults] = useState([]);
  const [useDirectProcessing, setUseDirectProcessing] = useState(true);

  useEffect(() => {
    // Check if user returned from Notion authorization
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    
    if (authCode) {
      setIsNotionConnected(true);
      // Clean up URL by removing the code parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="container">
      <h1 className="title">Notes to Notion</h1>
      <p className="description">
        Convert your handwritten Apple Notes to searchable text in Notion
      </p>
      
      <div className="notion-connect-container">
        <button 
          onClick={() => {
            if (!isNotionConnected) {
              window.location.href = 'https://api.notion.com/v1/oauth/authorize?client_id=26ed872b-594c-801e-917e-003745953c47&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F';
            }
          }}
          className={`notion-connect-button ${isNotionConnected ? 'connected' : ''}`}
          disabled={isNotionConnected}
        >
          {isNotionConnected ? 'Notion account connected' : 'Connect With Notion'}
        </button>
      </div>
      <div className="processing-mode-toggle">
        <button 
          onClick={() => setUseDirectProcessing(true)}
          className={`mode-button ${useDirectProcessing ? 'active' : ''}`}
        >
          Direct PDF Processing
        </button>
        <button 
          onClick={() => setUseDirectProcessing(false)}
          className={`mode-button ${!useDirectProcessing ? 'active' : ''}`}
        >
          Upload & Process Later
        </button>
      </div>

      {useDirectProcessing ? (
        <PDFProcessor 
          onProcessingComplete={(results) => {
            console.log('Processing completed:', results);
          }}
        />
      ) : (
        <>
          {/*show user the status of their project loading*/}
          {uploadStatus === 'uploading' && (
          <div className="status-container">
            <div className="loading-spinner"></div>
            <p>Uploading and processing your notes...</p>
          </div>
          )}
          {/*show user the status of their project loading*/}
          <FileUpload 
            onUploadStart={() => setUploadStatus('uploading')}
            onUploadSuccess={(files) => {
              setUploadStatus('success');
              setUploadedFiles(files);
            }}
            onUploadError={() => setUploadStatus('error')}
          />
          
          {uploadStatus !== 'idle' && uploadStatus !== 'success' && (
            <ConversionStatus 
              status={uploadStatus} 
              files={uploadedFiles} 
            />
          )}
          
          {uploadStatus === 'success' && uploadedFiles.length > 0 && (
            <OCRProcessor 
              files={uploadedFiles}
              onProcessingComplete={(results) => setOcrResults(results)}
            />
          )}
        </>
      )}
    </div>
  );
}