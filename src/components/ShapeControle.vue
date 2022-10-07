<template>
  <div
    v-for="[key, prop] in Object.entries(shape.propsInfo)"
    :key="key" >
    <h3>{{ prop.name }}</h3>
    <input 
      type="range"
      :value="toRaw(shape).props[key]"
      :min="prop.min ?? 0"
      :max="prop.max ?? 1"
      :step="prop.step ?? 0.1"
      @input="onInput($event, shape, key)">
  </div> 
</template>

<script setup>
import { toRaw } from 'vue'

const props = defineProps({
  shape: Object
})

const emit = defineEmits(['shape:change'])

function onInput({ target }, shape, key) {
  toRaw(shape).updateProps({
    [`${key}`]: parseFloat(target.value)
  }, true)
}
</script>