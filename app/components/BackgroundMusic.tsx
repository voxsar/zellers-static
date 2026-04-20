"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

export interface BackgroundMusicHandle {
	fadeOut: () => void;
	play: () => void;
	pause: () => void;
}

interface BackgroundMusicProps {
	src: string;
	loop?: boolean;
	volume?: number;
	autoPlay?: boolean;
}

const BackgroundMusic = forwardRef<BackgroundMusicHandle, BackgroundMusicProps>(
	({ src, loop = true, volume = 0.3, autoPlay = true }, ref) => {
		const audioRef = useRef<HTMLAudioElement>(null);
		const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

		useImperativeHandle(ref, () => ({
			fadeOut: () => {
				if (!audioRef.current) return;

				// Clear any existing fade interval
				if (fadeIntervalRef.current) {
					clearInterval(fadeIntervalRef.current);
				}

				const audio = audioRef.current;
				const fadeStep = 0.02; // Volume decrease per step
				const fadeInterval = 50; // ms between steps
				const targetVolume = 0;

				fadeIntervalRef.current = setInterval(() => {
					if (audio.volume > targetVolume + fadeStep) {
						audio.volume = Math.max(0, audio.volume - fadeStep);
					} else {
						audio.volume = 0;
						audio.pause();
						if (fadeIntervalRef.current) {
							clearInterval(fadeIntervalRef.current);
							fadeIntervalRef.current = null;
						}
					}
				}, fadeInterval);
			},
			play: () => {
				audioRef.current?.play().catch(err => {
					console.log('Audio play failed:', err);
				});
			},
			pause: () => {
				audioRef.current?.pause();
			}
		}));

		useEffect(() => {
			const audio = audioRef.current;
			if (!audio) return;

			audio.volume = volume;

			if (autoPlay) {
				// Try to play, but handle autoplay restrictions
				const playPromise = audio.play();
				if (playPromise !== undefined) {
					playPromise.catch(err => {
						console.log('Autoplay prevented, waiting for user interaction:', err);
						// Listen for any user interaction to start playing
						const tryPlay = () => {
							audio.play().catch(e => console.log('Play failed:', e));
							document.removeEventListener('click', tryPlay);
							document.removeEventListener('touchstart', tryPlay);
						};
						document.addEventListener('click', tryPlay, { once: true });
						document.addEventListener('touchstart', tryPlay, { once: true });
					});
				}
			}

			return () => {
				if (fadeIntervalRef.current) {
					clearInterval(fadeIntervalRef.current);
				}
				audio.pause();
			};
		}, [autoPlay, volume]);

		return (
			<audio
				ref={audioRef}
				src={src}
				loop={loop}
				preload="auto"
				style={{ display: 'none' }}
			/>
		);
	}
);

BackgroundMusic.displayName = 'BackgroundMusic';

export default BackgroundMusic;
