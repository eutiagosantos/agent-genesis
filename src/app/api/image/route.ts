import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/app/lib/services/imageService";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();
    if (!prompt) {
        return NextResponse.json({ error: "Prompt é obrigatório" }, { status: 400 });
    }

    await generateImage(prompt);

    // Busca a última imagem gerada na pasta images-gemini
    const imagesDir = path.resolve(process.cwd(), "genesis-agent/images-gemini");

    // Garante que a pasta existe
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    let files: string[] = [];
    try {
        files = fs.readdirSync(imagesDir)
            .filter(f => f.endsWith(".png"))
            .sort((a, b) => fs.statSync(path.join(imagesDir, b)).mtimeMs - fs.statSync(path.join(imagesDir, a)).mtimeMs);
    } catch (err) {
        return NextResponse.json({ error: "Erro ao acessar as imagens" }, { status: 500 });
    }

    if (files.length === 0) {
        return NextResponse.json({ error: "Nenhuma imagem gerada" }, { status: 500 });
    }

    // Retorna o caminho relativo para o frontend buscar a imagem
    return NextResponse.json({ imagePath: `/genesis-agent/images-gemini/${files[0]}` });
}