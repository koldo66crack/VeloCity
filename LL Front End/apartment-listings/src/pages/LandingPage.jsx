import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import background from '../assets/img/background_image.jpg';
import Navbar from '../components/Navbar';

const baseText = 'Helping you';
const endings = [
  ' lease with ease.',
  ' navigate the NYC jungle.',
  ' find apartments like a local.',
  ' feel at home, fast.',
  ' simplify your housing search.'
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

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
          setTimeout(() => {
            setIndex((prev) => (prev + 1) % endings.length);
          }, 2000);
        }
      }, 60);
    };

    typeText();
    return () => clearInterval(interval);
  }, [index]);

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center scale-animation"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>

      <Navbar />

      {/* Main */}
      <main className="relative z-10 flex flex-col justify-center items-center text-center h-screen px-4">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-pink-400 to-purple-500 animate-fade-in drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]">
          {displayedText}
        </h1>

        <button
          onClick={handleGetStarted}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-300 shadow-lg cursor-pointer"
        >
          Get Started
        </button>
      </main>

      {/* Zoom animation */}
      <style jsx>{`
        .scale-animation {
          animation: zoomIn 20s ease-in-out infinite;
        }

        @keyframes zoomIn {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}