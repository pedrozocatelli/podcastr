import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useContext } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'

import styles from './styles.module.scss';

const Player = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    togglePlay, 
    setPlayingState,
    hasPrevious,
    hasNext,
    playNext,
    playPrevious,
    isLooping,
    toggleLoop,
    isShuffling,
    toggleShuffle,
    clearPlayerState
  } = usePlayer()

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  const episode = episodeList[currentEpisodeIndex];

  return (
   <div className={styles.playerContainer}>
     <header>
       <img src="/playing.svg" alt="Playing now"/>
       <strong>Playing now</strong>
     </header>

    {episode ? (
      <div className={styles.currentEpisode}>
        <Image 
          width={592} 
          height={592}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <strong>{episode.title}</strong>
        <span>{episode.members}</span>
      </div> 
    ) : (
      <div className={styles.emptyPlayer}>
        <strong>Choose a podcast to listen</strong>
      </div>
    )}

     <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            { episode ? (
              <Slider 
                trackStyle={{backgroundColor: '#04d361'}}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.empty} />
            )}
          </div>
          <span>00:00</span>
        </div>

        { episode && (
          <audio
            src={episode.url}
            autoPlay
            ref={audioRef}
            loop={isLooping}
            // onLoadedMetadata={setupProgressListener}
            // onEnded={handleEpisodeEnded}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode} onClick={() => console.log('opa')}>
            <img src="/shuffle.svg" alt="Shuffle" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-previous.svg" alt="Play Previous" />
          </button>
          <button 
            type="button" 
            className={styles.playButton} 
            disabled={!episode}
            onClick={togglePlay}
          >
          { isPlaying ? (
              <img src="/pause.svg" alt="Pause"/>
            ): (
              <img src="/play.svg" alt="Play"/>
            )}
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-next.svg" alt="Play Next" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="repeat" />
          </button>
        </div>
      </footer>
   </div>
  );
};

export default Player;