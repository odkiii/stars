<template>
  <div class="material-picker">
    <div 
      v-for="item in colors"
      :key="item.id"
      class="material-option"
      :class="{ selected: isSelected(item), 'disabled-option': disabled }"
      @click="selectItem(item)"
    >
      <img
        :src="item.preview"
        :alt="item.name"
        class="material-image"
      >

    </div>
  </div>
</template>

<script>
export default {
  props: {
    colors: {
      type: Array,
      required: true,
    },
    modelValue: String,
    disabled: Boolean
  },
  computed: {
    items() {
      return this.colors;
    }
  },
  methods: {
    isSelected(item) {
      return this.modelValue === item.id;
    },
    selectItem(item) {
      if (!this.disabled) {
        this.$emit('update:modelValue', item.id);
      }
    }
  }
}
</script>

<style scoped>
.material-picker {
  display: flex;
  gap: 10px;
  
}

.material-option {
  width: 110px;
  cursor: pointer;
  text-align: center;
}

.material-image {
  width: 100px;
  height: 100px;
  border-radius: 16px;
  border: 2px solid transparent;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  object-fit: cover;
}

.material-name {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  color: #333;
}

.material-option:hover .material-image {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.material-option.selected .material-image {
  border-color: #58bb92;
  box-shadow: 0 0 0 3px rgba(76, 175, 159, 0.349);
  transform: scale(1.09) !important;

}

.disabled-option {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}
</style>