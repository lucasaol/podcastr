import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../../utils/convertDurationToTimeString';

export function Player() {

    const audioRef = useRef<HTMLAudioElement>(null);

    const [progress, setProgress] = useState(0);

    const { 
        episodeList,
        currentEpisodeIndex,
        isPlaying, 
        isLooping, 
        isShuffling,
        hasPrevious,
        hasNext,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        clearPlayerState
    } = usePlayer();

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }
        (isPlaying) ? audioRef.current.play() : audioRef.current.pause();
    }, [isPlaying]);


    function setupProgressListener() {
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            const time = Math.floor(audioRef.current.currentTime);
            setProgress(time);
        });
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if(hasNext) {
            playNext();
        } else {
            clearPlayerState();
        }
    }

    const episode = episodeList[currentEpisodeIndex];

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={styles.playingEpisode}>
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
                    <strong>Selectione um podcast para ouvir</strong>
                </div>
            ) }
            

            <footer className={ !episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>

                    {episode ? (
                        <Slider
                            max={episode.duration}
                            value={progress}
                            onChange={handleSeek}
                            trackStyle={{backgroundColor: '#04D361'}}
                            railStyle={{backgroundColor: '#9F75FF'}}
                            handleStyle={{borderColor: '#04D361', borderWidth: 4}}
                         />
                    ) : (
                        <div className={styles.slider}>
                            <div className={styles.emptySlider} />
                        </div>
                    )}
                    
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                { episode && (
                    <audio
                        autoPlay
                        loop={isLooping}
                        src={episode.url}
                        ref={audioRef}
                        onEnded={handleEpisodeEnded}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={() => setupProgressListener()}
                    />
                ) }

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode || episodeList.length === 1} onClick={() => toggleShuffle()} className={isShuffling ? styles.isActive : ''} >
                        <img src="/shuffle.svg" alt="Aleatório" />
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious} >
                        <img src="/play-previous.svg" alt="Anterior" />
                    </button>

                    <button
                     type="button" 
                     className={styles.playButton}
                     disabled={!episode}
                     onClick={togglePlay}
                     >
                        {isPlaying ? (
                            <img src= "/pause.svg" alt="Pause" className={styles.playButton} />
                        ) : (
                            <img src="/play.svg" alt="Play" className={styles.playButton} />
                        )}
                    </button>

                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Próxima" />
                    </button>
                    <button type="button" disabled={!episode} onClick={() => toggleLoop()} className={isLooping ? styles.isActive : ''} >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
}