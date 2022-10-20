export function line(canvasCtx, dataArray, bufferLength, width, x_offset, y_offset, intensity) {
    const stepSize = width / bufferLength
    let x = x_offset

    for (let i = 0; i < bufferLength; i++) {
        const value = (dataArray[i] / 128)
        let y = y_offset * value

        y -= (y - y_offset) * intensity

        if (i === 0) {
            canvasCtx.moveTo(x, y)
        } else {
            canvasCtx.lineTo(x, y)
        }

        x += stepSize
    }
}

export function circle(canvasCtx, dataArray, bufferLength, radius, max_angle, x_offset, y_offset, a_offset, intensity) {
    const stepSize = bufferLength / max_angle
    let x = 0
    let y = 0

    for (let i = 0; i <= max_angle; i += max_angle / bufferLength) {
        let value = dataArray[i * stepSize] / 255
        let angle = toRadians(i + a_offset + (360 - (max_angle / 2)) - 90)
        let length = value * radius
        length = length + ((radius - length) * intensity)

        x = length * Math.cos(angle) + x_offset
        y = length * Math.sin(angle) + y_offset

        if (i === 0) {
            canvasCtx.moveTo(x, y)
        } else {
            canvasCtx.lineTo(x, y)
        }
    }
}

function toRadians(angle) {
    return angle * (Math.PI / 180)
}