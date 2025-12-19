import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { callTonesAPI } from '../services/api';
import FileUploader from '../components/FileUploader';
import MediaPlayer from '../components/MediaPlayer';
import CallToneList from '../components/CallToneList';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [callTones, setCallTones] = useState([]);
  const [aiCallTones, setAiCallTones] = useState([]);
  const [selectedTone, setSelectedTone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-tones');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCallTones();
  }, []);

  const fetchCallTones = async () => {
    try {
      setLoading(true);
      const [myTones, aiTones] = await Promise.all([
        callTonesAPI.getAll(),
        callTonesAPI.getAIGenerated(),
      ]);
      setCallTones(myTones.data.data);
      setAiCallTones(aiTones.data.data);
    } catch (err) {
      setError('Failed to fetch call tones');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newTone) => {
    setCallTones([newTone, ...callTones]);
  };

  const handleSelectTone = async (tone) => {
    try {
      await callTonesAPI.select(tone._id);
      setSelectedTone(tone);
      alert('Call tone selected successfully!');
    } catch (err) {
      setError('Failed to select call tone');
    }
  };

  const handleDeleteTone = async (id) => {
    if (window.confirm('Are you sure you want to delete this call tone?')) {
      try {
        await callTonesAPI.delete(id);
        setCallTones(callTones.filter(tone => tone._id !== id));
        if (selectedTone?._id === id) {
          setSelectedTone(null);
        }
      } catch (err) {
        setError('Failed to delete call tone');
      }
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>AI Wireless CallTones</h1>
        <div style={styles.userInfo}>
          <span style={styles.username}>Welcome, {user?.username}</span>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.uploadSection}>
          <h2 style={styles.sectionTitle}>Upload Your Call Tone</h2>
          <FileUploader onUploadSuccess={handleUploadSuccess} />
        </div>

        {selectedTone && (
          <div style={styles.playerSection}>
            <h2 style={styles.sectionTitle}>Now Playing</h2>
            <MediaPlayer callTone={selectedTone} />
          </div>
        )}

        <div style={styles.tabSection}>
          <div style={styles.tabs}>
            <button
              style={activeTab === 'my-tones' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('my-tones')}
            >
              My Call Tones
            </button>
            <button
              style={activeTab === 'ai-generated' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('ai-generated')}
            >
              AI Generated
            </button>
          </div>

          <div style={styles.listContainer}>
            {loading ? (
              <div style={styles.loader}>Loading...</div>
            ) : (
              <CallToneList
                callTones={activeTab === 'my-tones' ? callTones : aiCallTones}
                onSelect={handleSelectTone}
                onDelete={activeTab === 'my-tones' ? handleDeleteTone : null}
                selectedToneId={selectedTone?._id}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: '20px 40px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  username: {
    fontSize: '16px',
    color: '#666',
  },
  logoutButton: {
    padding: '8px 16px',
    fontSize: '14px',
    color: 'white',
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  main: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  uploadSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  playerSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  tabSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #e0e0e0',
  },
  tab: {
    flex: 1,
    padding: '16px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#666',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
  },
  tabActive: {
    flex: 1,
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#007bff',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderBottom: '3px solid #007bff',
  },
  listContainer: {
    padding: '30px',
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  loader: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },
};

export default Dashboard;
