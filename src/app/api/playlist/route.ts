"use server"

import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const playlistLinks = formData.getAll("playlistlink[]") as string[];

  const videoResults: any[] = [];

  for (const link of playlistLinks) {
    const playlistId = extractPlaylistId(link);
    
    if (!playlistId) {
      return NextResponse.json({success:false,message:"please provide valid playlist links"})
    }
      

    const videos = await fetchVideosFromPlaylist(playlistId);
    videoResults.push(...videos);
  }
const shuffledVideos = shuffleArray(videoResults);
  return NextResponse.json({ videos: shuffledVideos,success:true });
}

function extractPlaylistId(link: string): string | null {
  try {
    const url = new URL(link);
    const id = url.searchParams.get("list");
    return id;
    
  } catch (error) {
    return null
  }
}

// async function fetchVideosFromPlaylist(playlistId: string) {
//   const base = "https://www.googleapis.com/youtube/v3/playlistItems";
//   const params = new URLSearchParams({
//     part: "snippet",
//     playlistId,
//     maxResults: "50",
//     key: YOUTUBE_API_KEY!,
//   });

//   const res = await fetch(`${base}?${params}`);
//   const data = await res.json();

//   return data.items?.map((item: any) => ({
//     videoId: item.snippet.resourceId.videoId,
//     title: item.snippet.title,
//     thumbnail: item.snippet.thumbnails?.default?.url,
//     channel: item.snippet.videoOwnerChannelTitle,
//   })) ?? [];
// }

async function fetchVideosFromPlaylist(playlistId: string) {
  const base = "https://www.googleapis.com/youtube/v3/playlistItems";
  const allVideos: any[] = [];
  let nextPageToken: string | undefined = undefined;

  do {
    const params = new URLSearchParams({
      part: "snippet",
      playlistId,
      maxResults: "50",
      key: YOUTUBE_API_KEY!,
    });

    if (nextPageToken) {
      params.set("pageToken", nextPageToken);
    }

    const res = await fetch(`${base}?${params}`);
    const data = await res.json();

    if (data.error) {
      console.error("YouTube API Error:", data.error);
      break;
    }

    const items = data.items ?? [];
    const videos = items.map((item: any) => ({
      videoId: item.snippet?.resourceId?.videoId,
      title: item.snippet?.title,
      thumbnail: item.snippet?.thumbnails?.default?.url,
      channel: item.snippet?.videoOwnerChannelTitle,
    }));

    allVideos.push(...videos);
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return allVideos;
}


function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}