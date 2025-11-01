 <template>
  <div class="vk-posts-container">
    <h2 class="section-title">Кто создает звезды?</h2>
    <h3 class="section-title">Меня зовут Надежда, я работаю бутафором в театре кукол. Звёзды - моё хобби</h3>
    <div v-for="post in posts" :key="post.id" class="post-card">
      <div class="post-text">{{ post.text }}</div>
      <div :id="`vk_post_${post.group_id}_${post.post_id}`"></div> 
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      posts: [],
      socket: null
    };
  },
  mounted() {
    this.connectWebSocket();
    this.loadCache(); 
  },
  methods: {
    connectWebSocket() {
      this.socket = new WebSocket('ws://localhost:3001');

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (Array.isArray(data)) {
            this.posts = [...data, ...this.posts].slice(0, 20);
            this.loadWidgets(data);
          }
        } catch (error) {
          console.error('Ошибка парсинга сообщения:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket ошибка:', error);
      };
    },

    async loadCache() {
      try {
        const response = await fetch('http://localhost:3001/api/posts');
        const cache = await response.json();

        if (Array.isArray(cache.posts)) {
          this.posts = cache.posts;
          this.loadWidgets(cache.posts);
        } else {
          console.warn('Неверный формат данных в кэше');
        }
      } catch (err) {
        console.error('Ошибка загрузки кэша:', err);
      }
    },

    loadWidgets(newPosts) {
      newPosts.forEach(post => {
        const widgetId = `vk_post_${post.group_id}_${post.post_id}`;

        this.$nextTick(() => {
          if (window.VK?.Widgets?.Post) {
            window.VK.Widgets.Post(widgetId, post.group_id, post.post_id, post.access_key);
          } else {
            console.warn('VK.Widgets.Post не доступен');
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.vk-posts-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.section-title {
  color: #4a4a4a;
  text-align: center;
  margin-bottom: 30px;
}

.post-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
}

.post-text {
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 15px;
}

.post-media {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
}

.post-image {
  width: 100%;
  border-radius: 8px;
  aspect-ratio: 1;
  object-fit: cover;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.original-link {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
}

.original-link:hover {
  text-decoration: underline;
}
</style> 

