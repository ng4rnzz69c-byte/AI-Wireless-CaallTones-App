import React from 'react';

const CallToneList = ({ callTones, onSelect, onDelete, selectedToneId }) => {
  if (callTones.length === 0) {
    return (
      <div style={styles.empty}>
        <p>No call tones available</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {callTones.map((tone) => (
        <div
          key={tone._id}
          style={{
            ...styles.card,
            ...(selectedToneId === tone._id ? styles.cardSelected : {}),
          }}
        >
          <div style={styles.cardContent}>
            <div style={styles.cardInfo}>
              <h3 style={styles.cardTitle}>{tone.title}</h3>
              {tone.description && (
                <p style={styles.cardDescription}>{tone.description}</p>
              )}
              <div style={styles.cardMeta}>
                <span style={styles.metaItem}>
                  {tone.category === 'ai-generated' ? '🤖 AI Generated' : '📁 User Upload'}
                </span>
                {tone.fileSize && (
                  <span style={styles.metaItem}>
                    {(tone.fileSize / (1024 * 1024)).toFixed(2)} MB
                  </span>
                )}
              </div>
            </div>
            
            <div style={styles.cardActions}>
              <button
                onClick={() => onSelect(tone)}
                style={styles.selectButton}
              >
                {selectedToneId === tone._id ? '✓ Selected' : 'Select'}
              </button>
              
              {onDelete && (
                <button
                  onClick={() => onDelete(tone._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
    transition: 'all 0.3s ease',
  },
  cardSelected: {
    borderColor: '#007bff',
    boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.1)',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
    wordBreak: 'break-word',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px',
    lineHeight: '1.5',
  },
  cardMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    fontSize: '12px',
    color: '#999',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
  },
  selectButton: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#dc3545',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
  },
};

export default CallToneList;
