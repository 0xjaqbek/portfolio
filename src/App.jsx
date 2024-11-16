// App.jsx
import { useEffect } from 'react';
import MatrixRain from './MatrixRain';
import Scanlines from './Scanlines';


function App() {
  useEffect(() => {
    const metaTheme = document.createElement('meta');
    metaTheme.name = "theme-color";
    metaTheme.content = "#000000";
    document.head.appendChild(metaTheme);

    return () => {
      document.head.removeChild(metaTheme);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      <MatrixRain />
      <Scanlines />
      <div className="vignette" />
    </div>
  );
}

export default App;