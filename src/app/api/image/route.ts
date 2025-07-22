import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/app/lib/services/imageService";

export async function POST(req: NextRequest) {
    const { prompt } = await req.json();
    if (!prompt) {
        return NextResponse.json({ error: "Prompt é obrigatório" }, { status: 400 });
    }

    try {
        const imageUrl = await generateImage(prompt);
        return NextResponse.json({ imageUrl });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao gerar imagem" }, { status: 500 });
    }
}