
import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const audio = new Audio("/assets/our-song.mp3");
        audio.loop = true;
        audio.volume = 0.5;
        audioRef.current = audio;

        // Attempt autoplay when the website opens.
        audio.play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));

        // If autoplay is blocked, start music on the visitor's first interaction.
        const startMusic = () => {
            if (audio.paused) {
                audio.play()
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
            }
        };

        document.addEventListener("pointerdown", startMusic);

        return () => {
            document.removeEventListener("pointerdown", startMusic);
            audio.pause();
            audioRef.current = null;
        };
    }, []);

    const toggleMusic = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch {
                setIsPlaying(false);
            }
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    return (
        <button
            type="button"
            className="music-toggle"
            onClick={toggleMusic}
            aria-label={isPlaying ? "Turn music off" : "Turn music on"}
        >
            {isPlaying ? "♪ SOUND ON" : "♪ SOUND OFF"}
        </button>
    );
}
