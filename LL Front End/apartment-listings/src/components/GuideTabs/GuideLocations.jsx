export default function GuideLocations() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-[#34495e] mb-2 uppercase">Location: Where To Search?</h2>
      <p className="text-black text-lg mb-4">Start with these neighborhoods near Columbia:</p>
      <ul className="grid grid-cols-2 gap-4 text-black">
        {["Upper West Side", "Manhattanville", "Manhattan Valley", "South Harlem", "West Harlem", "Morningside Heights"].map(n => (
          <li key={n} className="px-4 py-2 border border-[#34495e] bg-gray-50" style={{ borderRadius: 0 }}>{n}</li>
        ))}
      </ul>
    </section>
  );
}
