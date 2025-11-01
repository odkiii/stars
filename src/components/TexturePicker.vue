<template>
  <div class="textures-picker" :class="{ 'disabled-state': disabled }">
    <div 
      v-for="texture in textures"
      :key="texture.id"
      class="texture-option"
      :class="{ selected: selectedTexture === texture.id }"
      @click="handleTextureClick(texture.id)"
    >
      <img :src="texture.icon" :alt="texture.id" class="texture-icon">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    textures: {
      type: Array,
      required: true
    },
    selectedTexture: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:selectedTexture'],
  methods: {
    handleTextureClick(id) {
      if (!this.disabled) {
        this.$emit('update:selectedTexture', id);
      }
    }
  }
}
</script>

<style scoped>
.textures-picker {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.texture-option {
  width: 100px;
  height: 100px;
  border-radius: 15px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.texture-option.selected {
  border-color: #58bb92;
  box-shadow: 0 0 0 3px rgba(76, 175, 159, 0.349);
  transform: scale(1.09) !important;
}

.texture-option:hover:not(.disabled-state .texture-option) {
  transform: scale(1.05);
}

.texture-icon {
  width: 100%;
  height: 100%;
  border-radius: 13px;
  object-fit: cover;
}

/* Disabled state */
.disabled-state .texture-option {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.disabled-state .texture-option.selected {
  transform: none;
  box-shadow: none;
}
</style>