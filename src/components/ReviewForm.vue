<template>
  <form @submit.prevent="submitReview" class="review-form">
    <h3>Оставить отзыв</h3>

    <input v-model="author" type="text" placeholder="Ваше имя" required />

    <textarea v-model="text" placeholder="Ваш отзыв..." required></textarea>

    <StarRating v-model="rating" />

    <button type="submit">Отправить</button>
  </form>
</template>

<script>
import StarRating from '@/components/StarRating.vue';

export default {
  components: {
    StarRating
  },
  data() {
    return {
      text: '',
      author: '',
      rating: 0
    };
  },
  methods: {
    submitReview() {
      if (this.rating === 0) {
        alert('Пожалуйста, выберите рейтинг!');
        return;
      }

      this.$emit('submit-review', {
        author: this.author,
        text: this.text,
        rating: Number(this.rating)
      });

      this.text = '';
      this.author = '';
      this.rating = 0;
    }
  }
};
</script>

<style scoped>
.review-form {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.review-form h3 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

input,
textarea {
  width: 100%;
  max-width: 570px;
  padding: 12px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
}

textarea {
  min-height: 120px;
  font-family: inherit;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}
</style>