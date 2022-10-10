<template>
  <div>
    <HeaderMenu 
      :canvas="canvas"
      :shapes="shapes"
      :url="url"
      @file="onFileInput"
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
import HeaderMenu from './HeaderMenu.vue'

let url = ref('')
let file = ref(null)
let audioElem = null
let playing = ref(false)

const audioCtx = new AudioContext()
let source = null

let canvas = ref(null)
let canvasCtx = null

let circleShape = null
let lineShape = null

let shapes = ref([])

function onAdd() {
  let nShape = new Circle(canvasCtx, audioCtx)
  nShape.connect(source)
  shapes.value.push(nShape)
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

  lineShape = new Line(canvasCtx, audioCtx)
  lineShape.connect(source)

  shapes.value.push(lineShape)

  canvas.value.height = document.documentElement.clientHeight * window.devicePixelRatio
  canvas.value.width = document.documentElement.clientWidth * window.devicePixelRatio

  canvas.value.style.height = canvas.value.height / window.devicePixelRatio + 'px'
  canvas.value.style.width = canvas.value.width / window.devicePixelRatio + 'px'
}

function draw() {
  const drawVisual = requestAnimationFrame(draw)

  if (!playing.value) return

  canvasCtx.translate(0.5, 0.5)
  canvasCtx.fillStyle = '#242424'
  canvasCtx.fillRect(0, 0, canvas.value.width, canvas.value.height)

  canvasCtx.lineWidth = 1
  canvasCtx.strokeStyle = 'rgb(200, 200, 200)'
  canvasCtx.beginPath()

  shapes.value.forEach(shape => toRaw(shape).draw())

  canvasCtx.translate(-0.5, -0.5)
}
</script>