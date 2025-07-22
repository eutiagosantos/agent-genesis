import { analyseVideo, storage } from "@/app/lib/services/analyseService";
import multer from "multer";
import { NextResponse } from "next/server";
import path from "path";
import * as fs from "fs";

const upload = multer({storage: storage});

export async function POST(req: Request){
    let filePath = "";
    const data = await req.formData();
    const file: File | null = data.get('video') as unknown as File;
    if (!file) {
        return NextResponse.json({ success: false, error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    // 2. Salvar o arquivo temporariamente no servidor
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define um diretório temporário. No Next.js, a pasta /tmp é um bom lugar para isso em ambientes de servidor (como Vercel).
    // Para desenvolvimento local, vamos criar uma pasta 'uploads'.
    const tempDir = path.join(process.cwd(), 'uploads');
    await fs.promises.mkdir(tempDir, { recursive: true }); // Cria o diretório se não existir

    // Cria um nome de arquivo único
    const uniqueSuffix = Date.now();
    filePath = path.join(tempDir, `${uniqueSuffix}-${file.name}`);

    await fs.promises.writeFile(filePath, buffer);

    const analyseResponse = await analyseVideo(filePath);

    return NextResponse.json({
        success: true,
        data: analyseResponse
    })
}