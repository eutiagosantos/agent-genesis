import { Ad } from "../app/lib/facebook/types";

interface AdCardProps {
  ad: Ad;
}

export function AdCard({ ad }: AdCardProps) {
  return (
    <div className="border rounded p-4 flex flex-col gap-2">
      <img src={ad.image} alt={ad.title} className="w-full h-40 object-cover rounded" />
      <h3 className="font-bold text-lg">{ad.title}</h3>
      <p className="text-sm text-gray-700">{ad.description}</p>
      <a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm mt-2">Ver anúncio</a>
    </div>
  );
} 