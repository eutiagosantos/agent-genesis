import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Readable } from "stream";
import { createWriteStream } from "fs";
import path from "path";
import * as fs from "fs";

const ai = new GoogleGenAI({});

export async function generateVideo(prompt: string) {
    let operation = await ai.models.generateVideos({
        model: "veo-3.0-generate-preview",
        prompt: prompt,
        config: {
            personGeneration: "allow_all",
            aspectRatio: "16:9",
        },
    });

    while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({
            operation: operation,
        });
    }

    const savedFiles: string[] = [];
    if (operation.response?.generatedVideos) {
        const uploadDir = path.join(process.cwd(), "uploads");
        await fs.promises.mkdir(uploadDir, { recursive: true });

        for (const [n, generatedVideo] of operation.response.generatedVideos.entries()) {
            const videoUri = generatedVideo.video?.uri;
            if (!videoUri) continue;
            const resp = await fetch(`${videoUri}&key=${process.env.GEMINI_API_KEY}`);
            if (!resp.body) {
                console.error("Resposta sem corpo para o vídeo", n);
                continue;
            }
            const uniqueSuffix = Date.now();
            const fileName = `video-${uniqueSuffix}-${n}.mp4`;
            const filePath = path.join(uploadDir, fileName);
            // @ts-ignore
            const nodeStream = (Readable as any).fromWeb ? (Readable as any).fromWeb(resp.body) : Readable.from(resp.body as any);
            const writer = createWriteStream(filePath);
            await new Promise<void>((resolve, reject) => {
                nodeStream.pipe(writer);
                writer.on('finish', () => resolve());
                writer.on('error', () => reject());
            });
            savedFiles.push(filePath);
        }
    }
    // Retorna o(s) caminho(s) do(s) vídeo(s) salvo(s)
    return savedFiles;
}

export async function resumeYoutubeVideo(videoUrl: string) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const videoPart = {
        fileData: {
            mimeType: "video/mp4",
            fileUri: videoUrl
        },
    };

    const result = await model.generateContent([
        "Por favor, resuma o vídeo a seguir com riqueza de detalhes para um empreendedor iniciante aprender com esse vídeo.",
        videoPart 
    ]);

    return result;
}