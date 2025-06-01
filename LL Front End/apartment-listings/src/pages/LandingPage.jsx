import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import background from "../assets/img/background_image.jpg";
import Navbar from "../components/Navbar";
import CountdownTimer from "../components/CountdownTimer";
import velocity from "../assets/svg/navbar_logo_white.svg";

const TYPEWRITER_TEXT = "You’re at the right place, at the right time.";
const HERO_PARA =
  "Gives you early access to hidden NYC listings—apartments that never make it to the big platforms.";

export default function LandingPage() {
  const navigate = useNavigate();

  // --- Typewriter Effect for HERO LINE ---
  const [typedText, setTypedText] = useState("");
  useEffect(() => {
    let currentChar = 0;
    let interval = setInterval(() => {
      setTypedText(TYPEWRITER_TEXT.slice(0, currentChar + 1));
      currentChar++;
      if (currentChar === TYPEWRITER_TEXT.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, []);

  // --- Star Background ---
  const stars = useMemo(
    () =>
      Array.from({ length: 20 }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 10000}ms`,
      })),
    []
  );

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
              style={{ top: star.top, left: star.left, "--delay": star.delay }}
            ></div>
          ))}
        </div>
      </div>

      <Navbar />

      {/* Main content */}
      <main className="relative z-10 flex flex-col justify-center items-center text-center h-screen px-4">
        <div className="flex flex-col items-center w-full max-w-3xl mt-12">
          {/* --- Typewriter HERO LINE --- */}
          <h1
            className="
              text-3xl sm:text-6xl font-extrabold
              bg-clip-text text-transparent
              bg-gradient-to-r from-blue-400 via-pink-400 to-purple-500
              drop-shadow-[0_2px_8px_rgba(255,255,255,0.35)]
              animate-fade-in
              mb-3
              min-h-[3.2em] 
            "
            style={{
              letterSpacing: "0.01em",
              minHeight: "2.2em",
              fontFamily:
                "'Montserrat', 'Inter', 'Segoe UI', Arial, sans-serif",
            }}
          >
            {typedText}
            <span
              className="animate-blink text-white/70"
              style={{ marginLeft: 2 }}
            >
              {typedText.length !== TYPEWRITER_TEXT.length && "|"}
            </span>
          </h1>

          {/* --- Mini Paragraph --- */}
          <p
            className="
    text-base sm:text-lg font-normal 
    bg-white/10 backdrop-blur-lg
    px-4 py-2 max-w-md
    text-white/90 shadow-md
    mb-2 border-l-4 border-pink-300
    transition-all duration-500
    flex items-center
    "
            style={{
              marginTop: "0.2em",
              letterSpacing: "0.01em",
              fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
              fontWeight: 400,
            }}
          >
            <img
              src={velocity}
              className="h-7 w-auto mr-2 align-middle"
              alt="VeloCity Logo"
            />
            {HERO_PARA}
          </p>

          {/* --- Countdown Timer --- */}
          {/* <CountdownTimer label="NYC peak rental season starts in:" /> */}

          {/* --- Button Stack --- */}
          <div className="flex flex-row gap-6 mt-12 w-full items-center justify-center">
            <button
              onClick={() => navigate("/guide")}
              className="mt-8 bg-[#34495e] hover:bg-gray-800 text-white px-6 py-3 text-lg font-semibold transition duration-300 shadow-lg cursor-pointer"
              style={{ borderRadius: 0, letterSpacing: "0.05em" }}
            >
              Guide to Rent Like a Pro
            </button>
            <button
              onClick={() => navigate("/home")}
              className="mt-8 bg-[#34495e] hover:bg-gray-800 text-white px-6 py-3 text-lg font-semibold transition duration-300 shadow-lg cursor-pointer"
              style={{ borderRadius: 0, letterSpacing: "0.05em" }}
            >
              Start Apartment Search
            </button>
          </div>
        </div>
      </main>

      {/* Styles */}
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
          background: linear-gradient(
            -45deg,
            rgba(95, 145, 255, 1),
            rgba(0, 0, 255, 0)
          );
          border-radius: 999px;
          filter: drop-shadow(0 0 6px rgba(105, 155, 255, 1));
          animation: tail 3000ms ease-in-out infinite var(--delay),
            shooting 3000ms ease-in-out infinite var(--delay);
        }
        .shooting_star::before,
        .shooting_star::after {
          content: "";
          position: absolute;
          top: calc(50% - 1px);
          right: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(
            -45deg,
            rgba(0, 0, 255, 0),
            rgba(95, 145, 255, 1),
            rgba(0, 0, 255, 0)
          );
          border-radius: 100%;
          filter: drop-shadow(0 0 6px rgba(105, 155, 255, 1));
          animation: shining 3000ms ease-in-out infinite var(--delay);
        }
        .shooting_star::before {
          transform: translateX(50%) rotateZ(45deg);
        }
        .shooting_star::after {
          transform: translateX(50%) rotateZ(-45deg);
        }
        @keyframes tail {
          0% {
            width: 0;
          }
          30% {
            width: 100px;
          }
          100% {
            width: 0;
          }
        }
        @keyframes shining {
          0% {
            width: 0;
          }
          50% {
            width: 30px;
          }
          100% {
            width: 0;
          }
        }
        @keyframes shooting {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(300px);
          }
        }
        @keyframes blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
        .animate-blink {
          animation: blink 1s steps(2, start) infinite;
        }
      `}</style>
    </div>
  );
}
