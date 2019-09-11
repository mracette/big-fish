import { lerp, equilateralTriangle, circle, ellipse, spikes } from '../utils/utils';
import { nx, ny, colorPalette } from '../globals/globals'; 

export function generatePufferParams() {

    const minSize = ny(3);
    const maxSize = ny(5);
    const size = minSize + maxSize * Math.random();
    const cycleTime = 8500 + size * 10;
    const speed = nx(0.015) + Math.random() * nx(0.025);
    const direction = Math.random() >= .5 ? 'left' : 'right';
    const x = direction === 'right' ? - size : nx(100) + size;
    const y = Math.random() * ny(100);

    return { size, cycleTime, speed, x, y, direction, color: colorPalette.pufferFish};

}

export class Puffer {

    constructor(size, cycleTime, speed, x, y, direction, color) {

        this.cycleTime = cycleTime;

        this.direction = direction
        this.color = color;
        this.size = size;

        this.x = x;
        this.y = y;
        this.vx = speed;

        this.state = [
            {
                start: 0,
                end: 0.6,
                radius: this.size,
                speed: this.vx * 1.2,
                value: 'neutral'
            },
            {
                start: .5,
                end: .65,
                radius: this.size,
                speed: this.vx * 0.75,
                value: 'huffing'
            },
            {
                start: 0.6,
                end: 1,
                radius: this.size * 3,
                speed: this.vx * 0.5,
                value: 'puffing'
            },
            {
                start: 0.95,
                end: 1,
                radius: this.size,
                speed: this.vx,
                value: 'neutral'
            }
        ];

        this.collision;
        this.currentState;
        this.currentCoords;
        this.diameter;
        this.dispose;

    }

    reposition(time) {

        const cyclePosition = (time % this.cycleTime) / this.cycleTime;

        this.currentState = this.state.filter((e) => {
            return e.start <= cyclePosition && e.end > cyclePosition;
        });

        const stateType = this.currentState.length > 1 ? 'transition' : 'stable';

        const currentCoords = [];
            
            if(stateType === 'transition') {

                const stateOne = this.currentState[0];
                const stateTwo = this.currentState[1];

                let lerpAmount;

                // TODO: clean this up. not sure it needs so much logic
                if(stateOne.start === stateTwo.start && stateOne.end <= stateTwo.end) {
                    lerpAmount = (cyclePosition - stateOne.start) / (stateOne.end - stateOne.start);
                } else if(stateOne.start <= stateTwo.start && stateOne.end < stateTwo.end) {
                    lerpAmount = (cyclePosition - stateTwo.start) / (stateOne.end - stateTwo.start);
                } else if(stateOne.start < stateTwo.start && stateOne.end === stateTwo.end) {
                    lerpAmount = (cyclePosition - stateTwo.start) / (stateTwo.end - stateTwo.start);
                }

                // vx
                const dvx = lerp(stateOne.speed, stateTwo.speed, lerpAmount);


                if(this.direction === 'left') {
                    this.x -= dvx;
                } else {
                    this.x += dvx;
                }

                // radius
                const r = lerp(stateOne.radius, stateTwo.radius, lerpAmount);
                this.size = r;

            } else {

                const stateOne = this.currentState[0];

                // vx
                const dvx = stateOne.speed;

                if(this.direction === 'left') {
                    this.x -= dvx;
                } else {
                    this.x += dvx;
                }

                this.size = stateOne.radius;
            }
            
            this.finSize = this.size / 2;
            this.finHeight = this.finSize * Math.sqrt(3) / 2;

        this.currentCoords = currentCoords;

    }

    collisionDetection(x, y, radius) {

        const xx = (this.x - x) * (this.x - x)
        const yy = (this.y - y) * (this.y - y)
        const dd = xx + yy;
        const rr = (this.size + radius) * (this.size + radius);

        if(dd < rr) {this.collision = true;} else {
            this.collision = false;
        }

    }

    render(ctx, time, px, py, radius) {

        this.reposition(time);
        this.diameter = this.size * 2;

        const flapAmount = 0.25 * Math.sin(this.vx * time / 50);
        const huffAmount = this.currentState.filter(s => s.value === 'huffing').length > 0 ? 1 + Math.abs(Math.sin(time / 100)) * .25 : 1;

        if(this.x + this.size < nx(0) || this.x - this.size > nx(100)){this.dispose = true;}

        if(Math.abs(this.x - px) < radius * 4 || Math.abs(this.y - py) < radius * 4) {
            this.collisionDetection(px, py, radius);
        }

        // draw spikes
        spikes(ctx, 25, this.size / 8, this.x, this.y, this.size, colorPalette.pufferFish[0]);

        // draw mouth
        ellipse(
            ctx, 
            this.direction === 'left' ? this.x - this.size : this.x + this.size, 
            this.y, 
            huffAmount * (this.size / 8), 
            huffAmount * (this.size / 3.4), 
            0, 
            colorPalette.pufferFishMouth
        );

        // back tail
        equilateralTriangle(
            ctx, 
            this.size, 
            this.direction === 'left' ? - Math.PI / 2 : Math.PI / 2, 
            this.direction === 'left' ? this.x + this.size : this.x - this.size, 
            this.y, 
            colorPalette.pufferFishTail
        );

        // body
        circle(ctx, this.x, this.y, this.size, colorPalette.pufferFish[0]);

        // middle fin
        equilateralTriangle(
            ctx, 
            this.size / 2, 
            this.direction === 'left' ? - Math.PI / 2 : Math.PI / 2, 
            this.direction === 'left' ? this.x + this.size / 4 : this.x - this.size / 4, 
            this.y, 
            colorPalette.pufferFishTail, 
            flapAmount
        );

        // eye
        ellipse(
            ctx, 
            this.direction === 'left' ? this.x - this.size / 1.75 : this.x + this.size / 1.75, 
            this.y - this.size / 3, 
            this.size / 6, 
            this.size / 5, 
            0, 
            '#FFFFFF'
        );
        
        ellipse(
            ctx, 
            this.direction === 'left' ? this.x - this.size / 1.75 : this.x + this.size / 1.75, 
            this.y - this.size / 3, 
            this.size / 12, 
            this.size / 10, 
            0, 
            colorPalette.pufferFishTail
        );

    }
    
}

