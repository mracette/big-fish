
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let height = canvas.clientHeight;
let width = canvas.clientWidth;
canvas.width = width;
canvas.height = height;

const colorPalette = {
    blueOne: '#69D2E7',
    blueTwo: '#A7DBD8',
    goldFishOne: '#F38630',
    goldFishTwo: '#FA6900'
}

const p = {
    x: width / 2,
    y: height / 2,
    radius: 10,
    vx: 0,
    vy: 0,
    theta: 0,
    maxSpeed: 10,
    speedDelta: 0.2,
    thetaDelta: 0.1
}

let testx = 50 + width / 2;
let testy = 50 + height / 2;

init();

function init() {

    addListeners();
    render();

}

function addListeners() {
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener('resize', () => {
        height = canvas.clientHeight;
        width = canvas.clientWidth;
        canvas.width = width;
        canvas.height = height;
    }, false)
}

function keyDownHandler(e) {
    const key = e.which || e.keyCode;

    switch(key) {
        case 37:
            p.leftPressed = true;
            break;
        case 38:
            p.upPressed = true;
            break;
        case 39:
            p.rightPressed = true;
            break;
        case 40:
            p.downPressed = true;
            break;
    }

}

function keyUpHandler(e) {
    const key = e.which || e.keyCode;

    switch(key) {
        case 37:
            p.leftPressed = false;
            break;
        case 38:
            p.upPressed = false;
            break;
        case 39:
            p.rightPressed = false;
            break;
        case 40:
            p.downPressed = false;
            break;
    }

}

function drawPlayer() {

    ctx.fillStyle = colorPalette.goldFishTwo;

    // draw circle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();

    // draw tail
    const side = p.radius * 1.5;
    const h = side * Math.sqrt(3) / 2;

    const points = [
        [p.x, p.y + p.radius / 2],
        [p.x - side / 2, p.y + h + p.radius / 2],
        [p.x + side / 2, p.y + h + p.radius / 2],
        [p.x, p.y + p.radius / 2]
    ];

    ctx.beginPath();

    points.map((point, i) => {
        rotatedPoint = rotatePoint(point[0], point[1], p.x, p.y, p.theta);
        if(i === 0) {
            ctx.moveTo(rotatedPoint.x, rotatedPoint.y);
        } else {
            ctx.lineTo(rotatedPoint.x, rotatedPoint.y);
        }
    });

    //ctx.stroke();
    ctx.fill(); 
    ctx.closePath();
    ctx.save();
    
}

function repositionPlayer() {

    const velocity = Math.sqrt(p.vx * p.vx + p.vy * p.vy);

    if(p.leftPressed){
        p.vx -= p.speedDelta; 
        if(p.theta > Math.PI / 2) {
            p.theta = lerp(p.theta, 3 * Math.PI / 2, p.thetaDelta)
        } else if(p.theta <= Math.PI / 2) {
            p.theta = lerp(p.theta, - Math.PI / 2, p.thetaDelta)
        } else {

        }
    };
    if(p.upPressed){
        p.vy -= p.speedDelta;
        if(p.theta < Math.PI && p.theta >= 0) {
            p.theta = lerp(p.theta, 0, p.thetaDelta);
        } else {
            p.theta = lerp(p.theta, 2 * Math.PI, p.thetaDelta);
        }
    };
    if(p.rightPressed){
        p.vx += p.speedDelta;
        if(p.theta < 3 * Math.PI / 2 && p.theta >= Math.PI / 2) {
            p.theta = lerp(p.theta, Math.PI / 2, p.thetaDelta);
        } else if(p.theta >= 3 * Math.PI / 2) {
            p.theta = lerp(p.theta, 5 * Math.PI / 2, p.thetaDelta);
        } else {
            p.theta = lerp(p.theta, Math.PI / 2, p.thetaDelta);
        }
    };
    if(p.downPressed){
        p.vy += p.speedDelta;
        p.theta = lerp(p.theta, Math.PI, p.thetaDelta);
    };

    // cap rotation at [0, 2PI);
    if(p.theta > 2 * Math.PI){
        p.theta = p.theta - 2 * Math.PI;
    } else if(p.theta < 0) {
        p.theta = 2 * p.theta + 2 * Math.PI;
    }

    p.x += p.vx;
    p.y += p.vy;

    // flip to other side of screen if necessary
    if(p.x >= width + p.radius) {
        p.x = -p.radius;
    } else if(p.x <= -p.radius) {
        p.x = width + p.radius;
    }

    if(p.y >= height + p.radius) {
        p.y = -p.radius;
    } else if(p.y <= -p.radius) {
        p.y = height + p.radius;
    }

}

function rotatePoint(px, py, cx, cy, angle) {
    return {
        x: Math.cos(angle) * (px - cx) - Math.sin(angle) * (py - cy) + cx,
        y: Math.sin(angle) * (px - cx) + Math.cos(angle) * (py - cy) + cy
    }
}

function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}

function render() {

    // console.log(p);
    // console.log(p.vx, p.vy);

    // clear last render
    ctx.clearRect(0, 0, width, height);

    // set background
    ctx.fillStyle = colorPalette.blueOne;
    ctx.fillRect(0, 0, width, height);

    // ctx.fillStyle = colorPalette.goldFishTwo;
    //     // draw circle
    //     ctx.beginPath();
    //     ctx.arc(testx, testy, p.radius, 0, Math.PI*2);
    //     ctx.fill();
    //     ctx.closePath();

    // const newCoords = rotatePoint(testx, testy, width/2, height/2, 0.1);
    // testx = newCoords.x;
    // testy = newCoords.y;

    // player movement
    repositionPlayer();
    drawPlayer();
    
    requestAnimationFrame(render);
}