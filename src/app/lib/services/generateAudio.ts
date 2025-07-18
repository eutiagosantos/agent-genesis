import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import path from "path";

export async function generateAudio(prompt: string, voiceName: string) {
    const ai = new GoogleGenAI({});

    if (!prompt || !voiceName) {
        throw new Error("Prompt e voz são obrigatórios.");
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName },
                },
            },
        },
    });

    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!data) {
        // Log para debug
        console.error("Resposta da API Gemini:", JSON.stringify(response, null, 2));
        throw new Error("Não foi possível gerar o áudio. Verifique se o prompt e a voz são válidos.");
    }
    const audioBuffer = Buffer.from(data, 'base64');

    const fileName = `out-${Date.now()}.wav`;
    await saveWaveFile(fileName, audioBuffer);

    // Supondo que uploads/ está exposta em /uploads
    return `/uploads/${fileName}`;
}

async function saveWaveFile(fileName: string, audioBuffer: Buffer) {
    const uploadPath = path.join(__dirname, 'uploads/');
    fs.mkdirSync(uploadPath, { recursive: true });
    const filePath = path.join(uploadPath, fileName);
    await fs.promises.writeFile(filePath, audioBuffer);
    return filePath;
}

export function getGoogleVoices() {
    return [
        { name: "Zephyr", description: "Bright" },
        { name: "Puck", description: "Upbeat" },
        { name: "Charon", description: "Informativo" },
        { name: "Kore", description: "Firm" },
        { name: "Fenrir", description: "Excitável" },
        { name: "Leda", description: "Youthful" },
        { name: "Orus", description: "Empresa" },
        { name: "Aoede", description: "Breezy" },
        { name: "Callirrhoe", description: "Tranquila" },
        { name: "Autonoe", description: "Bright" },
        { name: "Encélado", description: "Breathy" },
        { name: "Iapetus", description: "Clear" },
        { name: "Umbriel", description: "Tranquila" },
        { name: "Algieba", description: "Smooth" },
        { name: "Despina", description: "Smooth" },
        { name: "Erinome", description: "Clear" },
        { name: "Algenib", description: "Gravelly" },
        { name: "Rasalgethi", description: "Informativo" },
        { name: "Laomedeia", description: "Upbeat" },
        { name: "Achernar", description: "Suave" },
        { name: "Alnilam", description: "Firm" },
        { name: "Schedar", description: "Par" },
        { name: "Gacrux", description: "Mature" },
        { name: "Pulcherrima", description: "Avançar" },
        { name: "Achird", description: "Friendly" },
        { name: "Zubenelgenubi", description: "Casual" },
        { name: "Vindemiatrix", description: "Gentle" },
        { name: "Sadachbia", description: "Lively" },
        { name: "Sadaltager", description: "Conhecimento" },
        { name: "Sulafat", description: "Quente" },
    ];
}