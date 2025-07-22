import { generateAudio, getGoogleVoices } from "@/app/lib/services/generateAudio";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    console.log('POST /api/audio - Iniciando processamento');

    try {
        // Verificar se o body existe e é válido
        let body;
        try {
            body = await req.json();
            console.log('Body recebido:', body);
        } catch (jsonError) {
            console.error('Erro ao parsear JSON:', jsonError);
            return NextResponse.json(
                { error: "Body da requisição inválido", success: false },
                { status: 400 }
            );
        }

        // Aceitar tanto voiceName quanto voicename
        const { prompt, voiceName, voicename } = body;
        const finalVoiceName = voiceName || voicename;

        // Validação adicional
        if (!prompt || !finalVoiceName) {
            console.log('Validação falhou - parâmetros faltando:', {
                prompt: !!prompt,
                voiceName: !!voiceName,
                voicename: !!voicename,
                finalVoiceName: !!finalVoiceName
            });
            return NextResponse.json(
                { error: "Prompt e voz são obrigatórios.", success: false },
                { status: 400 }
            );
        }

        console.log('Parâmetros válidos:', { prompt: prompt.substring(0, 50) + '...', voiceName: finalVoiceName });

        const response = await generateAudio(prompt, finalVoiceName);

        console.log('Áudio gerado com sucesso:', response);

        return NextResponse.json({
            success: true,
            response
        });

    } catch (error) {
        console.error('Erro na API route:', error);

        // Garantir que sempre retornamos uma resposta
        const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';

        return NextResponse.json(
            {
                error: errorMessage,
                success: false
            },
            { status: 500 }
        );
    }
}



export function GET(){
    const response = getGoogleVoices();
    return NextResponse.json({
        response
    })
}