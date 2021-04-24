import Image from 'next/image';
import Head  from 'next/head';
import { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './style.module.scss';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import convertDurationToTimeString from '../Utils/convertDurationToTimeString';

export default function Player(){

    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying,
        isLooping,
        isShuffling, 
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        clearPlayerState,
        hasNext,
        hasPrevious, 
    } = usePlayer();


    useEffect(() => {
        if(!audioRef.current){
            return;
        }
        if(isPlaying){
            audioRef.current.play();
        }else{
            audioRef.current.pause();
        }
    },[isPlaying]);

    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', event => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext();
        }else{
            clearPlayerState();
        }
    }

    const episode = episodeList[currentEpisodeIndex];

    return (
        <div className={styles.playerContainer}>
            <Head>
                <title>Home | Podcastr</title>
            </Head>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <div style={{display: 'flex' ,flexDirection: 'column'}}>
                    <strong>Tocando agora</strong>
                </div>
            </header>
            { episode ? (
                <div className={styles.currentEpisode} >
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
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            ) }

            <footer className={!episode ? styles.empty : ''} >
                <div className={styles.progress} >
                    <span> { convertDurationToTimeString(progress) } </span>
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek} 
                                trackStyle={{ backgroundColor: '#04D361' }}
                                railStyle={{ backgroundColor:'9F75ff' }}
                                handleStyle={{ borderColor: '9F75FF', borderWidth: 4     }}
                            />
                        ) : (
                            <div className={styles.emptySlider}></div>
                        ) }
                    </div>
                    <span>{ convertDurationToTimeString(episode?.duration ?? 0) }</span>
                </div>

                { episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef}
                        loop={isLooping}
                        autoPlay
                        onEnded={handleEpisodeEnded}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={() => setupProgressListener()} 
                    />
                ) }

                <div className={styles.buttons}>
                    <button 
                        type="button" 
                        disabled={!episode || episodeList.length === 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar agora"/>
                    </button>
                    <button 
                        type="button" 
                        className={styles.playButton} 
                        disabled={!episode}
                        onClick={() => togglePlay()}
                    >
                        {
                            isPlaying
                            ? <img src="/pause.svg" alt="Tocar"/>
                            : <img src="/play.svg" alt="Tocar"/>
                        }
                    </button>
                    <button type="button" disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima" onClick={playNext} />
                    </button>
                    <button 
                        type="button" 
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
};