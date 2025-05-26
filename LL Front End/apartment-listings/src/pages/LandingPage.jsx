// src/pages/LandingPage.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import background from '../assets/img/background_image.jpg';
import Navbar from '../components/Navbar';

const baseText = 'Helping you';
const endings = [
  ' lease with ease.',
  ' simplify your housing search.',
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

  // Typewriter effect
  useEffect(() => {
    let currentChar = 0;
    let interval;
    const typeText = () => {
      const fullText = baseText + endings[index];
      interval = setInterval(() => {
        currentChar++;
        setDisplayedText(fullText.slice(0, currentChar));
        if (currentChar >= fullText.length) {
          clearInterval(interval);
          setTimeout(() => setIndex((prev) => (prev + 1) % endings.length), 2000);
        }
      }, 60);
    };
    typeText();
    return () => clearInterval(interval);
  }, [index]);

  // Generate random stars
  const stars = useMemo(
    () => Array.from({ length: 20 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10000}ms`,
    })),
    []
  );

  const handleGetStarted = () => navigate('/home');

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background + stars */}
      <div
        className="absolute inset-0 z-0 background bg-cover bg-center scale-animation"
        style={{
          backgroundImage: `radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%), url(${background})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="absolute inset-0 night pointer-events-none">
          {stars.map((star, i) => (
            <div
              key={i}
              className="shooting_star"
              style={{ top: star.top, left: star.left, '--delay': star.delay }}
            ></div>
          ))}
        </div>
      </div>

      <Navbar />

      {/* Main content */}
      <main className="relative z-10 flex flex-col justify-center items-center text-center h-screen px-4">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-pink-400 to-purple-500 animate-fade-in drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]">
          {displayedText}
        </h1>
        <button
          onClick={handleGetStarted}
          className="mt-8 bg-[#34495e] hover:bg-gray-800 text-white px-6 py-3 text-lg font-semibold transition duration-300 shadow-lg cursor-pointer"
        >
          Get Started
        </button>
      </main>

      {/* Styles */}
      <style jsx>{`
        .scale-animation {
          animation: zoomIn 20s ease-in-out infinite;
        }
        @keyframes zoomIn {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .night {
          position: absolute;
          width: 100%;
          height: 100%;
          transform: rotateZ(45deg);
        }
        .shooting_star {
          position: absolute;
          width: 0;
          height: 2px;
          background: linear-gradient(-45deg, rgba(95,145,255,1), rgba(0,0,255,0));
          border-radius: 999px;
          filter: drop-shadow(0 0 6px rgba(105,155,255,1));
          animation: tail 3000ms ease-in-out infinite var(--delay),
                     shooting 3000ms ease-in-out infinite var(--delay);
        }
        .shooting_star::before,
        .shooting_star::after {
          content: '';
          position: absolute;
          top: calc(50% - 1px);
          right: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(
            -45deg,
            rgba(0,0,255,0),
            rgba(95,145,255,1),
            rgba(0,0,255,0)
          );
          border-radius: 100%;
          filter: drop-shadow(0 0 6px rgba(105,155,255,1));
          animation: shining 3000ms ease-in-out infinite var(--delay);
        }
        .shooting_star::before { transform: translateX(50%) rotateZ(45deg); }
        .shooting_star::after  { transform: translateX(50%) rotateZ(-45deg); }
        @keyframes tail {
          0%   { width: 0; }
          30%  { width: 100px; }
          100% { width: 0; }
        }
        @keyframes shining {
          0%   { width: 0; }
          50%  { width: 30px; }
          100% { width: 0; }
        }
        @keyframes shooting {
          0%   { transform: translateX(0); }
          100% { transform: translateX(300px); }
        }
      `}</style>
    </div>
  );
}
