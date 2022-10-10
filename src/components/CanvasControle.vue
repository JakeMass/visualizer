<template>
  <div>
    <input 
      type="range"
      :value="width"
      :max="maxWidth"
      :min="100"
      @input="onWidthChange">
    <input 
      type="range"
      :value="height"
      :max="maxHeight"
      :min="100"
      @input="onHeightChange">
    <input 
      type="range"
      :value="opacity"
      :max="1"
      :min="0"
      step="0.01"
      @input="onOpacityChange">
  </div>
</template>

<script setup>
const props = defineProps({
  canvas: HTMLCanvasElement,
})

const emit = defineEmits(['opacity:change'])

const maxWidth = document.documentElement.clientWidth * window.devicePixelRatio * 2
const maxHeight = document.documentElement.clientHeight * window.devicePixelRatio * 2

let width = canvas.width * window.devicePixelRatio
let height = canvas.height * window.devicePixelRatio

function onWidthChange({ target }) {
  onChange(target.valueAsNumber, height)
}

function onHeightChange({ target }) {
  onChange(width, target.valueAsNumber)
}

function onOpacityChange({ target }) {
  emit('opacity:change', target.valueAsNumber)
}

function onChange(nWidth, nHeight) {
  width = nWidth
  height = nHeight

  canvas.height = height * window.devicePixelRatio
  canvas.width = width * window.devicePixelRatio

  canvas.style.height = canvas.height / window.devicePixelRatio + 'px'
  canvas.style.width = canvas.width / window.devicePixelRatio + 'px'
}
</script>