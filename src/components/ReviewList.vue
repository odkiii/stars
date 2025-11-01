<template>
  <div class="review-list">
    <div v-if="reviews.length === 0" class="no-reviews">
      <p>Пока нет отзывов.</p>
    </div>
    <div v-else>
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <div class="review-header">
          <strong>{{ review.author }}</strong>
          <span class="review-date">{{ formatDate(review.created_at) }}</span>
        </div>
        <div class="review-stars">
          <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">
            ★
          </span>
        </div>
        <p class="review-text">{{ review.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ru-RU', options);
    }
  }
};
</script>

<style scoped>
.review-list {
  max-width: 800px;
  margin: 2rem auto;
}

.no-reviews {
  text-align: center;
  padding: 2rem;
  color: #777;
}

.review-card {
  background: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.review-date {
  font-size: 0.9rem;
  color: #888;
}

.review-stars {
  margin-bottom: 0.75rem;
}

.star {
  font-size: 1.2rem;
  color: #ddd;
  margin-right: 4px;
}

.star.filled {
  color: #fdd835;
}

.review-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
}
</style>