"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type ActiveField = "text" | "image" | null

export default function ContentGenerator() {
    const [activeField, setActiveField] = useState<ActiveField>(null)
    const [textPrompt, setTextPrompt] = useState("")
    const [imagePrompt, setImagePrompt] = useState("")

    const handleTextClick = () => {
        setActiveField(activeField === "text" ? null : "text")
    }

    const handleImageClick = () => {
        setActiveField(activeField === "image" ? null : "image")
    }

    const [resultText, setResultText] = useState("");
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        if (activeField === "text") {
            const res = await fetch("/api/copy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: textPrompt }),
            });
            const data = await res.json();
            console.log("Resposta da API:", data);
            setResultText(data.copy || data.result || data.error || "Erro ao gerar texto");
            setResultImage(null);
        } else if (activeField === "image") {
            const res = await fetch("/api/image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: imagePrompt }),
            });
            const data = await res.json();
            if (data.imagePath) {
                setResultImage(data.imagePath);
                setResultText("");
            } else {
                setResultText(data.error || "Erro ao gerar imagem");
                setResultImage(null);
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    {/* Título Principal */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Gerador de Conteúdo</h1>
                        <p className="text-gray-600 text-lg">Escolha uma opção para começar a criar</p>
                    </div>

                    {/* Botões */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <Button
                            onClick={handleTextClick}
                            variant={activeField === "text" ? "default" : "outline"}
                            size="lg"
                            className="flex-1 h-14 text-lg font-medium transition-all duration-300 hover:scale-105"
                        >
                            Copiar Texto
                        </Button>

                        <Button
                            onClick={handleImageClick}
                            variant={activeField === "image" ? "default" : "outline"}
                            size="lg"
                            className="flex-1 h-14 text-lg font-medium transition-all duration-300 hover:scale-105"
                        >
                            Gerar Imagens
                        </Button>
                    </div>

                    {/* Campo de Texto - Transição */}
                    <div className="relative overflow-hidden">
                        <div
                            className={`transition-all duration-500 ease-in-out ${activeField === "text"
                                    ? "opacity-100 max-h-96 transform translate-y-0"
                                    : "opacity-0 max-h-0 transform -translate-y-4"
                                }`}
                        >
                            <div className="pb-4">
                                <Textarea
                                    value={textPrompt}
                                    onChange={(e) => setTextPrompt(e.target.value)}
                                    placeholder="Digite seu prompt para o texto aqui..."
                                    className="min-h-32 resize-none text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors duration-300"
                                />
                            </div>
                        </div>

                        <div
                            className={`transition-all duration-500 ease-in-out ${activeField === "image"
                                    ? "opacity-100 max-h-96 transform translate-y-0"
                                    : "opacity-0 max-h-0 transform -translate-y-4"
                                }`}
                        >
                            <div className="pb-4">
                                <Textarea
                                    value={imagePrompt}
                                    onChange={(e) => setImagePrompt(e.target.value)}
                                    placeholder="Digite seu prompt para a imagem aqui..."
                                    className="min-h-32 resize-none text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors duration-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botão de Ação (aparece quando há um campo ativo) */}
                    <div
                        className={`transition-all duration-300 ${activeField ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
                            }`}
                    >
                        {activeField && (
                            <Button
                                size="lg"
                                className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                onClick={handleGenerate}
                                disabled={loading}
                            >
                                {loading
                                    ? "Gerando..."
                                    : activeField === "text"
                                        ? "Gerar Texto"
                                        : "Gerar Imagem"}
                            </Button>
                        )}
                    </div>

                    {resultText && (
                        <div className="mt-6 p-4 bg-gray-100 rounded-xl text-gray-800 whitespace-pre-line">
                            {resultText}
                        </div>
                    )}
                    {resultImage && (
                        <div className="mt-6 flex justify-center">
                            <img src={resultImage} alt="Imagem gerada" className="rounded-xl max-h-96" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
