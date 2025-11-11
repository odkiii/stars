<template>
  <div class="landing">
    <div class="seo-content" style="position:absolute; left:-9999px">
      <h1>Звезда на ёлку ручной работы - главное украшение праздника</h1>
      <h2>Почему звезда на ёлку так важна?</h2>
      <p>Каждая семья выбирает особую звезду для верхушки ёлки - это символ надежды и волшебства. Наши авторские звёзды ручной работы станут семейной реликвией, которую будут передавать из поколения в поколение.</p>
      <p>Купить звезду на елку ручной работы это значит восстановить традицию предков. Каждый уважающий себя семьянин должен иметь на елке красивую рождественскую звезду.</p>
      <p>Новогодние звезды вифлеемские - способ вспомнить традиции.</p>
      <p>Создать звезду на елку или собрать звезду на елку - одно из необычных совеременных решений. На нашем сайте можно создать свою звезду на елку и заказать звезду на елку.</p>
    </div>
    <section class="section hero-section" data-theme="light">
      <!-- Левая часть с картинкой -->
      <div class="hero-grid-container">
        <div class="hero-image">
          <img src="/stars/hero_star.png" alt="Hero Star" />
        </div>

        <!-- Правая часть с текстом -->
        <div class="hero-content">
          <h1 class="special"><span class="special-font">Авторские</span></h1>
          <h2>ЗВЕЗДЫ</h2>
          <div class="button-group">
            <router-link to="/products" class="btn btn-primary">ВЫБРАТЬ</router-link>
            <router-link to="/create" class="btn  btn-secondary">СОЗДАТЬ СВОЮ</router-link>

          </div>
        </div>
      </div>
      <div class="scroll-indicator" @click="scrollToNextSection">
        <div class="scroll-arrow">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="scroll-text">Листайте вниз</span>
      </div>
    </section>

    <!-- Блок 2 -->
    <section class="section tree-section" data-theme="dark">
      <h2>Каждая звезда создается <span class="special-font-tree">вручную</span></h2>
      <h3>Это не просто украшение — это семейная традиция, <br>которую вы будете передавать из поколения в поколение.</h3>
      <h4>Яркая, уникальная, подойдёт любой ёлке — от скромной до роскошной.</h4>
    </section>


    <div class="choice-bg-wrapper">
      <section class="section choice-section" data-theme="dark">

        <div class="choices-header-wrapper">
          <h1 class="choices-header">КУПИТЬ</h1>
        </div>    

        <div class="choices-container">
          <!-- Вариант 1: Товары -->
          <div class="choice-item">
            <div class="choice-image">
              <img src="/stars/products_stars.png" alt="Готовые звезды">
            </div>
            <h3>ТОВАРЫ</h3>
            <p>Звезды, готовые к отправке</p>
            <div class="button-choice">
              <router-link to="/products" class="btn btn-choice">ВЫБРАТЬ</router-link>
            </div>
            
          </div>
          
          <!-- Вариант 2: Создание -->
          <div class="choice-item">
            <div class="choice-image">
              <img src="/stars/silver_star.png" alt="Создание звезды">
            </div>
            <h3>СОЗДАНИЕ</h3> 
            <p>Создайте что-то новое</p>
            <div class="button-choice">
              <router-link to="/create" class="btn btn-choice">ВЫБРАТЬ</router-link>
            </div>
          </div>
        </div>
    </section>
    <div class="stick-wrapper">
      <img src="/stars/stick.png" alt="Хвойная ветвь" class="stick-decoration">
    </div>

    </div>
    <!-- Блок 3 -->
    

    

  </div>
</template>

<script setup>
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProductCollection",
  "name": "Новогодние звёзды ручной работы",
  "description": "Уникальные макушки для ёлки созданные вручную",
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Product",
        "name": "Звезда на ёлку 'Семейная традиция'",
        "description": "Ручная работа макушки для новогодней ёлки",
        "category": "Новогодние украшения"
      }
    }
  ]
}

const scrollToNextSection = () => {
  const nextSection = document.querySelector('.tree-section')
  if (nextSection) {
    nextSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script>

<style>
.section {
  scroll-snap-align: start;
  display: flex;     /* чтобы контент центрировать */
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>

<style scoped>
@import url('@/assets/fonts.css');

.landing {
  min-height: 100vh;
  padding-top: var(--header-height-mobile, 60px); /* чтобы контент не заезжал */

}


.hero-section {
  display: flex;
  justify-content: center;
  position: relative;
  /* overflow: hidden; */
  margin: 0;
  padding: 0 2.5rem;
  box-sizing: border-box;

}

.hero-grid-container {
  max-width: var(--max-site-width, 1200px);
  width: 100%;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  align-items: center;
  padding: 2.5rem 0;
  padding-bottom: 0;
  box-sizing: border-box;
}

/* Левая картинка и правая колонка */
.hero-image {
  grid-column: 1 / 7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image img {
  height: 100%;
  object-fit: contain;
}

.hero-content {
  grid-column: 8 / 13; /* Занимает колонки 8-12 (5 колонок) */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding: 0;
  box-sizing: border-box;
}

.special-font {
  font-family: 'Miss Katherine', cursive;
  font-size: clamp(48px, 18vw, 270px);
  line-height: 0.95;
  color: #6b0630;
  display: block;
  margin: 0;
  font-weight: 400;
  overflow: hidden;
  margin-bottom: -5rem;
}

.hero-content h2 {
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(28px, 7.5vw, 105px);
  font-weight: 800;
  margin: -0.2rem 0 0.6rem 0;
  color: #6b0630;
  line-height: 0.95;
}
.scroll-indicator {
  position: absolute;
  bottom: 200px;
  left: 75%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  animation: fadeInUp 1s ease-out 1s both;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.scroll-indicator:hover {
  opacity: 1;
  transform: translateX(-50%) translateY(-5px);
}

.scroll-arrow {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #6b0630;
  border-radius: 50%;
  color: #6b0630;
  margin-bottom: 8px;
  animation: bounce 2s infinite;
  transition: all 0.3s ease;
}

.scroll-indicator:hover .scroll-arrow {
  background: #6b0630;
  color: white;
  transform: scale(1.1);
}

.scroll-text {
  font-size: 14px;
  color: #6b0630;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Анимация появления */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 0.8;
    transform: translateX(-50%) translateY(0);
  }
}

/* Анимация подпрыгивания */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.button-group {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}
.btn {
  padding: 0.9rem 2rem;
  border-radius: 100px;
  font-weight: 700;
  font-size: clamp(14px, 2vw, 20px);
  cursor: pointer;
  border: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  white-space: nowrap;
}

.btn-primary { background: #6b0630; color: white; }
.btn-secondary { background: #e9ebec; color: #6b063081; border: 3px solid rgba(107,6,48,0.14); }
/* ---------- TREE SECTION ---------- */
/* Убираем абсолютные позиции — распределим тексты по высоте секции */
.tree-section {
  position: relative;
  min-height: 100vh;
  background-image: url('/stars/back_tree.png');
  background-size: cover;
  background-position: center;
  text-align: center;
  color: white;
  /* overflow: hidden; */
  padding: 0;
  margin: 0;
}

/* Абсолютное позиционирование каждого текста */
.tree-section h2,
.tree-section h3,
.tree-section h4 {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  margin: 0;
  font-weight: 300;
  font-size: clamp(20px, 4vw, 30px);

}

/* Расположение по вертикали */
.tree-section h2 {
  top: 29%;

  vertical-align: middle;

}
.tree-section h3 {
  top: 50%;
}
.tree-section h4 {
  top: 70%;
}

/* special font */
.special-font-tree {
  font-family: 'Miss Katherine', cursive;
  vertical-align: middle;
  font-size: clamp(28px, 12vw, 150px);
  color: #ffffff;
  line-height: 0.9;
  display: inline-block;
}

.hero-image img { display:block; }

.choice-bg-wrapper {
  position: relative;
  width: 100%;
  /* высота контрольная — можно подогнать, сейчас 100vh чтобы палка тянулась на экран */
  min-height: 70vh; /* подстрой по желанию: 60vh/80vh/100vh */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.choices-header {
  color: #eee;
  font-size: clamp(24px, 6vw, 50px);
  text-align: center;
  margin: 0;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.choices-header-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 2rem 0 2rem 0;
  z-index: 3;
}

.choice-bg-wrapper .choice-section {
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column; /* Меняем на колонку */
  justify-content: center;
  align-items: center;
  background: transparent;
  padding: 2.5rem 1rem;
  box-sizing: border-box;
}

/* Палка — абсолютный фон, растягивается на всю обёртку */
.choice-bg-wrapper .stick-wrapper {
  position: absolute;
  inset: 0;              /* top:0; right:0; bottom:0; left:0; */
  z-index: 1;            /* ниже секции */
  pointer-events: none;  /* чтобы палка не мешала кликам по карточкам */
  overflow: hidden;
  display: block;
}

/* Само изображение палки — тянем, но сохраняем aspect */
.choice-bg-wrapper .stick-decoration {
  position: absolute;
  top: 50%; /* 50% */
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;   /* немного перекрываем по ширине, подстраивай */
  height: 100%;
  max-height: 120%;
  object-fit: cover;
  opacity: 1; /* подстраивай при желании */
  filter: none;
}

/* Немного поправим контейнер карточек — чтобы были по центру и не налезали */
.choice-bg-wrapper .choices-container {
  position: relative;
  z-index: 3; /* ещё выше внутри секции */
  max-width: 920px;
  display: flex;
  gap: 2rem;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 auto;
}

/* Удерживаем визуальные паддинги от хедера/других секций */
.section.choice-section { padding-top: 3rem; padding-bottom: 3rem; }


/* уменьшаем вертикальные паддинги внутри item, чтобы оба выбора помещались полностью */
.choice-item {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 30px;
  padding: 1.2rem;
  text-align: center;
  width: 100%;
  max-width: 300px;
}

.choice-image { margin-bottom: 0.6rem; }
.choice-image img { width: 100%; height: auto; object-fit: contain; }

.choice-item h3 { font-size: clamp(18px, 4vw, 26px); margin: 0.2rem 0; color:#2F553D; }
.choice-item p  { font-size: clamp(14px, 3vw, 18px); margin: 0.25rem 0 0.8rem; color:#555; }

.button-choice { margin: 0.6rem 0 0; }
.btn-choice {
  padding: 0.7rem 1.6rem;
  font-size: clamp(14px, 2.2vw, 16px);
  border: 2px solid #2F553D;
  background: white;
  color: #2F553D;
  border-radius: 12px;
  width: 100%;
  border-radius: 25px;
  box-sizing: border-box;
  display: block;
}
.btn-choice:hover { background:#2F553D; color:white; }

footer { position: relative; z-index: 10; }

/* ---------- MOBILE VERSION ---------- */
@media (max-width: 768px) {
  .hero-section {
    padding: 0;
    margin-bottom: 0;
    padding-bottom: 0;
    height: auto;
    min-height: 100vh;
  }

  .hero-grid-container {
    display: flex;
    flex-direction: column;
    padding: 0;
    gap: 0;
    height: 100vh;
  }

  .hero-image {
    width: 100%;
    height: 67vh;
    position: relative;
    order: 1;
  }

  .hero-image img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .hero-content {
    position: relative;
    width: 100%;
    height: 33vh;
    background: rgba(255,255,255);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    order: 2;
  }

  .special-font {
    font-size: clamp(40px, 30vw, 270px);
    text-align: center;
    overflow: hidden;
    margin-bottom: -50px;
  }

  .special {
    display: block;
    height: 6rem;
    overflow: hidden;
    line-height: 1;
    margin-top: -1rem;
  }

  .hero-content h2 {
    font-size: clamp(28px, 10vw, 105px);
    text-align: center;
    margin-top: -0.2rem;
  }

  .button-group {
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .btn {
    font-size: clamp(14px, 3.5vw, 18px);
    padding: 0.5rem 1.2rem;
    width: auto;
    min-width: 180px;
    text-align: center;
  }


  .stick-decoration {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 0;
    transform: none;
    object-fit: contain;
    
  }

  /* TREE */
  .tree-section {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: auto;
    min-height: 100vh;
    padding: 0 1rem;
    margin-top: 0;
    padding-top: 0;
  }
  .tree-section h2 { font-size: clamp(20px, 6vw, 32px); }
  .tree-section h3 { font-size: clamp(16px, 4.5vw, 22px); }
  .tree-section h4 { font-size: clamp(14px, 3.5vw, 18px); }

  /* CHOICE */
  .choices-container {
    flex-direction: column;
    align-items: center;
  }
  .choice-item {
    max-width: 90%;
    width: 100%;
    box-sizing: border-box;
    padding: 1rem;
  }
  .choice-image img {
    max-height: 180px;
    object-fit: contain;
  }
  .choice-section {
    padding: 0;
  }
  .btn-choice {
    max-width: 100%;
    width: auto;
    display: inline-block;
  }
}
@media (min-width: 769px) and (max-width: 1024px) {
  .hero-grid-container {
    grid-template-columns: repeat(12, 1fr);
    gap: 1rem;
  }

  .hero-image {
    grid-column: 1 / 7;
  }

  .hero-content {
    grid-column: 7 / 13;
    padding: 0 1rem;
  }

  .special-font {
    font-size: clamp(42px, 12vw, 200px);
    margin-bottom: -4rem;
  }

  .hero-content h2 {
    font-size: clamp(24px, 6vw, 80px);
  }
}
</style>
