import { NextResponse } from "next/server";
import { copywriterBot } from "../../lib/services/copyservice";
import { NextRequest } from "next/server";


//copy
export async function POST(req: NextRequest) {
    const { prompt } = await req.json();
    console.log("Prompt recebido no backend:", prompt);
    if (!prompt) {
        return NextResponse.json({ error: "Prompt é obrigatório" }, { status: 400 });
    }
    const result = await copywriterBot.chat(prompt);
    return NextResponse.json({ result });
}
