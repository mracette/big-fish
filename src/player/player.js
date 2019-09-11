import { ny, nx, pl, canvas, ctx, height, width, colorPalette } from '../globals/globals';
import { lerp, lerpColor, hexToRgb, rgbToHex, rotatePoint } from '../utils/utils';

function drawPlayer() {

    // draw circle
    ctx.fillStyle = colorPalette.goldFishTwo;
    ctx.beginPath();
    ctx.arc(pl.x, pl.y, pl.radius, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();

    // draw tail
    const side = pl.radius * 1.5;
    const h = side * Math.sqrt(3) / 2;

    const points = [
        [pl.x, pl.y + pl.radius / 2],
        [pl.x - side / 2, pl.y + h + pl.radius / 2],
        [pl.x + side / 2, pl.y + h + pl.radius / 2],
        [pl.x, pl.y + pl.radius / 2]
    ];

    ctx.beginPath();

    points.map((point, i) => {
        const rotatedPoint = rotatePoint(point[0], point[1], pl.x, pl.y, pl.theta);
        if(i === 0) {
            ctx.moveTo(rotatedPoint.x, rotatedPoint.y);
        } else {
            ctx.lineTo(rotatedPoint.x, rotatedPoint.y);
        }
    });

    ctx.fill(); 
    ctx.closePath();
    ctx.save();
    
}

function repositionPlayer() {

    const velocity = Math.sqrt(pl.vx * pl.vx + pl.vy * pl.vy);

    if(pl.leftPressed){
        pl.vx -= pl.speedDelta; 
        if(pl.theta > Math.PI / 2) {
            pl.theta = lerp(pl.theta, 3 * Math.PI / 2, pl.thetaDelta)
        } else if(pl.theta <= Math.PI / 2) {
            pl.theta = lerp(pl.theta, - Math.PI / 2, pl.thetaDelta)
        } else {

        }
    };
    if(pl.upPressed){
        pl.vy -= pl.speedDelta;
        if(pl.theta < Math.PI && pl.theta >= 0) {
            pl.theta = lerp(pl.theta, 0, pl.thetaDelta);
        } else {
            pl.theta = lerp(pl.theta, 2 * Math.PI, pl.thetaDelta);
        }
    };
    if(pl.rightPressed){
        pl.vx += pl.speedDelta;
        if(pl.theta < 3 * Math.PI / 2 && pl.theta >= Math.PI / 2) {
            pl.theta = lerp(pl.theta, Math.PI / 2, pl.thetaDelta);
        } else if(pl.theta >= 3 * Math.PI / 2) {
            pl.theta = lerp(pl.theta, 5 * Math.PI / 2, pl.thetaDelta);
        } else {
            pl.theta = lerp(pl.theta, Math.PI / 2, pl.thetaDelta);
        }
    };
    if(pl.downPressed){
        pl.vy += pl.speedDelta;
        pl.theta = lerp(pl.theta, Math.PI, pl.thetaDelta);
    };

    // cap rotation at [0, 2PI);
    if(pl.theta > 2 * Math.PI){
        pl.theta = pl.theta - 2 * Math.PI;
    } else if(pl.theta < 0) {
        pl.theta = 2 * pl.theta + 2 * Math.PI;
    }

    pl.x += pl.vx;
    pl.y += pl.vy;

    // flip to other side of screen if necessary
    if(pl.x >= width + pl.radius) {
        pl.x = -pl.radius;
    } else if(pl.x <= -pl.radius) {
        pl.x = width + pl.radius;
    }

    if(pl.y >= height + pl.radius) {
        pl.y = -pl.radius;
    } else if(pl.y <= -pl.radius) {
        pl.y = height + pl.radius;
    }

}

export { drawPlayer, repositionPlayer };