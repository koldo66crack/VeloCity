import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";

// Import images
import whyBubble from "../assets/svg/why-bubble.svg";
import landlordAgent from "../assets/svg/landlord-agent.svg";
import agentOnWebsite from "../assets/svg/agent-on-website.svg";
import rentedStamp from "../assets/svg/rented-stamp.svg";
import moneyExchange from "../assets/svg/money-exchange.svg";
import confusedRenter from "../assets/svg/confused-renter.svg";
import funnel from "../assets/svg/funnel.svg";
import firstAccess from "../assets/svg/first-access.svg";
import betterValue from "../assets/svg/better-value.svg";
import higherQuality from "../assets/svg/higher-quality.svg";
import gem from "../assets/svg/gem-stone-svgrepo-com.svg";

// Reusable component for sections that fade in on scroll
const ScrollSection = ({ children }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-4 md:py-12 transition-opacity duration-1000 ease-in ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-8">{children}</div>
    </section>
  );
};

// Custom Button with the unique border effect
const CustomButton = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="relative group px-8 py-3 text-lg font-semibold text-gray-100 bg-gray-800 rounded-lg overflow-hidden transition-transform duration-200 active:scale-95 touch-manipulation"
    >
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white group-active:text-white">
        {children}
      </span>
      {/* Top-left border */}
      <span className="absolute top-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 ease-out group-hover:w-1/2 group-active:w-1/2"></span>
      <span className="absolute top-0 left-0 w-0.5 h-0 bg-green-400 transition-all duration-300 ease-out group-hover:h-1/2 group-active:h-1/2"></span>
      {/* Bottom-right border */}
      <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-green-400 transition-all duration-300 ease-out group-hover:w-1/2 group-active:w-1/2"></span>
      <span className="absolute bottom-0 right-0 w-0.5 h-0 bg-green-400 transition-all duration-300 ease-out group-hover:h-1/2 group-active:h-1/2"></span>
    </button>
  );
};

// Custom Card with border effects
const CustomCard = ({ children, className = "" }) => {
  return (
    <div className={`relative group bg-gray-800 p-8 rounded-xl space-y-4 overflow-hidden transition-transform duration-200 active:scale-[0.98] touch-manipulation ${className}`}>
      <span className="relative z-10">{children}</span>
      {/* Top-left border */}
      <span className="absolute top-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 ease-out group-hover:w-1/2 group-active:w-1/2"></span>
      <span className="absolute top-0 left-0 w-0.5 h-0 bg-green-400 transition-all duration-300 ease-out group-hover:h-1/2 group-active:h-1/2"></span>
      {/* Bottom-right border */}
      <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-green-400 transition-all duration-300 ease-out group-hover:w-1/2 group-active:w-1/2"></span>
      <span className="absolute bottom-0 right-0 w-0.5 h-0 bg-green-400 transition-all duration-300 ease-out group-hover:h-1/2 group-active:h-1/2"></span>
    </div>
  );
};

// Image component with elegant hover effects
const ElegantImage = ({ src, alt, className = "h-48 md:h-64" }) => {
  return (
    <div className={`relative group overflow-hidden rounded-lg bg-gray-900 transition-transform duration-200 active:scale-[0.98] touch-manipulation ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain p-4 transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-active:scale-105 group-active:brightness-110"
      />
      {/* Subtle overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300"></div>
      
      {/* Top-left border */}
      <span className="absolute top-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 ease-out group-hover:w-1/2 group-active:w-1/2"></span>
      <span className="absolute top-0 left-0 w-0.5 h-0 bg-green-400 transition-all duration-300 ease-out group-hover:h-1/2 group-active:h-1/2"></span>
      {/* Bottom-right border */}
      <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-green-400 transition-all duration-300 ease-out group-hover:w-1/2 group-active:w-1/2"></span>
      <span className="absolute bottom-0 right-0 w-0.5 h-0 bg-green-400 transition-all duration-300 ease-out group-hover:h-1/2 group-active:h-1/2"></span>
    </div>
  );
};

// Floating Gem Component
const FloatingGem = ({ delay, duration, size, opacity, startX, startY }) => {
  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: opacity,
        zIndex: 1,
      }}
    >
      <img
        src={gem}
        alt=""
        className="w-auto h-auto"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          // filter: "drop-shadow(0 0 15px rgba(34, 197, 94, 0.4)) brightness(1.3) saturate(2) hue-rotate(140deg) contrast(1.2)",
        }}
      />
    </div>
  );
};

// Swipeable Timeline Component
const SwipeableTimeline = ({ children }) => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const threshold = 50; // minimum swipe distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex < 2) {
        // Swipe left - next
        setCurrentIndex(prev => prev + 1);
      } else if (diff < 0 && currentIndex > 0) {
        // Swipe right - previous
        setCurrentIndex(prev => prev - 1);
      }
    }
    
    setIsDragging(false);
  };

  const timelineSteps = [
    {
      image: landlordAgent,
      title: "Step 1: The Handshake",
      description: "Landlords inform their trusted real estate agents about new, high-quality listings."
    },
    {
      image: agentOnWebsite,
      title: "Step 2: The Exclusive Listing", 
      description: "Agents post these gems on their own company websites first."
    },
    {
      image: rentedStamp,
      title: "Step 3: It's Gone",
      description: "The best apartments get rented by insiders before they ever reach public platforms."
    }
  ];

  return (
    <div className="relative">
      {/* Desktop Timeline */}
      <div className="hidden md:grid md:grid-cols-3 gap-8 text-center">
        {timelineSteps.map((step, index) => (
          <div key={index} className="space-y-4">
            <ElegantImage src={step.image} alt={step.title} />
            <h3 className="text-xl font-medium text-gray-200">{step.title}</h3>
            <p className="text-gray-400">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Mobile Swipeable Timeline */}
      <div 
        className="md:hidden"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {timelineSteps.map((step, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <div className="space-y-4 text-center">
                  <ElegantImage src={step.image} alt={step.title} />
                  <h3 className="text-xl font-medium text-gray-200">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Timeline Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {timelineSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-green-400 scale-125' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Landing Page Component
export default function LandingPage() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");

  const TYPEWRITER_TEXT =
    "What if I told you you're competing for the wrong apartments?";

  useEffect(() => {
    let currentChar = 0;
    const interval = setInterval(() => {
      setTypedText(TYPEWRITER_TEXT.slice(0, currentChar + 1));
      currentChar++;
      if (currentChar > TYPEWRITER_TEXT.length) {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 text-gray-200 font-sans relative overflow-hidden">
      {/* Floating Gems Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FloatingGem delay={0} duration={20} size={40} opacity={0.1} startX={10} startY={20} />
        <FloatingGem delay={3} duration={25} size={60} opacity={0.08} startX={85} startY={15} />
        <FloatingGem delay={7} duration={18} size={35} opacity={0.12} startX={20} startY={70} />
        <FloatingGem delay={12} duration={22} size={50} opacity={0.09} startX={75} startY={80} />
        <FloatingGem delay={5} duration={30} size={45} opacity={0.07} startX={50} startY={40} />
        <FloatingGem delay={15} duration={28} size={55} opacity={0.11} startX={90} startY={60} />
        <FloatingGem delay={8} duration={24} size={30} opacity={0.13} startX={5} startY={50} />
        <FloatingGem delay={18} duration={26} size={65} opacity={0.06} startX={60} startY={10} />
      </div>

      <Navbar />

      {/* --- Hero Section --- */}
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 relative z-10">
        <h1
          className="text-4xl md:text-6xl font-bold text-gray-200 leading-tight min-h-[140px] md:min-h-[160px]"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
        >
          {typedText}
          <span className="animate-blink text-green-400 ml-1">|</span>
        </h1>
        <p className="max-w-2xl mt-4 text-lg md:text-xl text-gray-400">
          Discover the hidden market of NYC apartments and get access to the
          best listings before anyone else.
        </p>
        <div className="mt-12">
          <CustomButton onClick={() => navigate("/home")}>
            Start Your Search
          </CustomButton>
        </div>
      </div>

      {/* --- Section 1: The Harsh Reality --- */}
      <ScrollSection>
        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-200">
              The Harsh Reality of Your Apartment Hunt
            </h2>
            <p className="mt-4 text-xl text-green-400 font-medium">
              The best 30% of apartments NEVER make it to StreetEasy.
            </p>
          </div>
          <ElegantImage src={whyBubble} alt="Why bubble illustration" />
        </div>
      </ScrollSection>

      {/* --- Section 2: The Hidden Timeline --- */}
      <ScrollSection>
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-200 text-center mb-16 relative z-10">
          The Hidden Timeline
        </h2>
        <div className="relative z-10">
          <SwipeableTimeline />
        </div>
      </ScrollSection>

      {/* --- Section 3: Why? --- */}
      <ScrollSection>
        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-200">
              Why Don't Agents Post Everywhere?
            </h2>
            <p className="mt-4 text-xl text-gray-400">
              It's simple: money. Major platforms charge hefty fees to list, so agents only post what they can't rent privately.
            </p>
          </div>
          <ElegantImage src={moneyExchange} alt="Money exchange illustration" />
        </div>
      </ScrollSection>

      {/* --- Section 4: What it means for you --- */}
      <ScrollSection>
        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <ElegantImage src={confusedRenter} alt="Confused renter looking at laptop" />
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-200">
              You're Competing for Leftovers.
            </h2>
            <p className="mt-4 text-xl text-gray-400">
              That means you're scrolling through the 70% of apartments that no one else wanted.
            </p>
          </div>
        </div>
      </ScrollSection>

      {/* --- Section 5: The Solution --- */}
      <ScrollSection>
        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-semibold text-green-400">
              The Solution is VeloCity.
            </h2>
            <p className="mt-4 text-xl text-gray-400">
              We aggregate verified listings directly from hundreds of real estate company websites, funneling them all into one place for you.
            </p>
          </div>
          <ElegantImage src={funnel} alt="Funnel illustration" />
        </div>
      </ScrollSection>

      {/* --- Section 6: Why Use Velocity --- */}
      <ScrollSection>
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-200 text-center mb-16 relative z-10">
          The VeloCity Advantage
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center relative z-10">
          <CustomCard>
            <ElegantImage src={firstAccess} alt="First access illustration" className="h-32 mb-2" />
            <h3 className="text-xl font-medium text-gray-200 mb-2">Get First Access</h3>
            <p className="text-gray-400">
              See apartments days or even weeks before they hit the mass market.
            </p>
          </CustomCard>
          <CustomCard>
            <ElegantImage src={betterValue} alt="Better value illustration" className="h-32 mb-2" />
            <h3 className="text-xl font-medium text-gray-200 mb-2">Find Better Value</h3>
            <p className="text-gray-400">
              Access fairly priced listings without the "StreetEasy markup."
            </p>
          </CustomCard>
          <CustomCard>
            <ElegantImage src={higherQuality} alt="Higher quality illustration" className="h-32 mb-2" />
            <h3 className="text-xl font-medium text-gray-200 mb-2">Discover Higher Quality</h3>
            <p className="text-gray-400">
              You're no longer looking at leftovers. You're looking at the best.
            </p>
          </CustomCard>
        </div>
      </ScrollSection>

      {/* --- Final CTA --- */}
      <ScrollSection>
        <div className="bg-gray-800 rounded-xl p-10 md:p-16 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-200">
            Stop Competing. Start Winning.
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Your dream apartment is out there. You just need to know where to look. Get started with VeloCity today.
          </p>
          <div className="mt-8">
            <CustomButton onClick={() => navigate("/home")}>
              Find My Apartment
            </CustomButton>
          </div>
        </div>
      </ScrollSection>

       {/* Styles */}
       <style jsx>{`
        .animate-blink {
          animation: blink 1.2s steps(1, end) infinite;
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(-10px) rotate(-3deg);
          }
          75% {
            transform: translateY(-30px) rotate(2deg);
          }
        }
      `}</style>
    </div>
  );
}
