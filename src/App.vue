<!-- src/App.vue -->
<template>
  <div class="allsite">
    <header>
      <div class="liquid-glass-wrapper">
        <div class="liquid-glass-effect"></div>
        <div class="liquid-glass-tint"></div>
        <div class="liquid-glass-shine"></div>

        <div class="liquid-glass-content">
          <nav class="nav-bar">

            <!-- <router-link to="/info" class="logo">
                <img src="/icons/logo.png" alt="★" class="icons" />
              </router-link> -->

            <div class="nav-links">

              <div class="desktop-menu">
                <router-link to="/info" class="nav-link">О ЗВЕЗДАХ</router-link>
                <router-link to="/create" class="nav-link">СОБРАТЬ ЗВЕЗДУ</router-link>
                <router-link to="/products" class="nav-link">ТОВАРЫ</router-link>
                <router-link to="/cart" class="nav-link">КОРЗИНА</router-link>
                <router-link to="/profile" class="nav-link">ПРОФИЛЬ</router-link>
             </div>

            </div>
             <button class="menu-toggle"  @click="toggleMenu">☰</button>

             
          </nav>
        </div>
      </div>
    </header>
    <!-- Мобильное меню -->
    <nav class="mobile-menu" :class="{ active: isMenuOpen }">
      <button class="close-menu" @click="closeMenu">×</button>
      <router-link to="/info" class="nav-link" @click="closeMenu">О ЗВЕЗДАХ</router-link>
      <router-link to="/create" class="nav-link" @click="closeMenu">СОБРАТЬ ЗВЕЗДУ</router-link>
      <router-link to="/products" class="nav-link" @click="closeMenu">ТОВАРЫ</router-link>
      <router-link to="/cart" class="nav-link" @click="closeMenu">КОРЗИНА</router-link>
      <router-link to="/profile" class="nav-link" @click="closeMenu">ПРОФИЛЬ</router-link>
    </nav>

    <main>
      <!-- основной скролл должен быть единым (браузерный) - НЕ создаём внутри себя overflow -->
      <div class="app-container" ref="pageContainer">
        <router-view />
      </div>

      <!-- Footer как обычная секция -->
      <Footer v-if="!route.path.includes('/create')" />
    </main>
  </div>
</template>

<script setup>
import Footer from "@/components/Footer.vue";
import { onMounted, onBeforeUnmount, nextTick, watch, ref } from "vue";
import { useRoute } from "vue-router";


const route = useRoute();
const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
  document.body.classList.toggle("menu-open", isMenuOpen.value);
}
function closeMenu() {
  isMenuOpen.value = false;
  document.body.classList.remove("menu-open");
}

let observer = null;
let lenisInstance = null;

function initObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  const header = document.querySelector("header");
  if (!header) return;

  // наблюдаем только элементы, у которых явно указан data-theme
  const targets = Array.from(document.querySelectorAll("[data-theme]"));

  if (!targets.length) {
    header.removeAttribute("data-theme");
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      // берём наиболее видимый элемент (могут приходить несколько)
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const theme = entry.target.dataset.theme || "light";
          header.setAttribute("data-theme", theme);
        }
      });
    },
    { threshold: 0.55 } // 55% видимости — надёжный выбор
  );

  targets.forEach((t) => observer.observe(t));
}

onMounted(async () => {
  // init observer after initial render
  await nextTick();
  initObserver();

  // Обновлять наблюдателя при смене route (в случае динамической загрузки секций)
  watch(
    () => route.fullPath,
    async () => {
      // даём компоненту время на рендер
      await nextTick();
      // небольшая задержка — чтобы DOM успел вставиться
      setTimeout(initObserver, 80);
    }
  );

  // Lenis (необязательно): плавный скролл. Динамический импорт безопаснее.
  try {
    const mod = await import("@studio-freight/lenis");
    const Lenis = mod.default ?? mod;
    
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      normalizeWheel: true,
      infinite: false,
    });

    let rafId;
    function raf(time) {
      if (lenisInstance) {
        lenisInstance.raf(time);
      }
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Сохраняем ID для очистки
    lenisInstance.rafId = rafId;

  } catch (e) {
    console.warn('Lenis not available', e);
  }
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
  
  // Правильная очистка Lenis
  if (lenisInstance) {
    if (lenisInstance.rafId) {
      cancelAnimationFrame(lenisInstance.rafId);
    }
    if (lenisInstance.destroy) {
      lenisInstance.destroy();
    }
    lenisInstance = null;
  }
});

</script>

<style>
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: center; /* лого слева, ссылки и меню справа */
  padding: 0 1.5rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem; /* расстояние между лого и ссылками */
}

.logo img {
  height: 40px;
  display: block;

}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.menu-toggle {
  display: none;
}

/* на мобилке */
@media (max-width: 768px) {
  .nav-links { display: none; }
  .menu-toggle { display: block; }
}

/* переключение цвета навигации через data-theme у header */
header[data-theme="light"] .nav-link {
  color: #6b0630;
}
header[data-theme="dark"] .nav-link {
  color: #daf8ed;
}
* {
  box-sizing: border-box;
}

/* базовые глобальные стили, минимально переработанные */
html,
body,
#app {
  height: 100%;
  scroll-behavior: smooth;

  
}
body {
  margin: 0;
  font-family: "Montserrat", sans-serif;
  background-color: #eeeced;
  color: #222;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.nav-link {
  color: var(--nav-color);
  text-decoration: none;
  transition: color .25s ease;
}

/* header фиксирован сверху — учитывай это при min-height секций */
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 88px; /* если меняешь — синхронизируй в CSS секций */
  align-items: center;
}

/* основной поток */
main {
  margin-top: 88px; /* чтобы контент не прятался за header */
}

/* .app-container {
  min-height: calc(100vh - 88px);
} */


</style>

<style scoped>

.icons{
  max-height: 35px;

}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

p {
  line-height: 1.6;
  margin-bottom: 20px;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* Liquid Glass Header Styles */
header {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  /* padding: 15px 20px; */ 
}

.liquid-glass-wrapper {
  /* border-radius: 20px; */
  backdrop-filter: blur(10px);
  /* background: rgba(75, 5, 5, 0.7); */
  /* box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); */
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.5s ease;
  position: relative;
  overflow: hidden;
}

.liquid-glass-wrapper:hover { 
  /* background: rgba(75, 5, 5, 0.8); */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.liquid-glass-effect {
  position: absolute;
  inset: 0;
  z-index: 0;
  filter: url(#glass-distortion);
  /* border-radius: 20px;
    */
}

.liquid-glass-tint {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(255, 255, 255, 0.1);
  /* border-radius: 20px; */
}

.liquid-glass-shine {
  position: absolute;
  inset: 0;
  z-index: 2;
  box-shadow: inset 2px 2px 10px rgba(255, 255, 255, 0.3),
              inset -2px -2px 10px rgba(255, 255, 255, 0.2);
  /* border-radius: 20px; */
  pointer-events: none;
}

.liquid-glass-content {
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 12000px;
  margin: 0 auto;
}

/* Navigation styles */
nav {
  /* mix-blend-mode: difference; */
  color: #000;
  margin: 10px;
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
}

.icons {
  width: auto;
  height: 40px;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.5));
}

.desktop-menu {
  display: flex;
  gap: 25px;
}

.nav-link {
  
  /* background: #8ebda5;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; */
  font-weight: 600;
  /* color: white; */
  text-decoration: none;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 10px;
  transition: color 0.4s ease;
  position: relative;
  overflow: hidden;
}

.nav-link:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  
  transform: scale(0);            /* спрятано */
  transform-origin: center;        /* из центра */
  transition: transform 0.4s ease; /* плавная анимация */
  
  z-index: -1;
}

.nav-link:hover:before {
  transform: scale(1); /* разворачиваем в обе стороны */
}

.buy-btn {
  position: relative;
  display: inline-block;
  padding: 14px 32px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(135deg, #921f21, #ec0303, #ff9a9e);
  background-size: 200% 200%;
  box-shadow: 0 8px 20px rgba(255, 78, 80, 0.35);
  transition: all 0.35s ease;
  overflow: hidden;
}

.buy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
    
    /* мобильное меню */
.mobile-menu {
  position: fixed; /* фиксируем к экрану */
  top: 0; left: 0;
  width: 100%; height: 100%; /* весь экран */
  margin: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1000;
}
.mobile-menu.active {
  transform: translateY(0);
  opacity: 1;
  overflow: auto;
}
.close-menu {
  position: absolute;
  top: 20px; right: 20px;
  font-size: 2rem;
  color: #fff;
  background: none;
  border: none;
}
.mobile-menu a {
  color: #fff;
  font-size: 1.5rem;
  margin: 15px 0;
  text-decoration: none;
}

.menu-toggle {
  display: none; /* покажем через @media */
  appearance: none;
  -webkit-appearance: none;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.9);
  color: #6b0630;
  padding: 8px 12px;
  font-size: 1.25rem;
  line-height: 1;
  border-radius: 10px;
  cursor: pointer;
  transition: background .18s ease, transform .12s ease, color .12s;
  z-index: 1200; /* выше навбара */
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
}
    
.social{
  max-height: 20px;
}

header {
  /* backdrop-filter: blur(5px); */
  /* padding: 20px; */
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}



footer.site-footer {
  background: #0E2A1F; /* премиальный тёмно-зелёный */
  color: #FFFFFF;
  width: 100%;
  padding: 56px 24px 32px;
  position: static;
}
/* 
.logo {
  position: absolute;
  margin-left: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
} */

.nav-icons {
  display: flex;
  gap: 15px;
  z-index: 1001;
  margin-right: 80px
}

/* Десктопное меню */
.desktop-menu {
  display: flex;
  gap: 20px;
  margin: 0 auto;
}

.desktop-menu a {
  color: rgb(187, 187, 187);
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

.desktop-menu a:hover {
  color: #737373;
}

.desktop-menu a.active {
  color: #ffffff;
}


.desktop-menu {
  display: flex;
  align-items: center;
  gap: 25px;
}

.desktop-menu .logo {
  margin-right: auto;
}

/* Адаптация под мобильные */
@media (max-width: 768px) {
  .menu-toggle {
    display: block; /* Показываем кнопку меню */
  }
  
  .desktop-menu {
    display: none; /* Скрываем десктопное меню */
  }
  
  .logo {
    position: static;
    transform: none;
    margin: 0 auto;
  }
  
  nav {
    justify-content: flex-start;
    gap: 15px;
  }
  
  .nav-icons {
    margin-left: auto;
  }
}

/* ===== Footer layout & UI ===== */
.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.footer-cta h3 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  letter-spacing: 0.2px;
}

.footer-cta p {
  margin: 0 0 16px 0;
  opacity: 0.9;
  text-align: left;
  max-width: 560px;
}

.cta-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 12px 18px;
  text-decoration: none;
  font-weight: 600;
  transition: transform .2s ease, opacity .2s ease, background .2s ease, border-color .2s ease;
  cursor: pointer;
  white-space: nowrap;
}
.btn-primary {
  background: #FAD0C4;
  color: #2A1A1A;
}
.btn-primary:hover { transform: translateY(-1px); }
.btn-secondary {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.35);
  color: #FFFFFF;
}
.btn-secondary:hover { border-color: rgba(255,255,255,0.6); }
.btn-outline {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.35);
  color: #FFFFFF;
  padding: 10px 14px;
}
.btn-outline:hover { border-color: rgba(255,255,255,0.6); }

/* Quick links */
.footer-quicklinks {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}
.footer-quicklinks a {
  color: #EAF3EE;
  text-decoration: none;
  opacity: 0.95;
}
.footer-quicklinks a:hover { opacity: 1; text-decoration: underline; }

/* Grid */
.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 32px;
  padding: 28px 0;
}

.footer-grid .col h4 {
  margin: 0 0 12px 0;
  font-size: 1.05rem;
  letter-spacing: 0.3px;
}
.footer-grid .col p {
  margin: 0 0 12px 0;
  text-align: left;
}
.footer-grid .col a {
  display: block;
  color: #EAF3EE;
  text-decoration: none;
  margin: 6px 0;
  opacity: 0.95;
}
.footer-grid .col a:hover { opacity: 1; text-decoration: underline; }

.delivery-list {
  list-style: none;
  padding: 0;
  margin: 0 0 8px 0;
}
.delivery-list li { margin: 6px 0; }
.small { font-size: 0.9rem; opacity: 0.9; }

/* Socials */
.social-links {
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 10px 0 14px 0;
}
.social {
  height: 22px; /* переопределим старый 20px, чтобы читалось лучше */
  width: auto;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.25));
}

/* Newsletter */
.newsletter {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 6px;
}
.newsletter input[type="email"] {
  flex: 1;
  min-width: 200px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.06);
  color: #fff;
  outline: none;
}
.newsletter input::placeholder { color: rgba(255,255,255,0.7); }

/* Bottom row */
.footer-bottom {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 16px;
  align-items: center;
  padding-top: 18px;
  border-top: 1px solid rgba(255,255,255,0.12);
}
.payments img {
  height: 22px;
  width: auto;
  opacity: 0.95;
  margin-right: 10px;
}
.legal {
  text-align: center;
  line-height: 1.4;
  opacity: 0.95;
}
.tagline {
  text-align: right;
  font-style: italic;
  opacity: 0.95;
}

/* A11y helper */
.sr-only {
  position: absolute !important;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,1px,1px);
  white-space: nowrap; border: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .footer-bottom { grid-template-columns: 1fr; text-align: center; }
  .tagline { text-align: center; }
}
@media (max-width: 640px) {
  .footer-grid { grid-template-columns: 1fr; }
  .footer-cta p { max-width: 100%; }
  .footer-top { align-items: flex-start; }
}

/* --- HERO (мобилка) --- */
@media (max-width: 768px) {
  .hero-section {
    position: relative;
    margin-top: 88px; /* чтобы не заезжало под header */
  }

  .hero-image {
    width: 100%;
    height: 100vh; /* картинка на весь экран */
    position: relative;
  }

  .hero-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .hero-content {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30vh; /* 30% экрана */
    background: rgba(255, 255, 255, 0.95);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.8rem;
  }

  .hero-content h1,
  .hero-content h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #6b0630;
    text-align: center;
  }

  .button-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.6rem;
  }

  .button-group .btn {
    border-radius: 25px; /* скруглённые кнопки */
    padding: 0.8rem;
    font-size: 1rem;
    width: 100%;
    text-align: center;
  }
}

/* --- TREE (мобилка) --- */
@media (max-width: 768px) {
  .tree-section {
    position: relative;
    height: 100vh;
    background: #003300 url('/images/tree-bg.png') no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* равномерно сверху, центр, низ */
    align-items: center;
    padding: 1rem;
  }

  .tree-section .text-top {
    margin-top: 1rem;
    text-align: center;
    color: #fff;
    font-size: 1rem;
  }

  .tree-section .text-center {
    text-align: center;
    color: #fff;
    font-size: 1.2rem;
  }

  .tree-section .text-bottom {
    margin-bottom: 1rem;
    text-align: center;
    color: #fff;
    font-size: 1rem;
  }

  .tree-section img.stick {
    margin: 0; /* убрать зазор */
    display: block;
  }
}

/* --- CHOICE (мобилка) --- */
@media (max-width: 768px) {
  .choice-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem; /* меньше зазор между карточками */
    padding: 1rem;
  }

  .choice-card {
    background: #fff;
    border-radius: 20px; /* скруглённые кнопки/карточки */
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .choice-card img {
    width: 100%;
    height: auto;
    display: block;
  }

  .choice-card button {
    width: 100%;
    padding: 0.8rem;
    border-radius: 25px;
    background: #6b0630;
    color: #fff;
    border: none;
    font-size: 1rem;
    margin-top: auto;
  }
}


</style>
