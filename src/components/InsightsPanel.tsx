import { Insights } from "../app/lib/facebook/types";

interface InsightsPanelProps {
  insights: Insights;
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <div className="border rounded p-4 bg-gray-50">
      <h2 className="font-bold mb-2">Insights da IA</h2>
      <div className="mb-2">
        <strong>Palavras-chave:</strong> {insights.top_keywords.join(", ")}
      </div>
      <div className="mb-2">
        <strong>CTAs comuns:</strong> {insights.common_ctas.join(", ")}
      </div>
      <div className="mb-2">
        <strong>Tendências visuais:</strong> {insights.visual_trends}
      </div>
      <div className="mb-2">
        <strong>Público-alvo:</strong> {insights.audience_focus}
      </div>
      <div className="mb-2">
        <strong>Recomendações:</strong>
        <ul className="list-disc ml-5">
          {insights.recommendations.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 