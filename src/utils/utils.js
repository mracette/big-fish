export function rotatePoint(px, py, cx, cy, angle) {
    return {
        x: Math.cos(angle) * (px - cx) - Math.sin(angle) * (py - cy) + cx,
        y: Math.sin(angle) * (px - cx) + Math.cos(angle) * (py - cy) + cy
    }
}

export function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}

export function lerpColor(a, b, amount) {
    return [
        Math.round(a[0]*(1-amount)+b[0]*(amount)),
        Math.round(a[1]*(1-amount)+b[1]*(amount)),
        Math.round(a[2]*(1-amount)+b[2]*(amount))
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