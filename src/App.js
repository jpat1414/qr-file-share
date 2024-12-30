import React, { useState } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null); // Define qrCodeUrl state variable

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadStatus(null); // Reset the status on new file selection
    setQrCodeUrl(null); // Reset the QR code URL on new file selection
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await axios.post('http://127.0.0.1:8000/upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setUploadStatus(response.data.message || 'File uploaded successfully!');
        setQrCodeUrl(`http://127.0.0.1:8000/uploads/${selectedFile.name}.png`);
        console.log('Server response:', response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
          setUploadStatus(`Failed to upload file. Server responded with status: ${error.response.status}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request data:', error.request);
          setUploadStatus('Failed to upload file. No response received from server.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
          setUploadStatus(`Failed to upload file. Error: ${error.message}`);
        }
      }
    } else {
      alert('Please select a file first.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>QR-based File Transfer System</h1>
        <h2>Project by Jenish Patel</h2>
        <h3>Upload a file to start</h3>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
        {selectedFile && (
          <div className="file-info">
            <p><strong>File Name:</strong> {selectedFile.name}</p>
            <p><strong>File Size:</strong> {selectedFile.size} bytes</p>
          </div>
        )}
        {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
        {qrCodeUrl && (
          <div className="qr-code">
            <p>QR Code:</p>
            <img src={qrCodeUrl} alt="QR Code" />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;