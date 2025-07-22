import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface SearchFormProps {
  onSearch: (params: {
    query: string;
    country?: string;
    category?: string;
    ad_type?: string;
    period?: string;
  }) => void;
  loading?: boolean;
}

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [adType, setAdType] = useState("");
  const [period, setPeriod] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault();
        onSearch({ query, country, category, ad_type: adType, period });
      }}
    >
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Produto ou tópico..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        required
      />
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="País"
          value={country}
          onChange={e => setCountry(e.target.value)}
        />
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Categoria"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Tipo de anúncio"
          value={adType}
          onChange={e => setAdType(e.target.value)}
        />
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Período (ex: últimos 30 dias)"
          value={period}
          onChange={e => setPeriod(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Pesquisando..." : "Pesquisar"}
      </Button>
    </form>
  );
} 