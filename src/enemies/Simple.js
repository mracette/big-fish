import { lerpColorHex, rotatePoint, hexToRgb, rgbToHex, lerpColorRgb, cividis, circle } from '../utils/utils';
import { nx, ny, colorPalette } from '../globals/globals'; 

export function generateSimpleParams() {

    const minSize = ny(1);
    const maxSize = ny(7);
    const size = minSize + ny(6) * Math.random();
    const cycleTime = 30 + size;
    const speed = nx(0.05) - size / 100 + Math.random() * nx(0.075);
    const direction = Math.random() >= .5 ? 'left' : 'right';
    const x = direction === 'right' ? - size : nx(100) + size;
    const y = Math.random() * ny(100);

    // colors come from the size and the array in the colorpalette object
    // const colorOne = hexToRgb(colorPalette.simpleFish[0]);
    // const colorTwo = hexToRgb(colorPalette.simpleFish[1]);
    const lerpAmount = (size - minSize) / (maxSize - minSize);
    
    const color = rgbToHex(lerpColorHex(lerpAmount, colorPalette.testing));// cividis(1 - lerpAmount);// rgbToHex(lerpColor(colorOne, colorTwo, lerpAmount));

    return { size, cycleTime, speed, x, y, direction, color};

}

export class Simple {

    constructor(size, cycleTime, speed, x, y, direction, color) {

        this.size = size;
        this.diameter = size * 2;
        this.cycleTime = cycleTime;
        this.vx = speed;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.color = color;
        
        this.vertices = 4;
        this.tailSide = this.size * 1.3;
        this.tailHeight = this.tailSide * Math.sqrt(3) / 2;
        
        this.coords = [
            [0, this.tailSide / 2],
            [-this.tailSide / 2, this.tailHeight + this.size / 2],
            [this.tailSide / 2, this.tailHeight + this.size / 2],
            [0, this.tailSide / 2]
        ];
        
        this.currentCoords;
        this.collision;
        this.dispose = false;
        this.sideEye = false;
        this.eyeAngle = 0;

    }

    reposition(time) {
        
        const currentCoords = [];

        if(this.direction === 'left') {
            this.x -= this.vx;
        } else {
            this.x += this.vx;
        }
        
        this.coords.map((c, i) => {

            const initialX = this.x + c[0];
            const initialY = this.y + c[1];

            let rotationBase;

            if(this.direction === 'left') {
                rotationBase = - Math.PI / 2;
            } else {
                rotationBase = Math.PI / 2;
            }

            const rotationDelta = Math.PI / 16 * Math.sin(time / this.cycleTime);

            const rotatedPoint = rotatePoint(initialX, initialY, this.x, this.y, rotationBase + rotationDelta);

            currentCoords.push([rotatedPoint.x, rotatedPoint.y]);

        })

        this.currentCoords = currentCoords;

    }

    collisionDetection(dd, rr) {

        if(dd < rr) {this.collision = true;} else {
            this.collision = false;
        }

    }

    draw(ctx) {

        const darkenedStroke = rgbToHex(lerpColorRgb(hexToRgb(this.color), [0,0,0], 0.15));

        // draw circle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();

        // draw tail
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

        // outer eye
        circle(
            ctx, 
            this.direction === 'left' ? this.x - this.size * 0.55 : this.x + this.size * 0.55,
            this.y - this.size / 6,
            this.size / 8,
            '#ffffff'
        );

        const innerY = this.direction === 'left' ? 
            (this.y - this.size / 6 - (this.sideEye ? Math.sin(this.eyeAngle + Math.PI) * this.size / 12 : 0)) : 
            (this.y - this.size / 6 - (this.sideEye ? Math.sin(this.eyeAngle - Math.PI) * this.size / 12 : 0));

        const innerX = this.direction === 'left' ? 
            (this.x - this.size * 0.55 - (this.sideEye ? Math.cos(this.eyeAngle + Math.PI) * this.size / 12 : 0)) : 
            (this.x + this.size * 0.55 - (this.sideEye ? Math.cos(this.eyeAngle - Math.PI) * this.size / 12 : 0))

        // inner eye
        circle(
            ctx, 
            innerX,
            innerY,
            this.size / 16,
            this.color
        );

        const mouthStart = [
            this.direction === 'left' ? this.x - Math.cos( 1.9 * Math.PI ) * this.size * 0.99 : this.x + Math.cos( 1.9 * Math.PI ) * this.size * 0.99,
            this.direction === 'left' ? this.y - Math.sin( 1.9 * Math.PI ) * this.size * 0.99 : this.y - Math.sin( 1.9 * Math.PI ) * this.size * 0.99
        ]

        ctx.strokeStyle = darkenedStroke;

        ctx.lineWidth = this.size / 24;
        ctx.beginPath();
        ctx.moveTo(
            mouthStart[0],
            mouthStart[1]
        )
        ctx.lineTo(
            this.direction === 'left' ? mouthStart[0] + this.size / 4 : mouthStart[0] - this.size / 4,
            mouthStart[1]
        )
        ctx.closePath();
        ctx.stroke();
    }

    render(ctx, time, px, py, radius) {

        this.reposition(time);

        if(this.x + this.size < nx(0) || this.x - this.size > nx(100)){this.dispose = true;}

        const xx = (this.x - px) * (this.x - px)
        const yy = (this.y - py) * (this.y - py)
        const dd = xx + yy;
        const rr = (this.size + radius) * (this.size + radius);

        if(dd < 2 * rr) {
            this.collisionDetection(dd, rr);
        }

        if(dd < 24 * rr) {
            this.sideEye = true;
            this.eyeAngle = Math.atan2(py - this.y, px - this.x);
        } else {
            this.sideEye = false;
        }

        this.draw(ctx);

    }
    
}

