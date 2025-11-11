<template>
  <div class="size-picker" :class="{ 'disabled-state': disabled }">
    <div 
      v-for="size in sizes"
      :key="size.id"
      class="size-option"
      :class="{ selected: selectedSize === size.id }"
      @click="handleSizeClick(size.id)"
    >
      <div class="star-container">
        <img 
          :src="size.baseIcon || '/icons/logo_black.png'" 
          :alt="size.label"
          class="star-icon"
          :style="{ 
            transform: `scale(${getStarScale(size.id)})`,
            width: `${getStarSize(size.id)}px`,
            height: `${getStarSize(size.id)}px`
          }"
        />
      </div>
      <span class="size-label">{{ size.label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sizes: {
      type: Array,
      required: true
    },
    selectedSize: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:selectedSize'],
  methods: {
    handleSizeClick(id) {
      if (!this.disabled) {
        this.$emit('update:selectedSize', id);
      }
    },
    getStarScale(sizeId) {
      const scaleMap = {
        small: 1.2,
        medium: 1.2,
        large: 1.35
      };
      return scaleMap[sizeId] || 1;
    },
    getStarSize(sizeId) {
      const sizeMap = {
        small: 40,
        medium: 50,
        large: 60
      };
      return sizeMap[sizeId] || 45;
    }
  }
}
</script>

<style scoped>
.size-picker {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: left;
}

.size-option {
  width: 100px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
  padding: 10px;
  background: white;
}

.size-option:hover:not(.disabled-state .size-option) {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.size-option.selected {
  border-color: #58bb92;
  box-shadow: 0 0 0 3px rgba(76, 175, 159, 0.349);
  transform: scale(1.15) !important;
}

.star-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  flex: 1;
}

.star-icon {
  transition: all 0.3s ease;
  object-fit: contain;
}

.size-label {
  font-size: 12px;
  text-align: center;
  color: #333;
  font-weight: 500;
  line-height: 1.2;
}

/* Disabled state */
.disabled-state .size-option {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.disabled-state .size-option.selected {
  transform: none;
  background-color: white;
}

@media (max-width: 768px) {
  .size-picker {
    gap: 10px;
  }
  
  .size-option {
    width: 80px;
    height: 100px;
  }
  
  .size-label {
    font-size: 11px;
  }
}
</style>