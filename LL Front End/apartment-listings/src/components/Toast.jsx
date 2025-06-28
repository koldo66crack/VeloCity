import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Toast({ message, type = 'error', duration = 5000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'error' ? 'bg-red-600' : 'bg-green-600';
  const icon = type === 'error' ? '❌' : '✅';

  return createPortal(
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm`}>
        <span>{icon}</span>
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-white/80 hover:text-white text-lg font-bold"
        >
          ×
        </button>
      </div>
    </div>,
    document.body
  );
} 