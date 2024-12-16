'use client';

import { useState, useRef, useEffect } from "react";
import YouTube from 'react-youtube';

const VideoPlayer = () => {
  const [urlVideo, setUrlVideo] = useState('https://www.youtube.com/watch?v=PLLRRXURicM');
  const [videoId, setVideoId] = useState(() => {
    const match = urlVideo.match(/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : '';
  });
  const [err, setErr] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    console.log(screenWidth)
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    
  }, [screenWidth]);

  const inputRef = useRef(null);

  const extractVideoId = (url:string) => {
    const match = url.match(/(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };

  const onPlayerReady = () => {
    console.log('Player is ready');
  };

  const onPlayerError = (event) => {
    console.error('Error:', event.data);
  };


  const opts = {
    height: screenWidth > 750 ? '400' : '350' ,
    width: screenWidth > 750 ? '700' : '300',
    playerVars: {
      autoplay: 0, 
    },
  };

  const setYoutubeVideoIdHandler = () => {
    const newUrl = inputRef.current.value;

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
      <div className="flex flex-col max-sm:pt-10  mb-5">

      <h1 className="mt-10 text-[40px] text-[#e93434]">Youtube Video player</h1>

        
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
        {err && <p className="text-red-500">Please enter url</p>}
      </div>

      <div className="mt-8">
      {videoId ? (
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onPlayerReady}
          onError={onPlayerError}
        />
      ) : (
        <p className="text-red-500 mt-4">Invalid YouTube URL</p>
      )}
      </div>

    </>
  );
};

export default VideoPlayer;