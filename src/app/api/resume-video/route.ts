import { resumeYoutubeVideo } from "@/app/lib/services/generateVideo";
import { NextResponse } from "next/server";


export async function POST(req: Request){
    const body = await req.json();

    const videoUrl = body.videoUrl;

    if (!videoUrl || typeof videoUrl !== 'string') {
        return NextResponse.json({ error: "Request body must include a 'videoUrl' string." }, { status: 400 });
    }

    try {
        const summary = await resumeYoutubeVideo(videoUrl);

        return NextResponse.json({ summary });

    } catch (error) {
        console.error("Error generating video summary:", error);

        return NextResponse.json({ error: "Failed to generate video summary." }, { status: 500 });
    }
}