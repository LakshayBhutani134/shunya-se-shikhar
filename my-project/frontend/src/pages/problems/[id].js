import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import authService from '../../services/auth';
import api from '../../services/api';

const ProblemDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  // SIMPLIFIED FILE UPLOAD STATES
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  
  const fileInputRef = useRef(null);
  
  // Only fetch the problem data
  useEffect(() => {
    console.log("Component mounted, ID:", id);
    
    // Check if user is logged in
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      console.log("No user found, redirecting to login");
      router.push('/login');
      return;
    }
    setUser(currentUser);
    console.log("User authenticated:", currentUser.username);
    
    // Fetch problem when ID is available
    if (id) {
      const fetchProblem = async () => {
        try {
          setLoading(true);
          console.log("Fetching problem:", id);
          const data = await api.getProblem(id);
          setProblem(data);
          console.log("Problem fetched successfully:", data);
        } catch (err) {
          console.error(`Error fetching problem ${id}:`, err);
          setError('Failed to load problem');
        } finally {
          setLoading(false);
        }
      };
      
      fetchProblem();
    }
  }, [id, router]);
  
  // SIMPLIFIED FILE HANDLERS
  const handleFileSelect = (e) => {
    console.log("File select triggered");
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }
    
    console.log("File selected:", file.name);
    
    // Preview the selected image
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewURL(reader.result);
      console.log("Preview generated");
    };
    reader.readAsDataURL(file);
  };
  
  // Direct DOM element click to ensure it works
  const triggerFileInput = () => {
    console.log("Attempting to open file dialog");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input reference is null");
    }
  };
  
  // Simplified upload handler
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }
    
    try {
      setUploading(true);
      setError(null);
      console.log("Uploading file:", selectedFile.name);
      
      // Create FormData directly here for debugging
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('user_id', user.userid);
      
      const response = await api.submitSolution(id, user.userid, selectedFile);
      console.log("Upload response:", response);
      
      setUploadStatus('Submission successful!');
      setSelectedFile(null);
      setPreviewURL(null);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to upload solution');
    } finally {
      setUploading(false);
    }
  };
  
  if (loading) return <div>Loading problem...</div>;
  if (error && !problem) return <div>{error}</div>;
  
  return (
    <div className="problem-container">
      <h1>Problem Submission</h1>
      
      {/* SIMPLE FILE UPLOAD INTERFACE */}
      <div className="upload-section" style={{
        border: '3px dashed #3498db',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px 0',
        backgroundColor: '#f8f9fa'
      }}>
        <h2>Upload Your Solution</h2>
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          style={{ display: 'none' }}
        />
        
        {previewURL ? (
          <div style={{marginBottom: '15px'}}>
            <img 
              src={previewURL} 
              alt="Solution preview" 
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <button
              onClick={triggerFileInput}
              style={{
                display: 'block',
                margin: '10px 0',
                padding: '5px 10px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Change Image
            </button>
          </div>
        ) : (
          <button
            onClick={triggerFileInput}
            style={{
              width: '100%',
              padding: '40px 0',
              backgroundColor: '#e0f2fe',
              border: '2px dashed #3498db',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#0c4a6e',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Click to Select a Solution Image
          </button>
        )}
        
        {error && (
          <div style={{
            color: 'red',
            margin: '10px 0',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        
        {uploadStatus && (
          <div style={{
            color: 'green',
            margin: '10px 0',
            padding: '10px',
            backgroundColor: '#e8f5e9',
            borderRadius: '4px'
          }}>
            {uploadStatus}
          </div>
        )}
        
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: selectedFile ? '#3498db' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: selectedFile ? 'pointer' : 'not-allowed',
            marginTop: '15px',
            fontSize: '16px'
          }}
        >
          {uploading ? 'Uploading...' : 'Submit Solution'}
        </button>
      </div>
      
      {/* Debug Section */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px',
        margin: '20px 0',
        backgroundColor: '#f5f5f5',
        fontSize: '12px'
      }}>
        <h4>Debug Info</h4>
        <p>Problem ID: {id || 'Not set'}</p>
        <p>User: {user ? `${user.username} (${user.userid})` : 'Not logged in'}</p>
        <p>Selected file: {selectedFile ? selectedFile.name : 'None'}</p>
        <p>Has preview: {previewURL ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default ProblemDetailPage;