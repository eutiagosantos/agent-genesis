import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';
import multer from "multer"
import path from 'path';
import * as fs from "fs"
const ELEVENLABS_API_KEY="sk_78d5805c27e9c1a23b24195258d794fa6bccc6e54e96a6a9"
export async function generateAudio(prompt: string){
    const elevenlabs = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });
    const audio = await elevenlabs.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
        text: prompt,
        modelId: 'eleven_multilingual_v2',
        outputFormat: 'mp3_44100_128',
    });

    const audioStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, 'uploads/');
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now();
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });

    // Função para salvar o arquivo de áudio gerado
    const saveAudioFile = async (audioBuffer: Buffer, fileName: string): Promise<string> => {
        const uploadPath = path.join(__dirname, 'uploads/');
        fs.mkdirSync(uploadPath, { recursive: true });
        const filePath = path.join(uploadPath, fileName);
        await fs.promises.writeFile(filePath, audioBuffer);
        return filePath;
    };

    const fileName = `audio-${Date.now()}.mp3`;

    // O objeto 'audio' retornado por elevenlabs.textToSpeech.convert provavelmente é um ReadableStream
    // Precisamos ler o stream e converter para Buffer antes de salvar
    const chunks: Buffer[] = [];
    for await (const chunk of audio as any) {
        chunks.push(Buffer.from(chunk));
    }
    const audioBuffer = Buffer.concat(chunks);

    await saveAudioFile(audioBuffer, fileName);
}