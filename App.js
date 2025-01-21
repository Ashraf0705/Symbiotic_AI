import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [enhancedTexts, setEnhancedTexts] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!text.trim()) {
      setError('Please enter some text to enhance.');
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear previous errors
      setEnhancedTexts({}); // Reset enhanced texts

      const response = await axios.post('http://localhost:5000/api/enhance', { text });
      console.log("Backend Response:", response.data); // Debugging log

      if (response.data && response.data.enhancedTexts) {
        setEnhancedTexts(response.data.enhancedTexts);
      } else {
        throw new Error('Unexpected response structure from the server.');
      }
    } catch (err) {
      setError(`Error: ${err.response?.data?.error || 'Failed to enhance text.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f0f0f0',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#333',
        }}>
          Symbiotic AI - Text Enhancer
        </h2>
        <input
          placeholder="Enter Text Here"
          type="text"
          value={text}
          style={{
            width: '100%',
            marginBottom: '10px',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleClick}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Enhancing...' : 'Enhance'}
        </button>

        {error && (
          <div style={{
            marginTop: '20px',
            color: 'red',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {!loading && Object.keys(enhancedTexts).length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ textAlign: 'center', color: '#555' }}>Enhanced Texts:</h3>
            {Object.entries(enhancedTexts).map(([category, texts], index) => (
              <div key={index} style={{ marginBottom: '15px' }}>
                <h4 style={{ color: '#007bff', textDecoration: 'underline' }}>{category}</h4>
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                  {Array.isArray(texts) && texts.length > 0 ? (
                    texts.map((text, i) => (
                      <li key={i} style={{
                        marginBottom: '10px',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9',
                      }}>
                        {text}
                      </li>
                    ))
                  ) : (
                    <li style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: '#f9f9f9',
                    }}>
                      No enhanced texts available for this category.
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && Object.keys(enhancedTexts).length === 0 && (
          <p style={{ marginTop: '20px', textAlign: 'center', color: '#777' }}>
            No enhanced texts available.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
