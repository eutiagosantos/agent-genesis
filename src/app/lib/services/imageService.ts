import { GoogleGenAI, Modality } from "@google/genai";
import fs from "fs";
import path from "path";

export async function generateImage(prompt: string){
    const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});
    
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: prompt,
        config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
        }
    });
    if (response && response.candidates && response.candidates[0]?.content?.parts) {
        // Garante que a pasta existe
        const imagesDir = path.resolve(process.cwd(), "images-gemini");
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir);
        }
        let imageCount = 1;
        for (const part of response.candidates[0].content.parts) {
            // Based on the part type, either show the text or save the image
            if (part.text) {
                console.log(part.text);
            } else if (part.inlineData && part.inlineData.data) {
                const imageData = part.inlineData.data;
                if (typeof imageData === "string") {
                    const buffer = Buffer.from(imageData, "base64");
                    const imagePath = path.join(imagesDir, `gemini-native-image-${imageCount}.png`);
                    fs.writeFileSync(imagePath, buffer);
                    console.log(`Image saved as ${imagePath}`);
                    imageCount++;
                } else {
                    console.error("Dados da imagem não são uma string base64 válida.");
                }
            }
        }
    } else {
        console.error("Resposta inesperada da API ou sem candidatos.");
    }
}