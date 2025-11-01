<template>
  <div class="accessories-picker" :class="{ 'disabled-state': disabled }">
    <div 
      v-for="item in accessories"
      :key="item.id"
      class="accessory-option"
      :class="{ selected: selectedAccessory === item.id }"
      @click="handleAccessoryClick(item.id)"
    >
      <img :src="item.icon" :alt="item.name" class="accessory-icon">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    accessories: {
      type: Array,
      required: true
    },
    selectedAccessory: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:selectedAccessory'],
  methods: {
    handleAccessoryClick(id) {
      if (!this.disabled) {
        this.$emit('update:selectedAccessory', id === this.selectedAccessory ? '' : id);
      }
    }
  }
};
</script>

<style scoped>
.accessories-picker {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.accessory-option {
  width: 100px;
  height: 100px;
  border-radius: 15px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.accessory-option.selected {
  border-color: #58bb92;
  box-shadow: 0 0 0 3px rgba(76, 175, 159, 0.349);
  transform: scale(1.09) !important;
}

.accessory-option:hover:not(.disabled-state .accessory-option) {
  transform: scale(1.05);
}

.accessory-icon {
  width: 100%;
  height: 100%;
  border-radius: 13px;
  object-fit: cover;
}

/* Disabled state */
.disabled-state .accessory-option {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.disabled-state .accessory-option.selected {
  transform: none;
  box-shadow: none;
}
</style>