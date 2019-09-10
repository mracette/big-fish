import { lerp } from '../utils/utils';

export class Jumper {

    constructor(size, x, y, scrolldirection) {

        this.cycleTime = 2800;

        this.scrolldirection = scrolldirection
        
        this.size = size;
        this.vertices = 4;

        this.x = x;
        this.y = y;
        this.vx = 0.1;
        this.vy = 0.1;

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
                speed: this.vx * 4.5,
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

                if(this.scrolldirection === 'left') {
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

                if(this.scrolldirection === 'left') {
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

    render(ctx, time) {

        this.reposition(time);

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

