export class Mutator {
    #mutFunction
    #props

    constructor(mutFunction, props = {}) {
        this.#mutFunction = mutFunction
        this.#props = props
    }

    mutate(value) {
        this.#mutFunction(value, this.#props)
    }

    updateProps(props) {
        this.#props = {
            ...this.#props,
            ...props
        }
    }
}