<template>
  <div
    class="menu">
    <label 
      for="file_input"
      style="cursor: pointer;">
      <input 
        type="file" 
        id="file_input"
        style="display: none;"
        @change="onFileInput">
        Select File
    </label>
    <audio class="player" id="audio" :src="url" controls @play="onPlay" @pause="onPlay" />
    <div class="controles">
      <div
        v-if="canvas">
        <CanvasControle 
          :canvas="canvas" />
      </div>
      <div 
        v-for="(shape, index) in shapes"
        :key="index"
        class="controle">
        <h3 
          style="cursor: pointer; margin: 7px;"
          @click="onShapeChange(index)">
          {{ toRaw(shape).type }} {{ index + 1 }}
        </h3>
        <ShapeControle 
          class="props"
          v-if="activeShapeIndex === index"
          :shape="shape"
          :index="index"
          @shape:replace="onReplace" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRaw } from 'vue'
import ShapeControle from './ShapeControle.vue'
import CanvasControle from './CanvasControle.vue'

const emit = defineEmits(['file', 'play', 'shape:replace'])
const props = defineProps({
  canvas: HTMLCanvasElement,
  shapes: Array,
  url: String,
})

let activeShapeIndex = ref(-1)

function onShapeChange(index) {
  if (activeShapeIndex.value === index) {
    activeShapeIndex.value = -1
  } else {
    activeShapeIndex.value = index
  }
}

function onPlay() {
  emit('play')
}

function onFileInput({ target }) {
  emit('file', target.files[0])
}

function onReplace(value) {
  console.log(value)
  emit('shape:replace', value)
}
</script>

<style scoped>
.menu {
  display: grid;
  grid-auto-flow: column;
  justify-items: start;
  align-items: start;
  grid-template-rows: auto;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 
    "file player controles" 
    "props props props";
  width: 100%;
  position: absolute;
  top: 0;
}

.file {
  grid-area: file;
}

.player {
  grid-area: player;
  justify-self: stretch;
}

.controles {
  grid-area: controles;
  display: grid;
  grid-auto-flow: column;
}

.controle {
  position: relative;
  z-index: 100;
}

.props {
  grid-area: props;
  display: grid;
  grid-auto-flow: column;
}
</style>