export function rotatePoint(px, py, cx, cy, angle) {
    return {
        x: Math.cos(angle) * (px - cx) - Math.sin(angle) * (py - cy) + cx,
        y: Math.sin(angle) * (px - cx) + Math.cos(angle) * (py - cy) + cy
    }
}

export function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}