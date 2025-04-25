// ConnectionError.jsx - Component for handling assistant connection errors
import { AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';

const ConnectionError = ({ onRetry, errorMessage }) => {
  return (
    <div className="bg-black bg-opacity-80 border border-red-500 text-red-400 rounded-lg p-4 flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-bold">Connection Error</span>
      </div>
      
      <p className="text-sm text-center">
        {errorMessage || "Unable to connect to the assistant server. This could be due to network issues or server maintenance."}
      </p>
      
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={onRetry}
          className="px-3 py-1 bg-transparent border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-black transition-colors"
        >
          Retry Connection
        </button>
        
        <a
          href="mailto:contact@jaqbek.dev"
          className="text-green-500 hover:text-green-400 text-sm"
        >
          Contact Developer
        </a>
      </div>
    </div>
  );
};

ConnectionError.propTypes = {
  onRetry: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
};

export default ConnectionError;