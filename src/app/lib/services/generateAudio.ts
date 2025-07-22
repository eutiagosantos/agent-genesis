import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import path from "path";

export async function generateAudio(prompt: string, voiceName: string) {
    // Validação de entrada com logs para debug
    console.log('generateAudio chamado com:', { prompt: !!prompt, voiceName: !!voiceName });
    console.log('Valores recebidos:', { prompt, voiceName });

    if (!prompt || !voiceName) {
        const errorMsg = `Parâmetros inválidos: prompt=${!!prompt}, voiceName=${!!voiceName}`;
        console.error(errorMsg);
        throw new Error("Prompt e voz são obrigatórios.");
    }

    // Verificar se a API key está configurada
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("API key do Google AI não configurada");
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        console.log('Fazendo requisição para o Gemini...');

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

        console.log('Resposta recebida do Gemini');

        // Verificar se a resposta contém dados de áudio
        const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!data) {
            console.error("Estrutura da resposta:", JSON.stringify(response, null, 2));
            throw new Error("Não foi possível gerar o áudio. Verifique se o prompt e a voz são válidos.");
        }

        // Converter base64 para buffer
        const audioBuffer = Buffer.from(data, 'base64');
        console.log('Buffer de áudio criado, tamanho:', audioBuffer.length);

        // Salvar arquivo
        const fileName = `out-${Date.now()}.wav`;
        await saveWaveFile(fileName, audioBuffer);

        console.log('Arquivo salvo:', fileName);

        return `/uploads/${fileName}`;

    } catch (error) {
        console.error('Erro ao gerar áudio:', error);

        if (error instanceof Error) {
            throw new Error(`Erro na geração de áudio: ${error.message}`);
        } else {
            throw new Error('Erro desconhecido na geração de áudio');
        }
    }
}

// Função auxiliar para salvar o arquivo (você precisa implementar esta função)
async function saveWaveFile(fileName: string, audioBuffer: Buffer): Promise<void> {
    const fs = require('fs').promises;
    const path = require('path');

    // Criar diretório uploads se não existir
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Salvar arquivo
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, audioBuffer);
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