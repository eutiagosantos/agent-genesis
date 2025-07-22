import { DallEAPIWrapper } from "@langchain/openai";

export async function generateImage(prompt: string): Promise<string> {
    try {
    const tool = new DallEAPIWrapper({
        n: 1,
        model: "dall-e-3",
            apiKey: process.env.OPENAI_API_KEY
    });

    const imageURL = await tool.invoke(prompt);

        if (typeof imageURL === "string" && imageURL.startsWith("http")) {
            return imageURL;
        }

        if (Array.isArray(imageURL) && imageURL.length > 0 && typeof imageURL[0] === "string") {
            return imageURL[0];
        }

        throw new Error("Não foi possível gerar a imagem ou URL inválida.");
    } catch (error) {
        console.error("Erro ao gerar imagem:", error);
        throw new Error("Erro ao gerar imagem: " + (error instanceof Error ? error.message : String(error)));
    }
}