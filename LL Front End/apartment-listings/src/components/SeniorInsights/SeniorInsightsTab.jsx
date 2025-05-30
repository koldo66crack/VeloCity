import SeniorBlogList from "./SeniorBlogList";
import SeniorBlogCard from "./SeniorBlogCard";
import title_logo from "../../assets/svg/title_logo.svg";

export default function SeniorInsightsTab() {
  const DOS = [
    "Start your search early—May or June is prime time!",
    "Talk to seniors and ask for real stories.",
    "Check building reviews and 311 complaints for every address.",
    "Visit in person or get a video tour before sending any money.",
    "Know your total budget, including broker/guarantor fees.",
    "Have all documents ready: ID, bank statements, admission letter.",
    "Be responsive—good apartments go FAST.",
  ];

  const DONTS = [
    "Don’t trust listings that look too good to be true.",
    "Don’t wire money or pay a deposit before seeing the place.",
    "Don’t delay—if you wait, someone else will grab your dream apartment.",
    "Don’t skip roommate background checks. (Seriously!)",
    "Don’t ignore red flags in reviews or building complaints.",
    "Don’t rely on a single marketplace—cross-check everything.",
    "Don’t sign anything you don’t fully understand.",
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#34495e] mb-4 uppercase">
        Senior Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* DO's */}
        <div
          className="bg-white border-2 border-green-400 p-6"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-2" role="img" aria-label="do">
              ✅
            </span>
            <span className="text-xl font-extrabold text-green-400 uppercase">
              DO's
            </span>
          </div>
          <ul className="pl-2">
            {DOS.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start text-black text-lg mb-2"
              >
                <img src={title_logo} alt="" className="w-5 h-5 mr-3 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* DONT's */}
        <div
          className="bg-white border-2 border-red-400 p-6"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-2" role="img" aria-label="dont">
              ❌
            </span>
            <span className="text-xl font-extrabold text-red-400 uppercase">
              DON'Ts
            </span>
          </div>
          <ul className="pl-2">
            {DONTS.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start text-black text-lg mb-2"
              >
                <img src={title_logo} alt="" className="w-5 h-5 mr-3 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#34495e] mb-4 uppercase">
        {" "}
        Rental Vocab
      </h2>
      <SeniorBlogList />

      <h2 className="text-2xl font-bold text-[#34495e] mb-4 uppercase">
        {" "}
        What We Wish We Knew While Renting in NYC
      </h2>
      <SeniorBlogCard />

      <p className="text-black text-lg mb-8">
        Real tips and blogs from students who’ve crushed the NYC rental
        hunt—coming soon!
      </p>
      <div className="text-center">
        <a
          href="https://chat.whatsapp.com/yourlink"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[#34495e] font-bold text-lg"
        >
          Join the Senior Tips Chat &rarr;
        </a>
      </div>
    </div>
  );
}
