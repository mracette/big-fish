import { nx, ny, pl, pr, bo, en, enpr, se, canvas, ctx, height, width, colorPalette } from './globals/globals';
import Player from './player/Player';
import { Jumper, generateJumperParams } from './enemies/Jumper';
import { Simple, generateSimpleParams } from './enemies/Simple';
import { Puffer, generatePufferParams } from './enemies/Puffer';
import { BonusItem } from './extras/BonusItem';
import { Bubble } from './extras/Bubble';
import { Seaweed } from './extras/Seaweed';

import Stats from 'stats.js';
const stats = new Stats();

init();

function init() {

    canvas.height = height;
    canvas.width = width;

    stats.showPanel(0);
    document.body.append( stats.dom );

    pr.push(new Seaweed(nx(50), ny(100), ny(10)));

    addListeners();

    drawBackground();

    showIntroPanel(false);

}

function render(time) {

    stats.begin();

    // clear last render
    ctx.clearRect(0, 0, width, height);

    // set background
    ctx.fillStyle = colorPalette.blueOne;
    ctx.fillRect(0, 0, width, height);

    // player movement
    pl.render(ctx, time);

    // add an enemy if needed
    if(en.length < se.enemyCount && Math.random() > .6) {
        const newEnemyType = enpr[Math.floor(Math.random() * enpr.length)];
        switch(newEnemyType) {
            case 'simple': {
                const { size, cycleTime, speed, x, y, direction, color } = generateSimpleParams();
                en.push(new Simple(size, cycleTime, speed, x, y, direction, color));
                break;
            }
            case 'jumper': {
                const { size, cycleTime, speed, x, y, direction, color } = generateJumperParams();
                en.push(new Jumper(size, cycleTime, speed, x, y, direction, color));
                break;
            }
            case 'puffer': {
                const { size, cycleTime, speed, x, y, direction, color } = generatePufferParams();
                en.push(new Puffer(size, cycleTime, speed, x, y, direction, color));
            }
        }
    }

    const enemyRemovalArray = []

    // enemy movement
    en.map((enemy, i) => {

        enemy.render(ctx, time, pl.x, pl.y, pl.size);

        if(enemy.collision) {

            if(enemy.diameter < pl.diameter) {

                // add enemy to list of enemies to be removed
                enemyRemovalArray.push(i);

                // update player stats
                pl.size += enemy.diameter / 20;
                pl.diameter = pl.size * 2;

                // update session stats
                se.fishEaten ++;
                se.score += 1000 * enemy.diameter / ny(100);
                se.progress = pl.diameter / ny(100);
                updateStats();

                // introduce more puffers at 5 fish eaten
                if(se.fishEaten === 5) {
                    enpr.push('puffer');
                }

                // puffers more likely at 15 fish eaten
                if(se.fishEaten === 15) {
                    enpr.push('puffer');
                }

            } else {

                if(pl.bubble) {
                    pl.bubblePopped = true;
                    pl.bubblePoppedTime = time;
                } else if(!pl.bubblePopped) {
                    se.active = false;
                }
            }
        }
        if(enemy.dispose === true) {
            enemyRemovalArray.push(i);
        }
    })

    for(let i = 0; i < enemyRemovalArray.length; i++) {
        en.splice(enemyRemovalArray[i], 1);
    }

    // create new bonuses every so often
    if(Math.random() < 0.0001) {
        bo.push(new BonusItem());
    }
    if(Math.random() < 0.0001) {
        bo.push(new Bubble());
    }

    const bonusRemovalArray = []

    // bonus item movement
    bo.map((bonus, i) => {
        bonus.render(ctx, time, pl.x, pl.y, pl.size);
        if(bonus.collision) {

            bonusRemovalArray.push(i);
            se.score += 500;
            updateStats();

            if(bonus.type === 'bubble') {
                pl.bubble = true;
            }

        }

        if(bonus.dispose) {
            bonusRemovalArray.push(i);
        }

    })

    for(let i = 0; i < bonusRemovalArray.length; i++) {
        bo.splice(bonusRemovalArray[i], 1);
    }

    pr.map((prop) => {
        prop.render(ctx, time);
    });
    
    stats.end();
    
    if(se.active) {
        requestAnimationFrame(render);
    }

}

function updateStats() {
    document.getElementById('count').innerText = se.fishEaten;
    document.getElementById('score').innerText = Number(Math.round(se.score)).toLocaleString('en');
    document.getElementById('progress').style.width = `${se.progress * 6}vw`;
}

function drawBackground() {

    let tileWidth = nx(1);

    const p = document.createElement('canvas');
    p.width = tileWidth;
    p.height = tileWidth;
 
    const pctx = p.getContext('2d');
    pctx.lineWidth = nx(.05);

    pctx.fillStyle = colorPalette.pufferFishTail;
    pctx.fillRect(0, 0, tileWidth, tileWidth);

    pctx.strokeStyle = '#ffffff';

    pctx.moveTo(0,0);
    pctx.lineTo(tileWidth / 2, tileWidth / 2);
    pctx.lineTo(tileWidth, 0);
    pctx.stroke();

    const b = document.getElementById('canvas-background');
    const bctx = b.getContext('2d');
    b.width = b.clientWidth;
    b.height = b.clientHeight;

    bctx.fillStyle = bctx.createPattern(p, "repeat");
    bctx.rect(0, 0, b.width, b.height);
    bctx.fill();

    // add seaweed
    for(let i = 0; i < 48; i++) {
        pr.push(new Seaweed(Math.random() * nx(100), ny(100), ny(8) + Math.random() * ny(5)));
    }

}

function addListeners() {
    document.getElementById('start-button').onclick = startGame;
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
            pl.leftPressed = true;
            break;
        case 38:
            pl.upPressed = true;
            break;
        case 39:
            pl.rightPressed = true;
            break;
        case 40:
            pl.downPressed = true;
            break;
    }

}

function keyUpHandler(e) {
    const key = e.which || e.keyCode;

    switch(key) {
        case 37:
            pl.leftPressed = false;
            break;
        case 38:
            pl.upPressed = false;
            break;
        case 39:
            pl.rightPressed = false;
            break;
        case 40:
            pl.downPressed = false;
            break;
    }

}

function showIntroPanel(flagShow) {

    if(!flagShow) {startGame();}
    
    if(flagShow) {

    document.getElementById('blur').style.visibility = 'visible';

    Array.from(document.getElementsByClassName('info-canvas')).forEach(el => {

        el.height = el.clientHeight;
        el.width = el.clientWidth;

        switch(el.id) {
            case 'intro-avoid': {
                const s = new Simple(el.clientHeight / 3, 1, 1, el.clientWidth * 4.5/10, el.clientHeight / 2, 'right', '#addd8e');
                s.reposition(0);
                s.draw(el.getContext('2d'));

                const p = new Player(el.clientWidth * 5.5/10, el.clientHeight / 2, el.clientHeight / 8, Math.PI / 2);
                p.reposition();
                p.draw(el.getContext('2d'));
                break;
            }
            case 'intro-eat': {
                const s = new Simple(el.clientHeight / 10, 1, 1, el.clientWidth * 4.75/10, el.clientHeight / 2, 'right', '#d9f0a3');
                s.reposition(0);
                s.draw(el.getContext('2d'));

                const p = new Player(el.clientWidth * 5.25/10, el.clientHeight / 2, el.clientHeight / 8, 3 * Math.PI / 2);
                p.reposition();
                p.draw(el.getContext('2d'));
                break;
            }
            case 'intro-odd': {
                const s = new Jumper(el.clientHeight / 3, 1, 1, el.clientWidth * 5/10 - el.clientHeight * 1.2, el.clientHeight / 2, 'right', '#87a8eb');
                s.reposition(0);
                s.draw(el.getContext('2d'));

                const p = new Player(el.clientWidth * 5/10 - el.clientHeight / 3, el.clientHeight / 2, el.clientHeight / 4, Math.PI / 2);
                p.reposition();
                p.draw(el.getContext('2d'));

                const ss = new Jumper(el.clientHeight / 5, 1, 1, el.clientWidth * 5/10 + el.clientHeight / 2, el.clientHeight / 2, 'right', '#87a8eb');
                ss.reposition(0);
                ss.draw(el.getContext('2d'));

                const pp = new Player(el.clientWidth * 5/10 + el.clientHeight, el.clientHeight / 2, el.clientHeight / 4, 3 * Math.PI / 2);
                pp.reposition();
                pp.draw(el.getContext('2d'));

                break;
            }
            case 'intro-tails': {
                const s = new Simple(el.clientHeight / 2.3, 1, 1, el.clientWidth * 5/10 - el.clientHeight / 2, el.clientHeight / 2, 'left', '#addd8e');
                s.reposition(0);
                s.draw(el.getContext('2d'));

                const p = new Player(el.clientWidth * 5/10 + el.clientHeight / 2, el.clientHeight / 2, el.clientHeight / 4, Math.PI / 2);
                p.reposition();
                p.draw(el.getContext('2d'));
                break;
            }
            case 'intro-bonus': {
                break;
            }
            case 'intro-win': {
                const p = new Player(el.clientWidth * 5/10, el.clientHeight / 2, el.clientHeight, 0);
                p.reposition();
                p.draw(el.getContext('2d'));
                break;
            }
        }
    });
    
    document.getElementById('intro').style.visibility = 'visible';

    }


}

function startGame() {
    document.getElementById('intro').style.visibility = 'hidden';
    document.getElementById('blur').style.visibility = 'hidden';
    document.getElementById('title').style.visibility = 'visible';
    document.getElementById('canvas').style.visibility = 'visible';
    document.getElementById('stats').style.visibility = 'visible';
    render(0);
}

function resetGame() {

    se = {
        active: true,
        fishEaten: 0,
        score: 0,
        progress: 0,
        elapsed: 0,
        enemyCount: 25,
        stage: 1
    }

    pl = {
        x: nx(50),
        y: ny(50),
        radius: ny(1.5),
        diameter: ny(1.5) * 2,
        vx: 0,
        vy: 0,
        theta: 0,
        speedDelta: ny(0.0135),
        thetaDelta: ny(0.0145)
    }

    en = []

    render(0);

}