'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Chocolate {
	id: number;
	type: string;
	x: number;
	y: number;
	speed: number;
}

const CHOCOLATE_TYPES = [
	{ name: 'coconut', image: '/minigame/mini_game_chocs_coconut.png' },
	{ name: 'cookie', image: '/minigame/mini_game_chocs_cookie.png' },
	{ name: 'pistachio', image: '/minigame/mini_game_chocs_pistachio.png' },
	{ name: 'red_velvet', image: '/minigame/mini_game_chocs_red_velvet.png' },
	{ name: 'strawberry', image: '/minigame/mini_game_chocs_stawberry.png' },
];

interface ChocolateCatchGameProps {
	progress: number; // 0-100, used to increase difficulty
}

export default function ChocolateCatchGame({ progress }: ChocolateCatchGameProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [score, setScore] = useState(0);
	const [targetChocolate, setTargetChocolate] = useState(CHOCOLATE_TYPES[0]);
	const [basketX, setBasketX] = useState(150);
	const [gameStarted, setGameStarted] = useState(false);
	const [canvasDimensions, setCanvasDimensions] = useState({ width: 300, height: 350 });
	const [showInstructions, setShowInstructions] = useState(true);
	const [instructionsFading, setInstructionsFading] = useState(false);

	const chocolatesRef = useRef<Chocolate[]>([]);
	const basketXRef = useRef(150);
	const scoreRef = useRef(0);
	const targetChocolateRef = useRef(CHOCOLATE_TYPES[0]);
	const lastTargetChangeRef = useRef(Date.now());
	const animationFrameRef = useRef<number | undefined>(undefined);
	const chocolateIdCounter = useRef(0);
	const imagesLoadedRef = useRef<Record<string, HTMLImageElement>>({});
	const basketImageRef = useRef<HTMLImageElement | undefined>(undefined);
	const lastSpawnTimeRef = useRef(0);
	const keysPressed = useRef<Set<string>>(new Set());

	// Canvas dimensions - will be updated dynamically
	const CANVAS_WIDTH = canvasDimensions.width;
	const CANVAS_HEIGHT = canvasDimensions.height;
	const BASKET_WIDTH = Math.floor(canvasDimensions.width * 0.23); // Proportional to canvas width
	const BASKET_HEIGHT = Math.floor(BASKET_WIDTH * 0.5);
	// Chocolate actual size from image: 34px width × 107px height
	const CHOCOLATE_WIDTH = 34;
	const CHOCOLATE_HEIGHT = 107;

	// Load images
	useEffect(() => {
		const basketImg = new Image();
		basketImg.src = '/minigame/basket.png';
		basketImageRef.current = basketImg;

		CHOCOLATE_TYPES.forEach((choc) => {
			const img = new Image();
			img.src = choc.image;
			imagesLoadedRef.current[choc.name] = img;
		});
	}, []);

	// Update canvas dimensions based on container width
	useEffect(() => {
		const updateCanvasSize = () => {
			if (containerRef.current) {
				const containerWidth = containerRef.current.offsetWidth;
				const containerHeight = containerRef.current.offsetHeight;
				// Use full width minus small margins
				const width = Math.floor(containerWidth - 40);
				// Use most of available height, leaving room for header and footer
				const height = Math.floor(Math.min(containerHeight - 100, width * 1.2));
				setCanvasDimensions({ width, height });
				// Center basket
				setBasketX(width / 2 - (width * 0.23) / 2);
			}
		};

		updateCanvasSize();
		window.addEventListener('resize', updateCanvasSize);

		return () => {
			window.removeEventListener('resize', updateCanvasSize);
		};
	}, []);

	// Instructions splash timer
	useEffect(() => {
		const fadeTimer = setTimeout(() => setInstructionsFading(true), 3000);
		const hideTimer = setTimeout(() => setShowInstructions(false), 3800);
		return () => {
			clearTimeout(fadeTimer);
			clearTimeout(hideTimer);
		};
	}, []);

	// Update refs when state changes
	useEffect(() => {
		basketXRef.current = basketX;
	}, [basketX]);

	useEffect(() => {
		scoreRef.current = score;
	}, [score]);

	useEffect(() => {
		targetChocolateRef.current = targetChocolate;
	}, [targetChocolate]);

	// Keyboard controls
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd') {
				e.preventDefault();
				keysPressed.current.add(e.key.toLowerCase());
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			keysPressed.current.delete(e.key.toLowerCase());
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	// Touch/Mouse controls
	const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const normalizedX = (x / rect.width) * CANVAS_WIDTH;

		setBasketX(Math.max(0, Math.min(CANVAS_WIDTH - BASKET_WIDTH, normalizedX - BASKET_WIDTH / 2)));
	}, [CANVAS_WIDTH, BASKET_WIDTH]);

	// Main game loop
	useEffect(() => {
		if (!gameStarted) {
			setGameStarted(true);
		}

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let running = true;

		const gameLoop = () => {
			if (!running) return;

			// Clear canvas
			ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

			// Calculate base speed based on progress (1-3x speed multiplier)
			const speedMultiplier = 1 + (progress / 100) * 2;
			const baseSpeed = (CANVAS_HEIGHT / 200) * speedMultiplier; // Scale speed to canvas height

			// Update basket position based on keyboard input
			const moveSpeed = Math.floor(CANVAS_WIDTH / 60); // Scale move speed to canvas width
			if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) {
				setBasketX((prev) => Math.max(0, prev - moveSpeed));
			}
			if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) {
				setBasketX((prev) => Math.min(CANVAS_WIDTH - BASKET_WIDTH, prev + moveSpeed));
			}

			// Spawn new chocolate
			const now = Date.now();
			const spawnInterval = Math.max(800, 1500 - (progress * 8)); // Faster spawning as progress increases

			if (now - lastSpawnTimeRef.current > spawnInterval) {
				const randomType = CHOCOLATE_TYPES[Math.floor(Math.random() * CHOCOLATE_TYPES.length)];
				const newChocolate: Chocolate = {
					id: chocolateIdCounter.current++,
					type: randomType.name,
					x: Math.random() * (CANVAS_WIDTH - CHOCOLATE_WIDTH),
					y: -CHOCOLATE_HEIGHT,
					speed: baseSpeed + Math.random() * 0.5,
				};
				chocolatesRef.current.push(newChocolate);
				lastSpawnTimeRef.current = now;
			}

			// Update and draw chocolates
			const basketY = CANVAS_HEIGHT - BASKET_HEIGHT - Math.floor(CANVAS_HEIGHT * 0.03); // Small proportional gap from bottom

			chocolatesRef.current = chocolatesRef.current.filter((choc) => {
				choc.y += choc.speed;

				// Check collision with basket
				if (
					choc.y + CHOCOLATE_HEIGHT >= basketY &&
					choc.y <= basketY + BASKET_HEIGHT &&
					choc.x + CHOCOLATE_WIDTH >= basketXRef.current &&
					choc.x <= basketXRef.current + BASKET_WIDTH
				) {
					// Caught!
					if (choc.type === targetChocolateRef.current.name) {
						setScore((s) => s + 10);
					} else {
						setScore((s) => Math.max(0, s - 5));
					}
					return false; // Remove chocolate
				}

				// Remove if off screen
				if (choc.y > CANVAS_HEIGHT) {
					return false;
				}

				// Draw chocolate
				const img = imagesLoadedRef.current[choc.type];
				if (img && img.complete) {
					ctx.drawImage(img, choc.x, choc.y, CHOCOLATE_WIDTH, CHOCOLATE_HEIGHT);
				} else {
					// Fallback rectangle
					ctx.fillStyle = '#8B4513';
					ctx.fillRect(choc.x, choc.y, CHOCOLATE_WIDTH, CHOCOLATE_HEIGHT);
				}

				return true;
			});

			// Draw basket
			if (basketImageRef.current && basketImageRef.current.complete) {
				ctx.drawImage(
					basketImageRef.current,
					basketXRef.current,
					basketY,
					BASKET_WIDTH,
					BASKET_HEIGHT
				);
			} else {
				// Fallback basket
				ctx.fillStyle = '#D2691E';
				ctx.fillRect(basketXRef.current, basketY, BASKET_WIDTH, BASKET_HEIGHT);
			}

			// Change target chocolate every 30 seconds
			if (now - lastTargetChangeRef.current > 30000) {
				const newTarget = CHOCOLATE_TYPES[Math.floor(Math.random() * CHOCOLATE_TYPES.length)];
				setTargetChocolate(newTarget);
				lastTargetChangeRef.current = now;
			}

			animationFrameRef.current = requestAnimationFrame(gameLoop);
		};

		gameLoop();

		return () => {
			running = false;
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [progress, gameStarted, CANVAS_WIDTH, CANVAS_HEIGHT, CHOCOLATE_WIDTH, CHOCOLATE_HEIGHT, BASKET_WIDTH, BASKET_HEIGHT]);

	return (
		<div ref={containerRef} className="relative w-full h-full flex flex-col">
			{/* Top bar - Target chocolate and score */}
			<div className="flex justify-between items-start mb-2 px-4">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2 bg-black/40 rounded-lg px-3 py-1.5">
						<span className="text-yellow-400 text-xs font-bold">SCORE:</span>
						<span className="text-white text-sm font-black">{score}</span>
					</div>
				</div>

				<div className="flex flex-col items-end gap-1">
					<div className="flex items-center gap-2 bg-black/40 rounded-lg px-3 py-1.5 border-2 border-yellow-500/50">
						<span className="text-yellow-400 text-xs font-bold">CATCH:</span>
						<div
							className="bg-white/10 rounded border border-white/20 flex items-center justify-center p-1"
							style={{ width: `${CHOCOLATE_WIDTH}px`, height: `${CHOCOLATE_HEIGHT}px` }}
						>
							{targetChocolate && (
								<img
									src={targetChocolate.image}
									alt={targetChocolate.name}
									className="object-contain"
									style={{ width: '100%', height: '100%' }}
								/>
							)}
						</div>
					</div>
					<p className="text-white/70 text-[10px] font-semibold leading-tight text-right px-1">
						Catch only the matching<br />chocolate shown above ↑
					</p>
				</div>
			</div>

			{/* Game canvas */}
			<div className="relative flex justify-center">
				<canvas
					ref={canvasRef}
					width={CANVAS_WIDTH}
					height={CANVAS_HEIGHT}
					onPointerMove={handlePointerMove}
					className="border-2 border-white/20 rounded-xl bg-gradient-to-b from-purple-900/40 to-blue-900/40 cursor-none touch-none"
				/>

				{/* Controls hint */}
				<div className="absolute bottom-2 left-0 right-0 text-center">
					<p className="text-white/40 text-[10px] font-bold tracking-wider uppercase">
						← → or Touch to Move
					</p>
				</div>

				{/* Instructions splash overlay */}
				{showInstructions && (
					<div
						className="absolute inset-0 flex flex-col items-center justify-center rounded-xl pointer-events-none"
						style={{
							background: 'rgba(0,0,0,0.72)',
							transition: 'opacity 0.8s ease',
							opacity: instructionsFading ? 0 : 1,
						}}
					>
						<p className="text-yellow-400 text-3xl font-black tracking-wide drop-shadow-lg text-center px-4 leading-tight">
							🍫 CATCH THE<br />CHOCOLATE!
						</p>
						<p className="text-white text-base font-bold text-center mt-3 px-6 leading-snug">
							Move your basket to catch<br />only the matching chocolate<br />shown in the top right
						</p>
						<p className="text-white/60 text-sm font-semibold mt-3">
							← → keys or touch to move
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
