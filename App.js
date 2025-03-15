import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('python');
  const [history, setHistory] = useState([]);
  const [filterLanguage, setFilterLanguage] = useState('all');

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('history'));
    if (storedHistory) {
      setHistory(storedHistory);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await axios.post('http://localhost:5001/debug', { code, language });
      setResult(response.data.result);
      const newHistory = [...history, { code, result: response.data.result, language }];
      setHistory(newHistory);
      localStorage.setItem('history', JSON.stringify(newHistory));
    } catch (error) {
      setResult("Error: Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]); // Reset history state
    localStorage.removeItem('history'); // Remove history from localStorage
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert('Copied to clipboard!');
  };

  const filteredHistory = filterLanguage === 'all'
    ? history
    : history.filter(item => item.language === filterLanguage);

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <h2> AI Code Debugger </h2>

      <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>

      <select value={language} onChange={(e) => setLanguage(e.target.value)} className="language-select">
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
      
      </select>

      <form onSubmit={handleSubmit} className="debug-form">
        <textarea
          rows="5"
          placeholder="Enter your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="code-input"
        />
        <button type="submit" className="debug-btn">
          {loading ? 'Debugging...' : 'Debug Code'}
        </button>
      </form>
<h3>Debugging Result:</h3>
      <div className="result-history-container">
        <div className="result-box">
          <SyntaxHighlighter language={language} style={dracula}>
            {result || 'No result yet...'}
          </SyntaxHighlighter>
          {result && (
            <button className="copy-btn" onClick={copyToClipboard}>
              Copy
            </button>
          )}
        </div>

        <div className="history-box">
          <h3>Debugging History:</h3>
          {/* Language filter */}
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="language-filter"
          >
            <option value="all">All Languages</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>

          <ul className="history-list">
            {filteredHistory.map((item, index) => (
              <li key={index} className="history-item">
                <p><strong>Language: {item.language}</strong></p>
                <p><strong>Code:</strong></p>
                <SyntaxHighlighter language={item.language} style={dracula}>
                  {item.code}
                </SyntaxHighlighter>
                <p><strong>Result:</strong></p>
                <SyntaxHighlighter language={item.language} style={dracula}>
                  {item.result}
                </SyntaxHighlighter>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button className="clear-history-btn" onClick={clearHistory}>
        Clear History
      </button>
    </div>
  );
}

export default App;
