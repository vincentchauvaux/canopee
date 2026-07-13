"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getCategoryTracks,
  getTrackById,
  type PlaylistCategory,
  type YogaTrack,
} from "@/lib/yoga-playlist";

type PlayerStatus = "idle" | "playing" | "paused";

interface AudioPlayerContextValue {
  status: PlayerStatus;
  isActive: boolean;
  category: PlaylistCategory | null;
  trackIndex: number;
  currentTrack: YogaTrack | null;
  volume: number;
  currentTime: number;
  duration: number;
  loopPlaylist: boolean;
  playCategory: (category: PlaylistCategory, startIndex?: number) => void;
  playTrack: (trackId: string) => void;
  togglePlay: () => void;
  stop: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (value: number) => void;
  setLoopPlaylist: (value: boolean) => void;
  seekTo: (time: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return context;
}

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const categoryRef = useRef<PlaylistCategory | null>(null);
  const trackIndexRef = useRef(0);
  const tracksRef = useRef<YogaTrack[]>([]);

  const loopPlaylistRef = useRef(true);

  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [isActive, setIsActive] = useState(false);
  const [category, setCategory] = useState<PlaylistCategory | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<YogaTrack | null>(null);
  const [volume, setVolumeState] = useState(0.75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loopPlaylist, setLoopPlaylistState] = useState(true);

  const loadTrack = useCallback(
    (track: YogaTrack, shouldPlay: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;

      setCurrentTrack(track);
      audio.src = track.src;
      audio.volume = volume;
      setCurrentTime(0);
      setDuration(track.durationSeconds);

      if (shouldPlay) {
        void audio.play().then(() => {
          setStatus("playing");
          setIsActive(true);
        }).catch(() => {
          setStatus("paused");
          setIsActive(true);
        });
      }
    },
    [volume],
  );

  const playCategory = useCallback(
    (nextCategory: PlaylistCategory, startIndex = 0) => {
      const tracks = getCategoryTracks(nextCategory);
      if (tracks.length === 0) return;

      categoryRef.current = nextCategory;
      tracksRef.current = tracks;
      trackIndexRef.current = startIndex;
      setCategory(nextCategory);
      setTrackIndex(startIndex);
      loadTrack(tracks[startIndex], true);
    },
    [loadTrack],
  );

  const playTrack = useCallback(
    (trackId: string) => {
      const track = getTrackById(trackId);
      if (!track) return;

      const tracks = getCategoryTracks(track.category);
      const index = tracks.findIndex((item) => item.id === trackId);

      categoryRef.current = track.category;
      tracksRef.current = tracks;
      trackIndexRef.current = index >= 0 ? index : 0;
      setCategory(track.category);
      setTrackIndex(index >= 0 ? index : 0);
      loadTrack(track, true);
    },
    [loadTrack],
  );

  const playNext = useCallback(() => {
    const tracks = tracksRef.current;
    if (tracks.length === 0) return;

    let nextIndex = trackIndexRef.current + 1;
    if (nextIndex >= tracks.length) {
      if (!loopPlaylistRef.current) {
        setStatus("idle");
        setIsActive(false);
        return;
      }
      nextIndex = 0;
    }

    trackIndexRef.current = nextIndex;
    setTrackIndex(nextIndex);
    loadTrack(tracks[nextIndex], true);
  }, [loadTrack]);

  const playPrevious = useCallback(() => {
    const audio = audioRef.current;
    const tracks = tracksRef.current;
    if (tracks.length === 0) return;

    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    let prevIndex = trackIndexRef.current - 1;
    if (prevIndex < 0) {
      prevIndex = tracks.length - 1;
    }

    trackIndexRef.current = prevIndex;
    setTrackIndex(prevIndex);
    loadTrack(tracks[prevIndex], true);
  }, [loadTrack]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (status === "playing") {
      audio.pause();
      setStatus("paused");
      return;
    }

    void audio.play().then(() => setStatus("playing"));
  }, [currentTrack, status]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setStatus("idle");
    setIsActive(false);
    setCurrentTime(0);
  }, []);

  const setVolume = useCallback((value: number) => {
    const clamped = Math.min(Math.max(value, 0), 1);
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const setLoopPlaylist = useCallback((value: boolean) => {
    loopPlaylistRef.current = value;
    setLoopPlaylistState(value);
  }, []);

  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const max =
      Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : duration;
    const clamped = Math.min(Math.max(time, 0), max);
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  }, [duration]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => playNext();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [playNext, volume]);

  useEffect(() => {
    document.body.classList.toggle("audio-bar-active", isActive);
    return () => document.body.classList.remove("audio-bar-active");
  }, [isActive]);

  const value = useMemo<AudioPlayerContextValue>(
    () => ({
      status,
      isActive,
      category,
      trackIndex,
      currentTrack,
      volume,
      currentTime,
      duration,
      loopPlaylist,
      playCategory,
      playTrack,
      togglePlay,
      stop,
      nextTrack: playNext,
      previousTrack: playPrevious,
      setVolume,
      setLoopPlaylist,
      seekTo,
    }),
    [
      status,
      isActive,
      category,
      trackIndex,
      currentTrack,
      volume,
      currentTime,
      duration,
      loopPlaylist,
      playCategory,
      playTrack,
      togglePlay,
      stop,
      playNext,
      playPrevious,
      setVolume,
      setLoopPlaylist,
      seekTo,
    ],
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}
