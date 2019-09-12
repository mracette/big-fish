export function rotatePoint(px, py, cx, cy, angle) {
    return {
        x: Math.cos(angle) * (px - cx) - Math.sin(angle) * (py - cy) + cx,
        y: Math.sin(angle) * (px - cx) + Math.cos(angle) * (py - cy) + cy
    }
}

export function equilateralTriangle(ctx, side, rotation, x, y, fill, flapAmount) {

    const v = [];
    const h = side * Math.sqrt(3) / 2
    const m = flapAmount || 1;

    v.push(rotatePoint(x, y - 2 * h / 3, x, y, rotation));
    v.push(rotatePoint(x + side / 2, y + m * (h / 3), x, y, rotation));
    v.push(rotatePoint(x - side / 2, y + m * (h / 3), x, y, rotation));

    if(!!fill) {ctx.fillStyle = fill};

    ctx.beginPath();
    ctx.moveTo(v[0].x, v[0].y);
    ctx.lineTo(v[1].x, v[1].y);
    ctx.lineTo(v[2].x, v[2].y);
    ctx.lineTo(v[0].x, v[0].y);
    ctx.fill();
    ctx.closePath();
    
}

export function circle(ctx, x, y, r, fill) {

    if(!!fill) {ctx.fillStyle = fill};

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();

}

export function ellipse(ctx, x, y, rx, ry, rotate, fill) {

    if(!!fill) {ctx.fillStyle = fill};

    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rotate, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();

}

export function spikes(ctx, n, size, x, y, r, fill) {

    for(let i = 0; i < n; i++) {
        const angle = 2 * Math.PI * (i / n);
        equilateralTriangle(ctx, size, Math.PI / 2 + angle, x + Math.cos(angle) * r, y + Math.sin(angle) * r, fill);
    }

}

export function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}

export function lerpColorRgb(a, b, l) {
    return [
        Math.round(a[0]*(1-l)+b[0]*(l)),
        Math.round(a[1]*(1-l)+b[1]*(l)),
        Math.round(a[2]*(1-l)+b[2]*(l))
    ];
}

export function lerpColorHex(amount, colorArray) {

    const bucket = Math.ceil(amount * (colorArray.length - 1));

    const bucketStart = (bucket - 1) / (colorArray.length - 1);
    const bucketEnd = (bucket) / (colorArray.length - 1);

    const l = (amount - bucketStart) / (bucketEnd - bucketStart);

    const a = hexToRgb(colorArray[bucket - 1]);
    const b = hexToRgb(colorArray[bucket]);

    return [
        Math.round(a[0]*(1-l)+b[0]*(l)),
        Math.round(a[1]*(1-l)+b[1]*(l)),
        Math.round(a[2]*(1-l)+b[2]*(l))
    ];

};

export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
};

export function rgbToHex(rgb) {
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
};

export function cividis(t) {
    t = Math.max(0, Math.min(1, t));
    return rgbToHex([
        Math.max(0, Math.min(255, Math.round(-4.54 - t * (35.34 - t * (2381.73 - t * (6402.7 - t * (7024.72 - t * 2710.57))))))),
        Math.max(0, Math.min(255, Math.round(32.49 + t * (170.73 + t * (52.82 - t * (131.46 - t * (176.58 - t * 67.37))))))),
        Math.max(0, Math.min(255, Math.round(81.24 + t * (442.36 - t * (2482.43 - t * (6167.24 - t * (6614.94 - t * 2475.67)))))))
    ]);
  }