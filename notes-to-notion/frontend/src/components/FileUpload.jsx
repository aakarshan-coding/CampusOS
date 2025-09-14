'use client';

import { useState } from 'react';
import axios from 'axios';

const FileUpload = ({
  onUploadStart,
  onUploadSuccess,
  onUploadError,
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  //track the files the user uploaded in this list
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) return;
    
    //store all the files the user uploaded in a list
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    try {
      onUploadStart();
      //send the files to the server
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      //update the state of the variable tracking upload success
      onUploadSuccess(response.data.files);
    } catch (error) {
      console.error('Error uploading files:', error);
      onUploadError();
    }
  };

  return (
    <div className="upload-container">
      <div 
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          id="file-input"
          multiple 
          accept=".pdf,.txt" 
          onChange={handleFileChange} 
          className="file-input"
        />
        <label htmlFor="file-input" className="file-label">
          {/*Depending on whether the user has selected any files, show them the selected files or the upload prompt*/}
          {files.length > 0 ? (

            /* Show the user the names of the files they uploaded */
            <div className="selected-files">
              <p>{files.length} file(s) selected</p>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="upload-prompt">
              <p>Drag & drop your files here</p>
              <p>or</p>
              <button onClick={() => {
                document.getElementById('file-input').click();
              }} type="button" className="browse-button">
                Browse files
              </button>
              <p className="file-types">Supported formats: PDF, TXT</p>
            </div>
          )}
        </label>
      </div>

      {/*Once the user has uploaded the files, give them the option to conver them to Notion*/}
      {files.length > 0 && (
        <button 
          type="button" 
          onClick={handleSubmit} 
          className="upload-button"
        >
          Upload and Convert
        </button>
      )}
    </div>
  );
};

export default FileUpload;