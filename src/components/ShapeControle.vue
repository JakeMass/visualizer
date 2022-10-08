<template>
  <div
    v-for="[key, prop] in Object.entries(shape.propsInfo)"
    :key="key" >
    <h3>{{ prop.name }}</h3>
    <select 
      v-if="key === 'type'"
      :value="toRaw(shape).type"
      @change="onTypeChange($event, shape, index)">
      <option
        v-for="item, index in prop.options" 
        :key="index"
        :value="item">
          {{ item.toUpperCase() }}
        </option>
    </select>
    <input 
      v-else
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
import { Line, Circle } from '../utils/shapes'

const props = defineProps({
  shape: Object,
  index: Number,
})

const emit = defineEmits(['shape:change', 'shape:replace'])

function onInput({ target }, shape, key) {
  toRaw(shape).updateProps({
    [`${key}`]: parseFloat(target.value)
  }, true)
}

function onTypeChange({ target }, shape, index) {
  let nType = target.value
  let nShape = null
  let nProps = {
    x_offset: toRaw(shape).props.x_offset,
    y_offset: toRaw(shape).props.y_offset
  }

  switch (nType) {
    case 'line':
      nShape = new Line(toRaw(shape).canvasCtx, toRaw(shape).audioCtx, nProps)
      nShape.connect(toRaw(shape).source)
      break
    case 'circle':
      nShape = new Circle(toRaw(shape).canvasCtx, toRaw(shape).audioCtx, nProps)
      nShape.connect(toRaw(shape).source)
      break
    default:
      break;
  }

  if (nShape) {
    emit('shape:replace', {
      index,
      nShape
    })
  }
}
</script>