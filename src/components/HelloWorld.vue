<template>
  <div>
    <HeaderMenu 
      :url="url"
      @file="onFileInput"
      @play="onPlay" />
    <canvas
      id="canvas"
      style="height: 75vh; width: 100vw;"></canvas>
    
    <div 
      v-for="(shape, index) in shapes"
      style="display: flex"
      :key="index">
      <h2>Shape {{ index + 1 }}</h2>
      <div
        v-for="[key, prop] in Object.entries(shape.propsInfo)"
        :key="key" >
        <h3>{{ prop.name }}</h3>
        <input 
          type="range"
          :min="prop.min ?? 0"
          :max="prop.max ?? 1"
          :step="prop.step ?? 0.1"
          @input="onInput($event, shape, key)">
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, toRaw } from 'vue'
import { line, circle } from '../utils/patterns'
import { Circle, Line } from '../utils/shapes'
import HeaderMenu from './HeaderMenu.vue'

let url = ref('')
let file = ref(null)
let audioElem = null
let playing = ref(false)

const audioCtx = new AudioContext()

let canvas = null
let canvasCtx = null

let rotation = ref(0)
let intensity = ref(0)
let angleWidth = ref(360)

let circleShape = null
let lineShape = null

let shapes = ref([])

function onFileInput(input) {
  file.value = input
  url.value = URL.createObjectURL(file.value)
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

function onInput({ target }, shape, key) {
  toRaw(shape).updateProps({
    [`${key}`]: parseFloat(target.value)
  }, true)
}

function audioInit() {
  audioElem = document.getElementById('audio')
  let source = audioCtx.createMediaElementSource(audioElem)
  source.connect(audioCtx.destination)

  canvas = document.getElementById('canvas')
  canvasCtx = canvas.getContext('2d')

  circleShape = new Circle(canvasCtx, audioCtx)
  circleShape.connect(source)

  shapes.value.push(circleShape)

  lineShape = new Line(canvasCtx, audioCtx)
  lineShape.connect(source)

  shapes.value.push(lineShape)

  canvas.height = document.documentElement.clientHeight * window.devicePixelRatio
  canvas.width = document.documentElement.clientWidth * window.devicePixelRatio

  canvas.style.height = canvas.height / window.devicePixelRatio + 'px'
  canvas.style.width = canvas.width / window.devicePixelRatio + 'px'
}

function draw() {
  const drawVisual = requestAnimationFrame(draw)

  if (!playing.value) return

  canvasCtx.translate(0.5, 0.5)
  canvasCtx.fillStyle = '#242424'
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height)

  canvasCtx.lineWidth = 1
  canvasCtx.strokeStyle = 'rgb(200, 200, 200)'
  canvasCtx.beginPath()

  circleShape.draw()
  lineShape.draw()

  canvasCtx.translate(-0.5, -0.5)
}
</script>