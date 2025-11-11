<template>
  <div class="reviews">
    <h1>Отзывы наших покупателей</h1>
    <ReviewForm @submit-review="addReview" />
    <ReviewList :reviews="reviews" />
  </div>
</template>

<script>
import ReviewList from '@/components/ReviewList.vue';
import ReviewForm from '@/components/ReviewForm.vue';

export default {
  components: { ReviewList, ReviewForm },
  data() {
    return {
      reviews: []
    };
  },
  async created() {
    try {
      const response = await fetch('api/reviews');
      if (!response.ok) throw new Error('Не удалось загрузить отзывы');

      this.reviews = await response.json();
    } catch (err) {
      console.error('Ошибка загрузки отзывов:', err);
    }
  },
  methods: {
    async addReview(newReview) {
      try {
        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReview)
        });

        if (!response.ok) throw new Error('Не удалось сохранить отзыв');

        const savedReview = await response.json();
        this.reviews.unshift(savedReview);
      } catch (err) {
        console.error('Ошибка при отправке отзыва:', err);
        alert('Не удалось отправить отзыв.');
      }
    }
  }
};
</script>

<style scoped>
.reviews {
  padding: 2rem;
  background-color: #f5f5f5;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}
</style>