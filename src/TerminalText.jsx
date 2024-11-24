import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TerminalText = ({ speed = 50 }) => {
  const [lines, setLines] = useState(['', '', '', '']);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showFinalCursor, setShowFinalCursor] = useState(false);
  
  const translations = {
    'Connection': 'Połączenie',
    'established': 'nawiązane',
    'Encryption': 'Szyfrowanie',
    'cracked': 'złamane',
    'System': 'System',
    'breach': 'złamany',
    'successful': 'pomyślnie',
    'Click': 'Kliknij',
    'to': 'aby',
    'enter': 'wejść'
  };

  const fullLines = [
    'Connection established',
    'Encryption cracked',
    'System breach successful',
    'Doubble Click to enter'
  ];

  const glitchWord = (word) => {
    return translations[word] || word;
  };

  const processLine = (line) => {
    return line.split(' ').map(word => {
      return Math.random() < 0.1 ? glitchWord(word) : word;
    }).join(' ');
  };

  useEffect(() => {
    // Word glitch effect timer
    const glitchTimer = setInterval(() => {
      setLines(prev => prev.map((line, index) => {
        if (line.length > 0) {  // Only glitch completed lines
          return processLine(fullLines[index].slice(0, line.length));
        }
        return line;
      }));
    }, 200);  // Glitch check every 200ms

    return () => clearInterval(glitchTimer);
  }, []);

  useEffect(() => {
    if (currentLine >= fullLines.length) {
      const timer = setTimeout(() => {
        setShowFinalCursor(true);
      }, speed * 4);
      return () => clearTimeout(timer);
    }

    if (currentChar < fullLines[currentLine].length) {
      const timer = setTimeout(() => {
        setLines(prev => prev.map((line, index) => 
          index === currentLine
            ? fullLines[currentLine].slice(0, currentChar + 1)
            : line
        ));
        setCurrentChar(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
        setCurrentChar(0);
      }, speed * 4);
      return () => clearTimeout(timer);
    }
  }, [currentLine, currentChar, speed]);

  return (
    <div className="font-mono text-base sm:text-lg flex flex-col gap-2">
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        .terminal-text {
          text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00;
          letter-spacing: 0.1em;
          min-height: 1.5em;
          text-align: left;
          width: max-content;
        }

        .cursor {
          display: inline-block;
          width: 0.6em;
          height: 1.2em;
          background-color: #00ff00;
          margin-left: 2px;
          animation: cursor-blink 1s infinite;
          box-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00;
          vertical-align: middle;
        }
      `}</style>
      
      {lines.map((line, index) => (
        <div key={index} className="terminal-text">
          {line}
          {currentLine === index && currentChar < fullLines[index].length && (
            <span className="cursor" />
          )}
        </div>
      ))}
      <div className="terminal-text h-6">
        {showFinalCursor && <span className="cursor" />}
      </div>
    </div>
  );
};

TerminalText.propTypes = {
  speed: PropTypes.number
};

export default TerminalText;