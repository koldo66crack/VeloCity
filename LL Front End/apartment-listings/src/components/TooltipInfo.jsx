// src/components/TooltipInfo.jsx
import { Info } from "lucide-react"; // or use your own SVG/icon

export default function TooltipInfo({ text }) {
  return (
    <span className="relative group ml-1 align-middle inline-block">
      <Info size={15} className="inline text-[#34495e] group-hover:text-gray-800 cursor-pointer" />
      <span
        className="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto 
        transition bg-gray-800 text-white text-xs rounded px-2 py-1 absolute left-1/2 z-50 -translate-x-1/2 mt-2
        whitespace-pre-line min-w-max shadow-lg"
        style={{ bottom: '-2.2em' }}
      >
        {text}
      </span>
    </span>
  );
}
