import { GlobalStoreContext } from '../store'
import React, { useContext, useRef, useState } from "react";
import YouTube from "react-youtube";

const YouTubePlayer = (props) => {
  const { store } = useContext(GlobalStoreContext);
  let playingList = store.getCurrentPlayingList();
  const [videoIndex, setVideoIndex] = useState(0);
  const playerRef = useRef(null);

  const playerOptions = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 0
    }
  };

  function onPlayerReady(event) {
    playerRef.current = event.target;
  }
  function previousSong(){
    if(videoIndex>0)
        setVideoIndex(videoIndex-1)
  }
  function nextSong(){
    if(videoIndex+1<playingList.songs.length)
        setVideoIndex(videoIndex+1);
  }
  // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
  // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
  // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
  // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
  function onPlayerStateChange(event) {
    let playerStatus = event.data;
    if (playerStatus === -1) {
      // VIDEO UNSTARTED
      console.log("-1 Video unstarted");}
    else if (playerStatus === 0) {
      // THE VIDEO HAS COMPLETED PLAYING
      console.log("0 Video ended");
    if(videoIndex+1<playingList.songs.length){
        setVideoIndex(videoIndex+1);
        playerRef.current.playVideo();
    }
      console.log(playingList.songs.length);
      console.log(videoIndex);
    }
    else if (playerStatus === 1) {
      // THE VIDEO IS PLAYED
      console.log("1 Video played");
    } else if (playerStatus === 2) {
      // THE VIDEO IS PAUSED
      console.log("2 Video paused");
    } else if (playerStatus === 3) {
      // THE VIDEO IS BUFFERING
      console.log("3 Video buffering");
    } else if (playerStatus === 5) {
      // THE VIDEO HAS BEEN CUED
      console.log("5 Video cued");
    }
  }

  return (
    <div>
      {playingList?<YouTube
        videoId={playingList.songs[videoIndex].youTubeId}
        opts={playerOptions}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
      />:""}
      <div>
      <button
          onClick={() =>  {
              previousSong();
          }}
        >
          Previous
        </button>
        <button
          onClick={() => {
            if (playerRef.current.getPlayerState() !== 1) {
              playerRef.current.mute();
              playerRef.current.playVideo();
              playerRef.current.unMute();
            }
          }}
        >
          Play
        </button>
        <button
          onClick={() => {
            if (playerRef.current.getPlayerState() !== 2) {
              playerRef.current.pauseVideo();
            }
          }}
        >
          Pause
        </button>
        <button
          onClick={() => {
              nextSong();
          } }
        >
          next
        </button>
      </div>
    </div>
  );
};

export default YouTubePlayer;
