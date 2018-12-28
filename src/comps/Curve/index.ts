import * as dat from "dat.gui";
import { TweenMax } from "gsap";
import { IWaveOptions } from "../../types";
import Mouse from "./Mouse";
import Point from "./Point";

export const defaultWave: IWaveOptions = {
    viscosity: 340,
    mouseDist: 200,
    damping: 0.1,
    amplitudeRange: 100,
    randomRange: 4,
    randomTransition: 5,
    amplitudeTransition: 1,
    speed: 0.02,
};

export const wave: IWaveOptions = {
    viscosity: 340,
    mouseDist: 200,
    damping: 0.1,
    amplitudeRange: 100,
    randomRange: 4,
    randomTransition: 5,
    amplitudeTransition: 1,
    speed: 0.02,
};

export default class Curve {
    public static gui = new dat.GUI();
    public static vTotalPoints = 15;
    public static vGap = window.innerHeight / (Curve.vTotalPoints - 1);
    public static mouseIsHoverButton = false;

    public static transformWave(options: IWaveOptions) {
<<<<<<< HEAD
        TweenMax.to(wave, 0.1, {
            ...options,
            overwrite: "all",
            // onComplete: () => {
            //     console.log("complete");
            // },
=======
        console.log("here i'm called");
        TweenMax.to(wave, 0.1, {
            ...options,
            overwrite: "all",
            onComplete: () => {
                console.log("complete");
            },
>>>>>>> 0a709f8bd1953d86b7acd641f94d26a1d13e723a
        });
    }

    private readonly ctx: CanvasRenderingContext2D;
    private vPoints: Point[] = [];

    private mainColor: string = "#000";
    private time: number = Date.now();
    private start: boolean = false;

    // private frameToUpdate: number = 300;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        document.addEventListener("mousemove", Mouse.handleMouseMove);
        document.addEventListener("click", () => {
            if (!this.start) {
                console.log("here I start");
                this.start = true;
            }
        });

        this.initVPoints();

        const controller = Curve.gui.add(Curve, "vTotalPoints", 0, 30);
        controller.onFinishChange((value) => {
            Curve.vTotalPoints = Math.floor(value);
            Curve.vGap = window.innerHeight / (Curve.vTotalPoints - 1);
            this.initVPoints();
        });
        Curve.gui.add(wave, "viscosity", 0, 500);
        Curve.gui.add(wave, "mouseDist", 0, 500);
        Curve.gui.add(wave, "damping", 0, 1);
        Curve.gui.add(wave, "amplitudeRange", 1, 201);
        Curve.gui.add(wave, "randomRange", 1, 101);
        Curve.gui.add(wave, "randomTransition", 0, 10);
        Curve.gui.add(wave, "amplitudeTransition", 0, 10);
        Curve.gui.add(wave, "speed", -0.1, 0.1);
        Mouse.speed();
    }

    public render = () => {
        this.ctx.fillStyle = this.mainColor;

        for (let i = 0; i <= this.vPoints.length - 1; i++) {

<<<<<<< HEAD
            if (TweenMax.ticker.frame % 200 === 0 && !Curve.mouseIsHoverButton) {
=======
            if (TweenMax.ticker.frame % 500 === 0 && !Curve.mouseIsHoverButton) {
>>>>>>> 0a709f8bd1953d86b7acd641f94d26a1d13e723a
                TweenMax.to(this.vPoints[i], wave.randomTransition, {
                    random: Math.floor(Math.random() * wave.randomRange),
                    // amplitude: Math.floor(Math.random() * wave.amplitudeRange),
                });

                TweenMax.to(this.vPoints[i], wave.amplitudeTransition, {
                    random: Math.floor(Math.random() * wave.randomRange),
                    amplitude: Math.floor(Math.random() * wave.amplitudeRange),
                });
            }
            const waveValue = (Math.sin(i + this.time + this.vPoints[i].random)) * this.vPoints[i].amplitude;
            const origin = this.ctx.canvas.width * 0.5;
            this.vPoints[i].ix = origin + waveValue;
            this.vPoints[i].move();
        }
        this.ctx.beginPath();
        this.ctx.moveTo(this.ctx.canvas.width * 0.5, 0);

        for (let i = 0; i <= this.vPoints.length - 1; i++) {
            const p = this.vPoints[i];
            if (i < this.vPoints.length - 1) {
                if (i === 0) {
                    p.y = 0;
                    p.cx = p.x;
                    p.cy = p.y;
                } else {
                    p.cx = (p.x + this.vPoints[i + 1].x) / 2;
                    p.cy = (p.y + this.vPoints[i + 1].y) / 2;
                }
            } else {
                p.cx = p.x;
                p.cy = p.y;
            }
            this.ctx.bezierCurveTo(p.x, p.y, p.cx, p.cy, p.cx, p.cy);
        }
        this.ctx.lineTo(0, this.ctx.canvas.height);
        this.ctx.lineTo(0, 0);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.clip();

        this.time -= wave.speed;
    }

    private initVPoints = () => {
        this.vPoints = [];
        for (let i = 0; i <= Curve.vTotalPoints - 1; i++) {
            this.vPoints.push(new Point(this.ctx.canvas.width * 0.5, i * Curve.vGap, "v", false));
        }
    }
}
