import next from 'next';
import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Array<Episode>, index: number) => void;
    setPlayingState: (state: boolean) => void;
    playNext: () => void;
    playPrevious: () => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps){
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffing] = useState(false);

    function play(episode: Episode){
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Array<Episode>, index: number){
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay(){
        setIsPlaying(!isPlaying);
    }

    function toggleLoop(){
        setIsLooping(!isLooping);
    }

    function toggleShuffle(){
        setIsShuffing(!isShuffling);
    }

    function setPlayingState(state: boolean){
        setIsPlaying(state);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = (currentEpisodeIndex + 1) < episodeList.length;

    function playNext(){
        if(isShuffling){
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        }else if(hasNext){
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious(){
        if(hasPrevious){
            setCurrentEpisodeIndex(currentEpisodeIndex -1);
        }
    }

    return (
        <PlayerContext.Provider value={{ 
        episodeList, currentEpisodeIndex, 
        play, playList, hasNext, hasPrevious, 
        playNext, playPrevious, isPlaying, 
        isShuffling, togglePlay , setPlayingState, 
        isLooping, toggleLoop, toggleShuffle
        }}>
            { children }
        </PlayerContext.Provider>
    )
}


export const usePlayer = () => {
    return useContext(PlayerContext);
}