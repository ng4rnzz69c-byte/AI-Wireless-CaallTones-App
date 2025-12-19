import React, { useState } from 'react';
import { callTonesAPI } from '../services/api';

const FileUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Please upload an audio file (MP3, WAV, or OGG).');
        setFile(null);
        return;
      }
      
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setError('File size exceeds 10MB limit.');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError('');
      
      // Auto-set title from filename if not already set
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title || file.name);
    formData.append('description', description);
    formData.append('isPublic', isPublic);

    try {
      const response = await callTonesAPI.upload(formData);
      onUploadSuccess(response.data.data);
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setIsPublic(false);
      e.target.reset();
      
      alert('Call tone uploaded successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.fileInputContainer}>
          <label style={styles.fileLabel}>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
            <span style={styles.fileLabelText}>
              {file ? file.name : 'Choose audio file'}
            </span>
          </label>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title for your call tone"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description"
            style={styles.textarea}
            rows="3"
          />
        </div>

        <div style={styles.checkboxGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              style={styles.checkbox}
            />
            <span style={styles.checkboxText}>Make this call tone public</span>
          </label>
        </div>

        <button 
          type="submit" 
          style={styles.button}
          disabled={uploading || !file}
        >
          {uploading ? 'Uploading...' : 'Upload Call Tone'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fileInputContainer: {
    marginBottom: '10px',
  },
  fileLabel: {
    display: 'block',
    padding: '40px 20px',
    border: '2px dashed #ccc',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#fafafa',
    transition: 'all 0.3s ease',
  },
  fileInput: {
    display: 'none',
  },
  fileLabelText: {
    fontSize: '16px',
    color: '#666',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
  },
  textarea: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '8px',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  checkboxText: {
    fontSize: '14px',
    color: '#333',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
  },
};

export default FileUploader;
