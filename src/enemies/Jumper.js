import { lerp, lerpColor, hexToRgb, rgbToHex } from '../utils/utils';
import { nx, ny, colorPalette } from '../globals/globals'; 

export function generateJumperParams() {

    const minSize = ny(1);
    const maxSize = ny(3);
    const size = minSize + maxSize * Math.random();
    const cycleTime = 2500 + size * 10;
    const speed = Math.min(.1, Math.random() * 0.5 + size / 120)
    const direction = Math.random() >= .5 ? 'left' : 'right';
    const x = direction === 'right' ? - size : nx(100) + size;
    const y = Math.random() * ny(100);

    // colors come from the size and the array in the colorpalette object
    const colorOne = hexToRgb(colorPalette.jumperFish[0]);
    const colorTwo = hexToRgb(colorPalette.jumperFish[1]);
    const lerpAmount = (size - minSize) / (maxSize - minSize);
    
    const color = rgbToHex(lerpColor(colorOne, colorTwo, lerpAmount));

    return { size, cycleTime, speed, x, y, direction, color};

}

export class Jumper {

    constructor(size, cycleTime, speed, x, y, direction, color) {

        this.cycleTime = cycleTime;

        this.direction = direction
        this.color = color;

        this.size = size;
        this.vertices = 4;

        this.x = x;
        this.y = y;
        this.vx = speed;

        this.collision;

        this.state = [
            {
                start: 0,
                end: 0.3,
                speed: this.vx,
                value: 'coil'
            },
            {
                start: .2,
                end: .99,
                speed: this.vx * 5,
                value: 'jump'
            },
            {
                start: 0.75,
                end: 1,
                speed: this.vx * 2,
                value: 'coil'
            }
        ];

        this.coords = {
            'neutral': [
                [-size / 2, 0],
                [0, -size / 2],
                [size / 2, 0],
                [0, size / 2]
            ],
            'coil': [
                [-size / 2, 0],
                [0, -size],
                [size / 2, 0],
                [0, size]
            ],
            'jump': [
                [-size, 0],
                [0, -size / 2],
                [size, 0],
                [0, size / 2]
            ]
        }

        this.currentCoords;
        this.diameter;
        this.dispose;

    }

    reposition(time) {

        const cyclePosition = (time % this.cycleTime) / this.cycleTime;

        const currentState = this.state.filter((e) => {
            return e.start <= cyclePosition && e.end > cyclePosition;
        });

        const stateType = currentState.length > 1 ? 'transition' : 'stable';
        
        const currentCoords = [];
        
        for(let i = 0; i < this.vertices; i++){

            // center position
            currentCoords[i] = [this.x, this.y];

            const movementCoords = new Array(2);
            
            if(stateType === 'transition') {

                const stateOne = currentState[0];
                const stateTwo = currentState[1];

                let lerpAmount;

                // TODO: clean this up. not sure it needs so much logic
                if(stateOne.start === stateTwo.start && stateOne.end <= stateTwo.end) {
                    lerpAmount = (cyclePosition - stateOne.start) / (stateOne.end - stateOne.start);
                } else if(stateOne.start <= stateTwo.start && stateOne.end < stateTwo.end) {
                    lerpAmount = (cyclePosition - stateTwo.start) / (stateOne.end - stateTwo.start);
                } else if(stateOne.start < stateTwo.start && stateOne.end === stateTwo.end) {
                    lerpAmount = (cyclePosition - stateTwo.end) / (stateTwo.end - stateTwo.start);
                }

                // vx
                const dvx = lerp(stateOne.speed, stateTwo.speed, lerpAmount);

                if(this.direction === 'left') {
                    this.x -= dvx;
                } else {
                    this.x += dvx;
                }

                // x coord
                movementCoords[0] = lerp(this.coords[stateOne.value][i][0], this.coords[stateTwo.value][i][0], lerpAmount);

                // y coord
                movementCoords[1] = lerp(this.coords[stateOne.value][i][1], this.coords[stateTwo.value][i][1], lerpAmount);

            } else {

                const stateOne = currentState[0];

                // vx
                const dvx = stateOne.speed;

                if(this.direction === 'left') {
                    this.x -= dvx;
                } else {
                    this.x += dvx;
                }

                movementCoords[0] = this.coords[stateOne.value][i][0];
                movementCoords[1] = this.coords[stateOne.value][i][1];
            }


            // center position + state + vertex structure
            currentCoords[i][0] += movementCoords[0];
            currentCoords[i][1] += movementCoords[1];
            
        }

        this.currentCoords = currentCoords;

    }

    collisionDetection(x, y, radius) {

        for(let i = 0; i < this.currentCoords.length - 1; i++) {

            const dd = radius * radius;

            // TODO: optimize using distance squared?
            let xx = Math.pow(x - this.currentCoords[i][0], 2);
            let yy = Math.pow(y - this.currentCoords[i][1], 2);

            if(xx + yy < dd){return true;}

            // check mid point between this coord and the next
            const xAvg = (this.currentCoords[i][0] + this.currentCoords[i+1][0]) / 2
            const yAvg = (this.currentCoords[i][1] + this.currentCoords[i+1][1]) / 2
        
            xx = (x - xAvg) * (x - xAvg);
            yy = (y - yAvg) * (y - yAvg);

            if(xx + yy < dd){return true;}
            
        }

        return false

    }

    calculateDiameter() {
        // reference: area of a rhombus
        const w = Math.abs(this.currentCoords[0][0] - this.currentCoords[2][0])
        const h = Math.abs(this.currentCoords[1][1] - this.currentCoords[2][1])
        return Math.max(w, h);
    }

    render(ctx, time, px, py, radius) {

        this.reposition(time);
        this.diameter = this.calculateDiameter();

        if(this.x + this.size < nx(0) || this.x - this.size > nx(100)){this.dispose = true;}

        // TODO: fix this pretty shoddy check?
        if(Math.abs(px - this.x) < this.size * 4 || Math.abs(py - this.y) < this.size * 4) {
            this.collision = this.collisionDetection(px, py, radius);
        }

        ctx.fillStyle = this.color;

        ctx.beginPath();
        this.currentCoords.map((c, i) => {
            if(i === 0) {
                ctx.moveTo(c[0], c[1]);
            } else {
                ctx.lineTo(c[0], c[1]);
            }
        });
        ctx.fill();
        ctx.closePath();
    }
    
}

