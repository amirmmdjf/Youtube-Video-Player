declare namespace YT {
    interface Player {
      playVideo(): void;
      pauseVideo(): void;
      stopVideo(): void;
      getPlayerState(): number;
      // Add more methods from YouTube API if needed
    }
  
    interface PlayerEvent {
      target: Player;
    }
  }