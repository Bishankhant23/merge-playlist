"use server";

import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const playlistLinks = formData.getAll("playlistlink[]") as string[];

  const videoResults: any[] = [];

  for (const link of playlistLinks) {
    const playlistId = extractPlaylistId(link);

    // Check if playlist ID is valid
    if (!playlistId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid playlist link.",
        },
        { status: 400 }
      );
    }

    if (!isUserCreatedPlaylist(playlistId)) {
      return NextResponse.json(
        {
          success: false,
          statusCode:422,
          message: `Only user-created playlists are allowed. Playlist ID "${playlistId}" appears to be system-generated.`,
        },
        { status: 422 }
      );
    }

    const videos = await fetchVideosFromPlaylist(playlistId);
    videoResults.push(...videos);
  }

  const shuffledVideos = shuffleArray(videoResults);

  return NextResponse.json({ videos: shuffledVideos, success: true });
}

// Extract playlist ID from URL
function extractPlaylistId(link: string): string | null {
  try {
    const url = new URL(link);
    return url.searchParams.get("list");
  } catch (error) {
    return null;
  }
}

// Check if playlist ID is user-created
function isUserCreatedPlaylist(playlistId: string): boolean {
  // Common prefixes for user-created playlists
  const validPrefixes = ["PL", "UU", "FL"];
  return validPrefixes.some((prefix) => playlistId.startsWith(prefix));
}

// Fetch all videos from a playlist (paginated)
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

// Shuffle an array (Fisher–Yates)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
