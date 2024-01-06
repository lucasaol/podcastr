import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    hasPrevious: boolean;
    hasNext: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setPlayingState: (state: boolean) => void;
    clearPlayerState: () => void;
};

type PlayerContextProviderProps = {
    children: ReactNode;
};

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setisLooping] = useState(false);
    const [isShuffling, setisShuffling] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleLoop() {
        setisLooping(!isLooping);
    }

    function toggleShuffle() {
        setisShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }


    const hasPrevious = (currentEpisodeIndex > 0);
    function playPrevious() {
        if(isShuffling) {
            playRandom();
        } else if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    const hasNext = (isShuffling || currentEpisodeIndex + 1 < episodeList.length);
    function playNext() {
        if(isShuffling) {
            playRandom();
        } else if (hasNext) {
            const nextEpisodeIndex = currentEpisodeIndex + 1;
            setCurrentEpisodeIndex(nextEpisodeIndex);
        }
    }

    function playRandom() {
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
        setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    }

    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                isPlaying,
                hasPrevious,
                hasNext,
                isLooping,
                isShuffling,
                play,
                playList,
                playNext,
                playPrevious,
                togglePlay,
                toggleLoop,
                toggleShuffle,
                setPlayingState,
                clearPlayerState
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}