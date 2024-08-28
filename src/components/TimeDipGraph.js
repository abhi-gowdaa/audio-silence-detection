import React, { useEffect, useRef, useState } from 'react';

const TimeDipGraph = ({ timeRanges, totalTime }) => {
    const canvasRef = useRef(null);
    const [transitionToGraph, setTransitionToGraph] = useState(false);
    const animationProgress = useRef(0);
    const animationSpeed = 0.01;
    const wave = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width = 1500;
        const height = canvas.height = 200;
        const barHeight = 50;
        const padding = 20;

        const normalColor = '#4A4A4A';
        const dipColor = '#1d1d';
        const textColor = '#FFFFFF';
        const shadowColor = '#1d1d';

        const lineCount = 40;
        const offset = Math.PI * 3.5;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        class Line {
            constructor(pos) {
                this.pos = pos;
                this.width = halfWidth;
                this.height = 4;
                this.range = halfHeight * 0.9;
            }

            render(ctx, delta) {
                const pos = this.pos;
                const minWidth = (this.width * 0.25);
                const lineWidth = minWidth + (this.width * 0.75 * pos);
                const lineHeight = Math.cos(delta + (pos * offset)) * this.height;
                const x = (width - minWidth) * (1 - pos);
                const y = (Math.sin(delta + (pos * offset)) * (this.range / 2 + this.range / 2 * (pos))) + halfHeight;

                ctx.globalAlpha = 0.5 + (0.5 * (1 - pos));
                ctx.fillStyle = shadowColor;
                ctx.beginPath();
                ctx.rect(x, y, lineWidth, lineHeight);
                ctx.closePath();
                ctx.fill();
            }
        }

        const lines = [];
        for (let i = 0; i < lineCount; i++) {
            lines.push(new Line(i / lineCount));
        }

        const drawWave = (delta) => {
            lines.forEach((line) => { line.render(ctx, delta); });
        };

        const drawGraph = () => {
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = normalColor;
            ctx.fillRect(padding, (height - barHeight) / 2, width - 2 * padding, barHeight);

            ctx.fillStyle = dipColor;
            timeRanges.forEach((range) => {
                const startX = padding + (range[0] / totalTime) * (width - 2 * padding);
                const endX = padding + (Math.min(range[1], range[0] + animationProgress.current * (range[1] - range[0])) / totalTime) * (width - 2 * padding);
                ctx.fillRect(startX, (height - barHeight) / 2, endX - startX, barHeight);
            });

            ctx.fillStyle = textColor;
            ctx.textAlign = 'center';
            for (let i = 0; i <= totalTime; i += 5) {
                const x = padding + (i / totalTime) * (width - 2 * padding);
                ctx.fillText(i + "s", x, (height + barHeight) / 2 + 15);
            }

 
             };

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            if (!transitionToGraph) {
                wave.current += 0.02;
                drawWave(wave.current);
            } else {
                animationProgress.current += animationSpeed;
                drawGraph();
            }
            requestAnimationFrame(render);
        };

        render();
    }, [timeRanges, totalTime, transitionToGraph]);

    useEffect(() => {
        if (totalTime > 0) {
            setTransitionToGraph(true);
        } else {
            setTransitionToGraph(false);
        }
    }, [totalTime]);

    return (
        <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
    );
};

export default TimeDipGraph;
