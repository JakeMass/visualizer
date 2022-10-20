import { circle, line } from'./patterns'

class Shape {
    #props
    #dataArray
    #audioCtx
    #canvasCtx
    #type
    #source

    constructor(canvasCtx, audioCtx, type, props) {
        this.#canvasCtx = canvasCtx
        this.#audioCtx = audioCtx
        this.#type = type
        this.#props = {
            resolution: 2048, 
            red: 255,
            green: 255,
            blue: 255,
            lineWeight: 1,
            ...props
        }

        this.analyzer = new AnalyserNode(this.#audioCtx, {
            fftSize: this.#props.resolution
        })

        this.#dataArray = new Uint8Array(this.analyzer.frequencyBinCount)
    }

    get basePropInfo() {
        return {
            type: {
                name: 'Type',
                options: [
                    'line',
                    'circle',
                ],
            },
            red: {
                name: 'Red',
                max: 255,
                min: 0,
                step: 1
            },
            green: {
                name: 'Green',
                max: 255,
                min: 0,
                step: 1
            },
            blue: {
                name: 'Blue',
                max: 255,
                min: 0,
                step: 1
            },
            lineWeight: {
                name: 'Line Weight',
                max: 255,
                min: 0,
                step: 1
            },
        }
    }

    get props() {
        return this.#props
    }

    get type() {
        return this.#type
    }

    get dataArray() {
        return this.#dataArray
    }

    get canvasCtx() {
        return this.#canvasCtx
    }

    get audioCtx() {
        return this.#audioCtx
    }

    get source() {
        return this.#source
    }

    connect(source) {
        this.analyzer.disconnect()
        source.connect(this.analyzer)

        this.#source = source
    }

    analyze() {
        this.analyzer.getByteTimeDomainData(this.#dataArray)
    }

    updateProps(props) {
        this.#props = {
            ...this.#props,
            ...props,
        }

        if (props.resolution) {
            this.analyzer.fftSize = Math.pow(2, props.resolution)
        }
    }

    initDraw(mutator = null) {
        if (mutator) {
            mutator.mutate(this)
        }

        this.canvasCtx.lineWidth = this.props.lineWeight;
        this.canvasCtx.strokeStyle = `rgb(${this.props.red},${this.props.green},${this.props.blue})`
    }
}

export class Circle extends Shape {

    constructor(canvasCtx, audioCtx, props = {}) {
        super(canvasCtx, audioCtx, 'circle', {
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
            ...this.basePropInfo,
            radius: {
                name: 'Radius',
                max: 1000,
                min: 1,
                step: 1,
            },
            resolution: {
                name: 'Resolution',
                max: 15,
                min: 5,
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

    draw(mutator = null) {
        this.analyze()
        this.initDraw(mutator)
        this.canvasCtx.beginPath()
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
        this.canvasCtx.stroke()
    }
}

export class Line extends Shape {

    constructor(canvasCtx, audioCtx, props = {}) {
        super(canvasCtx, audioCtx, 'line', {
            width: 600,
            x_offset: 0,
            y_offset: 0,
            intensity: 0.5,
            ...props,
        })
    }

    get propsInfo() {
        return {
            ...this.basePropInfo,
            width: {
                name: 'Width',
                max: 10000,
                min: 1,
                step: 1,
            },
            resolution: {
                name: 'Resolution',
                max: 15,
                min: 5,
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
        this.initDraw()

        this.canvasCtx.beginPath()
        line(
            this.canvasCtx,
            this.dataArray,
            this.analyzer.frequencyBinCount,
            this.props.width,
            this.props.x_offset,
            this.props.y_offset,
            this.props.intensity,
        )
        this.canvasCtx.stroke()
    }
}