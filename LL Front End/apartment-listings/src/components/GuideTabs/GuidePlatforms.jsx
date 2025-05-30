import { useNavigate } from "react-router-dom";

export default function GuidePlatforms() {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-2xl font-bold text-[#34495e] mb-2 uppercase">Platforms: How To Search?</h2>
      <p className="text-black text-lg mb-2">
        There are 350+ platforms for NYC rentals. VeloCity brings them all together in one place—each listing scored for you!
      </p>
      <button
        className="bg-[#34495e] text-white px-6 py-2 font-bold uppercase mt-2"
        style={{ borderRadius: 0 }}
        onClick={() => navigate('/home')}
      >
        See All Listings
      </button>
    </section>
  );
}
