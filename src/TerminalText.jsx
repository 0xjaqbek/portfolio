import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const TerminalText = ({ speed = 50 }) => {
  const [lines, setLines] = useState(['', '', '', '']);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showFinalCursor, setShowFinalCursor] = useState(false);
  const [glitchText, setGlitchText] = useState(false);

  const fullLinesEnglish = [
    'Connection established',
    'Encryption bypassed',
    'System breach successful',
    'Click to enter'
  ];

  const fullLinesPolish = [
    'Połączenie nawiązane',
    'Szyfrowanie pominięte',
    'Włamanie do systemu udane',
    'Kliknij, aby wejść'
  ];

  const getRandomChar = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*<>[]{}';
    return chars[Math.floor(Math.random() * chars.length)];
  };

  const glitchLine = useCallback((line) => {
    const glitchChars = Math.floor(Math.random() * 3) + 1;
    const positions = new Set();
    while (positions.size < glitchChars) {
      positions.add(Math.floor(Math.random() * line.length));
    }
    return line.split('').map((char, i) => 
      positions.has(i) ? getRandomChar() : char
    ).join('');
  }, []);

  useEffect(() => {
    // Glitch effect timer
    const glitchTimer = setInterval(() => {
      const shouldGlitch = Math.random() < 0.3; // 30% chance of glitch
      setGlitchText(shouldGlitch);
    }, 100);

    return () => clearInterval(glitchTimer);
  }, []);

  useEffect(() => {
    if (currentLine >= fullLinesEnglish.length) {
      const timer = setTimeout(() => {
        setShowFinalCursor(true);
      }, speed * 4);
      return () => clearTimeout(timer);
    }

    if (currentChar < fullLinesEnglish[currentLine].length) {
      const timer = setTimeout(() => {
        setLines(prev => prev.map((line, index) => {
          if (index === currentLine) {
            const currentText = glitchText ? 
              fullLinesPolish[currentLine].slice(0, currentChar + 1) :
              fullLinesEnglish[currentLine].slice(0, currentChar + 1);
            return Math.random() < 0.1 ? glitchLine(currentText) : currentText;
          }
          return line;
        }));
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
  }, [currentLine, currentChar, speed, glitchText, glitchLine]);

  return (
    <div className="font-mono text-base sm:text-lg flex flex-col gap-2">
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }

        .terminal-text {
          text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00;
          letter-spacing: 0.1em;
          min-height: 1.5em;
          text-align: left;
          width: max-content;
          position: relative;
        }

        .glitch {
          animation: glitch 0.2s ease-in-out infinite;
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
        <div 
          key={index} 
          className={`terminal-text ${glitchText ? 'glitch' : ''}`}
        >
          {line}
          {currentLine === index && currentChar < fullLinesEnglish[index].length && (
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