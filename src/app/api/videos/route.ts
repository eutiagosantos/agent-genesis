import { generateVideo } from "@/app/lib/services/generateVideo";


export async function POST(req: Request) {
    const body = await req.json();
    if (!body) {
        throw new Error("body vazio");
    }
    const video = await generateVideo(body);

    return new Response(JSON.stringify({ success: true, video }), {
        headers: { "Content-Type": "application/json" }
    });
}
