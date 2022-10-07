<template>
  <div>
    <input 
      type="file" 
      ref="file_input"
      @change="onFileInput">
    <audio id="audio" :src="url" controls @play="onPlay" @pause="onPlay" />
  </div>
</template>

<script setup>
const emit = defineEmits(['file', 'play'])
const props = defineProps({
  url: String
})

function onPlay() {
  emit('play')
}

function onFileInput({ target }) {
  emit('file', target.files[0])
}
</script>