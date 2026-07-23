import React from "react";

const COLORS = ["#1a8917", "#ffb300", "#e53935", "#1e88e5", "#8e24aa"];
const PARTICLE_COUNT = 150;
const DURATION_MS = 5000;

type Particle = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	rotation: number;
	rotationSpeed: number;
	size: number;
	color: string;
};

export default function Confetti() {
	const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

	React.useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || typeof window === "undefined") return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const width = window.innerWidth;
		const height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;

		const particles: Particle[] = Array.from(
			{ length: PARTICLE_COUNT },
			() => ({
				x: Math.random() * width,
				y: -20 - Math.random() * height * 0.5,
				vx: (Math.random() - 0.5) * 4,
				vy: 2 + Math.random() * 3,
				rotation: Math.random() * 360,
				rotationSpeed: (Math.random() - 0.5) * 10,
				size: 6 + Math.random() * 6,
				color: COLORS[Math.floor(Math.random() * COLORS.length)],
			}),
		);

		let animationFrame: number;
		const start = window.performance.now();

		function draw(now: number) {
			const elapsed = now - start;
			ctx!.clearRect(0, 0, width, height);
			if (elapsed >= DURATION_MS) return;
			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				p.rotation += p.rotationSpeed;
				ctx!.save();
				ctx!.translate(p.x, p.y);
				ctx!.rotate((p.rotation * Math.PI) / 180);
				ctx!.fillStyle = p.color;
				ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
				ctx!.restore();
			}
			animationFrame = window.requestAnimationFrame(draw);
		}
		animationFrame = window.requestAnimationFrame(draw);

		return () => window.cancelAnimationFrame(animationFrame);
	}, []);

	return (
		<canvas
			ref={canvasRef}
			data-testid="confetti"
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				pointerEvents: "none",
				zIndex: 1000,
			}}
		/>
	);
}
