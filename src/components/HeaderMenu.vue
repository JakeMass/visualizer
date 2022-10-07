<template>
  <div>
    <input 
      type="file" 
      ref="file_input"
      @change="onFileInput">
    <audio id="audio" :src="url" controls @play="onPlay" @pause="onPlay" />
    <div 
      v-for="(shape, index) in shapes"
      style="display: flex"
      :key="index">
      <h2 @click="onShapeChange(index)">Shape {{ index + 1 }}</h2>
      <ShapeControle 
        v-if="activeShapeIndex === index"
        :shape="shape" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ShapeControle from './ShapeControle.vue'

const emit = defineEmits(['file', 'play'])
const props = defineProps({
  shapes: Array,
  url: String
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
</script>