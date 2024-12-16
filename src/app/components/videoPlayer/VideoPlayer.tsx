'use client';

import { useState, useRef, useEffect, RefObject } from "react";
import YouTube, { YouTubeProps } from 'react-youtube';

const VideoPlayer: React.FC = () => {
  const [urlVideo, setUrlVideo] = useState<string>('https://www.youtube.com/watch?v=PLLRRXURicM');
  const [videoId, setVideoId] = useState<string>(() => {
    const match = urlVideo.match(/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : '';
  });
  const [err, setErr] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number | null>(null); // Initialize as null

  const inputRef: RefObject<HTMLInputElement | null> = useRef(null);

  // Ensure screenWidth is updated only on the client
  useEffect(() => {
    const updateScreenWidth = (): void => setScreenWidth(window.innerWidth);

    // Set initial width after mount
    updateScreenWidth();

    window.addEventListener('resize', updateScreenWidth);

    return () => {
      window.removeEventListener('resize', updateScreenWidth);
    };
  }, []);

  const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };

  const onPlayerReady = (event: { target: YT.Player }): void => {
    console.log('Player is ready', event.target);
  };

  const onPlayerError = (event: { data: number }): void => {
    console.error('Error:', event.data);
  };

  const opts: YouTubeProps['opts'] = {
    height: screenWidth && screenWidth > 750 ? '400' : '350',
    width: screenWidth && screenWidth > 750 ? '700' : '300',
    playerVars: {
      autoplay: 0,
    },
  };

  const setYoutubeVideoIdHandler = (): void => {
    const newUrl = inputRef.current?.value || '';

    if (newUrl.trim().length === 0) {
      setErr(true);
    } else {
      setErr(false);
    }

    const newVideoId = extractVideoId(newUrl);
    if (newVideoId) {
      setUrlVideo(newUrl);
      setVideoId(newVideoId);
      console.log('New video ID:', newVideoId);
    } else {
      console.error('Invalid YouTube URL:', newUrl);
    }
  };

  return (
    <>
      <div className="flex flex-col max-sm:pt-10 mb-5">
        <h1 className="mt-10 text-[40px] text-[#e93434]">YouTube Video Player</h1>
        <div className="flex justify-center mt-10">
          <input
            className="border-b py-1 px-2 outline-none w-full"
            type="text"
            ref={inputRef}
            placeholder="Enter YouTube video URL"
          />
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded ml-4"
            onClick={setYoutubeVideoIdHandler}
          >
            Add
          </button>
        </div>
        {err && <p className="text-red-500">Please enter a valid URL</p>}
      </div>

      <div className="mt-8">
        {videoId ? (
          screenWidth && (
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={onPlayerReady}
              onError={onPlayerError}
            />
          )
        ) : (
          <p className="text-red-500 mt-4">Invalid YouTube URL</p>
        )}
      </div>
    </>
  );
};

export default VideoPlayer;
