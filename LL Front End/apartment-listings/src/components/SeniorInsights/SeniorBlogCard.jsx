// SeniorBlogList.jsx
export default function SeniorBlogList() {
  const TESTIMONIALS = [
    {
      name: "Aayush, Columbia MSDS ’25",
      img: "https://randomuser.me/api/portraits/men/76.jpg",
      quote: "Start early—by July, the good ones are gone. Wish I'd checked 311 complaints sooner, too!",
    },
    {
      name: "Simran, Teachers College ’24",
      img: "https://randomuser.me/api/portraits/women/65.jpg",
      quote: "Don't wire money before a video tour. Almost got scammed twice. Ask seniors for real advice!",
    },
    {
      name: "Luis, SIPA ’23",
      img: "https://randomuser.me/api/portraits/men/43.jpg",
      quote: "Brokers aren't always evil—sometimes they're a lifeline. But ALWAYS ask for a no-fee place first.",
    },
    {
      name: "Mina, GSAPP ’25",
      img: "https://randomuser.me/api/portraits/women/90.jpg",
      quote: "Roommates can save you, or ruin you. Vet everyone and make agreements before hunting.",
    },
    {
      name: "Pedro, SEAS ’24",
      img: "https://randomuser.me/api/portraits/men/35.jpg",
      quote: "West Harlem had the best value for me. Don't be afraid to look beyond Morningside Heights.",
    },
    // Add more!
  ];

  function SeniorBlogCard({ img, name, quote }) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-white border-2 border-[#34495e] px-6 py-6"
        style={{
          minWidth: 280,
          maxWidth: 340,
          borderRadius: 0,
          boxShadow: "0 2px 16px rgba(52,73,94,0.07)",
          height: 270,
          margin: "1rem",
        }}
      >
        <img
          src={img}
          alt={name}
          className="w-16 h-16 mb-2 object-cover"
          style={{
            borderRadius: 0,
            border: "2px solid #34495e",
          }}
        />
        <div className="font-extrabold text-[#34495e] text-base uppercase mb-1 text-center">{name}</div>
        <div className="text-black text-lg text-center font-medium italic">“{quote}”</div>
      </div>
    );
  }

  return (
    <div className="my-10 mt-4">
      <div className="flex flex-wrap justify-center">
        {TESTIMONIALS.map((t, idx) => (
          <SeniorBlogCard key={idx + t.name} {...t} />
        ))}
      </div>
      <div className="text-sm text-[#34495e] text-center mt-4">
        Want to add your story? <a href="mailto:hello@velocity.com" className="underline font-bold">Email us!</a>
      </div>
    </div>
  );
}
