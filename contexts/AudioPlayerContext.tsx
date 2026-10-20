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

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

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
  const volumeRef = useRef(0.75);
  const playNextRef = useRef<() => void>(() => {});
  const wantsToPlayRef = useRef(false);
  const pauseIsIntentionalRef = useRef(false);
  const playRequestIdRef = useRef(0);
  const resumeTimerRef = useRef<number | null>(null);
  const errorRetriesRef = useRef(0);

  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [isActive, setIsActive] = useState(false);
  const [category, setCategory] = useState<PlaylistCategory | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<YogaTrack | null>(null);
  const [volume, setVolumeState] = useState(0.75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loopPlaylist, setLoopPlaylistState] = useState(true);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const requestPlay = useCallback(
    (audio: HTMLAudioElement) => {
      const requestId = ++playRequestIdRef.current;
      wantsToPlayRef.current = true;
      pauseIsIntentionalRef.current = false;

      return audio
        .play()
        .then(() => {
          if (requestId !== playRequestIdRef.current) return;
          errorRetriesRef.current = 0;
          setStatus("playing");
          setIsActive(true);
        })
        .catch((error: unknown) => {
          if (requestId !== playRequestIdRef.current) return;
          // Changement de piste / play() concurrent : ne pas afficher Pause.
          if (isAbortError(error)) return;
          setStatus("paused");
          setIsActive(true);
        });
    },
    [],
  );

  const loadTrack = useCallback(
    (track: YogaTrack, shouldPlay: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;

      playRequestIdRef.current += 1;
      clearResumeTimer();
      setCurrentTrack(track);
      audio.src = track.src;
      audio.volume = volumeRef.current;
      setCurrentTime(0);
      setDuration(track.durationSeconds);

      if (shouldPlay) {
        setIsActive(true);
        void requestPlay(audio);
      }
    },
    [clearResumeTimer, requestPlay],
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
        wantsToPlayRef.current = false;
        pauseIsIntentionalRef.current = true;
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

    if (!audio.paused) {
      pauseIsIntentionalRef.current = true;
      wantsToPlayRef.current = false;
      clearResumeTimer();
      audio.pause();
      setStatus("paused");
      return;
    }

    void requestPlay(audio);
  }, [clearResumeTimer, currentTrack, requestPlay]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    pauseIsIntentionalRef.current = true;
    wantsToPlayRef.current = false;
    playRequestIdRef.current += 1;
    clearResumeTimer();
    audio.pause();
    audio.currentTime = 0;
    setStatus("idle");
    setIsActive(false);
    setCurrentTime(0);
  }, [clearResumeTimer]);

  const setVolume = useCallback((value: number) => {
    const clamped = Math.min(Math.max(value, 0), 1);
    volumeRef.current = clamped;
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

  playNextRef.current = playNext;

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.setAttribute("playsinline", "true");
    audioRef.current = audio;
    audio.volume = volumeRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => playNextRef.current();
    const onPlay = () => {
      errorRetriesRef.current = 0;
      setStatus("playing");
      setIsActive(true);
    };
    const onPause = () => {
      if (audio.ended) return;
      if (pauseIsIntentionalRef.current || !wantsToPlayRef.current) return;

      clearResumeTimer();
      resumeTimerRef.current = window.setTimeout(() => {
        resumeTimerRef.current = null;
        if (!wantsToPlayRef.current || audio.paused === false || audio.ended) {
          return;
        }
        void requestPlay(audio);
      }, 300);
    };
    const onError = () => {
      if (!wantsToPlayRef.current) return;
      if (errorRetriesRef.current >= 2) {
        setStatus("paused");
        return;
      }
      errorRetriesRef.current += 1;
      const time = audio.currentTime;
      const src = audio.currentSrc || audio.src;
      if (!src) {
        setStatus("paused");
        return;
      }
      const restore = () => {
        audio.removeEventListener("loadedmetadata", restore);
        if (time > 0 && Number.isFinite(time)) {
          try {
            audio.currentTime = time;
          } catch {
            // ignore
          }
        }
        void requestPlay(audio);
      };
      audio.addEventListener("loadedmetadata", restore);
      audio.src = src;
      audio.load();
    };
    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      if (!wantsToPlayRef.current || !audio.paused || audio.ended) return;
      void requestPlay(audio);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearResumeTimer();
      pauseIsIntentionalRef.current = true;
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibility);
      audioRef.current = null;
    };
  }, [clearResumeTimer, requestPlay]);

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
