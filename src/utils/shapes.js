import { circle, line } from'./patterns'

class Shape {
    #props
    #dataArray
    #audioCtx
    #canvasCtx

    constructor(canvasCtx, audioCtx, props) {
        this.#canvasCtx = canvasCtx
        this.#audioCtx = audioCtx
        this.#props = props

        this.analyzer = new AnalyserNode(this.#audioCtx)
        this.#dataArray = new Uint8Array(this.analyzer.frequencyBinCount)
    }

    get props() {
        return this.#props
    }

    get dataArray() {
        return this.#dataArray
    }

    get canvasCtx() {
        return this.#canvasCtx
    }

    connect(source) {
        this.analyzer.disconnect()
        source.connect(this.analyzer)
    }

    analyze() {
        this.analyzer.getByteTimeDomainData(this.#dataArray)
    }

    updateProps(props, debug=false) {
        debug && console.log(props)
        this.#props = {
            ...this.#props,
            ...props,
        }

        debug && console.log('new:', this.props )
    }
}

export class Circle extends Shape {

    constructor(canvasCtx, audioCtx, props = {}) {
        super(canvasCtx, audioCtx, {
            radius: 300,
            max_angle: 360,
            x_offset: 0,
            y_offset: 0,
            a_offset: 0,
            intensity: 0.5,
            ...props,
        })
    }

    get propsInfo() {
        return {
            radius: {
                name: 'Radius',
                max: 1000,
                min: 1,
                step: 1,
            },
            max_angle: {
                name: 'Maximum Angle',
                max: 1440,
                min: 1,
                step: 1,
            },
            x_offset: {
                name: 'X Offset',
                max: 1000,
                min: -1000,
                step: 1
            },
            y_offset: {
                name: 'Y Offset',
                max: 1000,
                min: -1000,
                step: 1
            },
            a_offset: {
                name: 'Rotation',
                max: 360,
                min: 0,
            },
            intensity: {
                name: 'Intesity',
                max: 2,
                min: 0,
            }
        }
    }

    draw() {
        this.analyze()

        circle(
            this.canvasCtx, 
            this.dataArray,
            this.analyzer.frequencyBinCount,
            this.props.radius,
            this.props.max_angle,
            this.props.x_offset,
            this.props.y_offset,
            -this.props.a_offset,
            this.props.intensity
        )
    }
}

export class Line extends Shape {

    constructor(canvasCtx, audioCtx, props = {}) {
        super(canvasCtx, audioCtx, {
            width: 600,
            x_offset: 0,
            y_offset: 0,
            intensity: 0.5,
            ...props,
        })
    }

    get propsInfo() {
        return {
            width: {
                name: 'Width',
                max: 10000,
                min: 1,
                step: 1,
            },
            x_offset: {
                name: 'X Offset',
                max: 1000,
                min: -1000,
                step: 1
            },
            y_offset: {
                name: 'Y Offset',
                max: 1000,
                min: -1000,
                step: 1
            },
            intensity: {
                name: 'Intesity',
                max: 2,
                min: 0,
            }
        }
    }

    draw() {
        this.analyze()

        line(
            this.canvasCtx,
            this.dataArray,
            this.analyzer.frequencyBinCount,
            this.props.width,
            this.props.x_offset,
            this.props.y_offset,
            this.props.intensity,
        )
    }
}