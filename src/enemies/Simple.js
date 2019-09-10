import { lerp, rotatePoint } from '../utils/utils';

export class Simple {

    constructor(size, cycleTime, speed, x, y, scrolldirection) {

        this.size = size;
        this.cycleTime = cycleTime;
        this.vx = speed;
        this.x = x;
        this.y = y;
        this.scrolldirection = scrolldirection;
        
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

    }

    reposition(time) {

        const cyclePosition = (time % this.cycleTime) / this.cycleTime;
        
        const currentCoords = [];

        if(this.scrolldirection === 'left') {
            this.x -= this.vx;
        } else {
            this.x += this.vx;
        }
        
        this.coords.map((c, i) => {
            // x value
            const initialX = this.x + c[0];
            const initialY = this.y + c[1];

            let rotationBase;

            if(this.scrolldirection === 'left') {
                rotationBase = - Math.PI / 2;
            } else {
                rotationBase = Math.PI / 2;
            }

            const rotationDelta = Math.PI / 16 * Math.sin(time / this.cycleTime);

            const rotatedPoint = rotatePoint(initialX, initialY, this.x, this.y, rotationBase + rotationDelta);

            currentCoords.push([rotatedPoint.x, rotatedPoint.y]);
            //currentCoords.push([initialX, initialY]);

        })

        this.currentCoords = currentCoords;

    }

    render(ctx, time) {

        this.reposition(time);

        // // draw circle
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

    }
    
}

