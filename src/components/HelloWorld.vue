<template>
  <div>
    <HeaderMenu 
      :canvas="canvas"
      :shapes="shapes"
      :url="url"
      @file="onFileInput"
      @opacity:change="onOpacityChange"
      @play="onPlay"
      @shape:replace="onReplace"
      @shape:delete="onDelete"
      @shape:add="onAdd" />
    <canvas
      id="canvas"
      style="height: 75vh; width: 100vw; z-index: -1"></canvas>
  </div>
</template>

<script setup>
import { ref, toRaw } from 'vue'
import { Circle, Line } from '../utils/shapes'
import { Mutator } from '../utils/mutators'
import HeaderMenu from './HeaderMenu.vue'

let url = ref('')
let file = ref(null)
let audioElem = null
let playing = ref(false)

const audioCtx = new AudioContext()
let source = null

let canvas = ref(null)
let canvasCtx = null
let opacity = ref(1)

let circleShape = null
let lineShape = null

let mutator = new Mutator((shape, props) => {
  if (props.index >= 256) {
    props.color += 1

    if (props.color == 3) {
      props.color = 0;
    }

    props.index = 0
  }

  let color = props.colors[props.color]

  let prevIndex = props.color > 0 
    ? props.color - 1
    : 2

  let prevColor = props.colors[prevIndex]

  shape.updateProps({
    [`${color}`]: 255 - props.index,
    [`${prevColor}`]: 0 + props.index
  })

  props.index += props.step
}, {
  index: 0,
  color: 0,
  colors: ['red', 'green', 'blue'],
  step: 1,
})

let shapes = ref([])

function onAdd() {
  let nShape = new Circle(canvasCtx, audioCtx)
  nShape.connect(source)
  shapes.value.push(nShape)
}

function onOpacityChange(value) {
  opacity.value = value
}

function onDelete(index) {
  shapes.value.splice(index, 1)
}

function onFileInput(input) {
  file.value = input
  url.value = URL.createObjectURL(file.value)
}

function onReplace({ index, nShape }) {
  shapes.value.splice(index, 1, nShape)
}

function onPlay() {
  if (!audioElem) {
    audioInit()
    draw()
  }

  if (playing.value) {
    audioElem.pause()
  } else {
    audioElem.play()
  }

  playing.value = !playing.value
}

function audioInit() {
  audioElem = document.getElementById('audio')
  source = audioCtx.createMediaElementSource(audioElem)
  source.connect(audioCtx.destination)

  canvas.value = document.getElementById('canvas')
  canvasCtx = canvas.value.getContext('2d')

  circleShape = new Circle(canvasCtx, audioCtx)
  circleShape.connect(source)

  shapes.value.push(circleShape)

  // lineShape = new Line(canvasCtx, audioCtx)
  // lineShape.connect(source)

  // shapes.value.push(lineShape)

  canvas.value.height = document.documentElement.clientHeight * window.devicePixelRatio
  canvas.value.width = document.documentElement.clientWidth * window.devicePixelRatio

  canvas.value.style.height = canvas.value.height / window.devicePixelRatio + 'px'
  canvas.value.style.width = canvas.value.width / window.devicePixelRatio + 'px'
}

function draw() {
  const drawVisual = requestAnimationFrame(draw)

  if (!playing.value) return

  canvasCtx.translate(0.5, 0.5)
  canvasCtx.fillStyle = `rgba(0, 0, 0, ${opacity.value})`
  canvasCtx.fillRect(0, 0, canvas.value.width, canvas.value.height)
  mutator.updateProps({
    step: Math.random() * 255
  })
  shapes.value.forEach(shape => toRaw(shape).draw(mutator))

  canvasCtx.translate(-0.5, -0.5)
}
</script>