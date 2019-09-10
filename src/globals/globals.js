export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
export let height = canvas.clientHeight;
export let width = canvas.clientWidth;

canvas.width = width;
canvas.height = height;

export const colorPalette = {
    blueOne: '#69D2E7',
    blueTwo: '#A7DBD8',
    goldFishOne: '#F38630',
    goldFishTwo: '#FA6900'
}

// player state
export const pl = {
    x: width / 2,
    y: height / 2,
    radius: height / 80,
    vx: 0,
    vy: 0,
    theta: 0,
    maxSpeed: 10,
    speedDelta: 0.2,
    thetaDelta: 0.1
}

// enemy probability table
export const enpr = []
enpr.push(...new Array(3).fill('jumper'));
enpr.push(...new Array(10).fill('simple'));

// enemy array
export const en = [];