<template>
  <section class="footer" data-theme="dark">
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-cta">
          <h3>Рождественские звезды на Вашу ёлку</h3>
          <div class="cta-buttons">
            <router-link to="/create" class="btn btn-primary">СОБРАТЬ ЗВЕЗДУ</router-link>
            <router-link to="/products" class="btn btn-secondary">ВЫБРАТЬ ГОТОВУЮ</router-link>
          </div>
        </div>

        <nav class="footer-quicklinks" aria-label="Быстрые ссылки">
            <div class="contact-wrapper">
                <div class="contact-link">Контакты</div>
                <div class="social-links">
                    <a href="https://t.me/nadezhda_balyberdina" target="_blank" rel="noopener" aria-label="Telegram">
                        <img src="/icons/telegram.png" alt="Telegram" class="social">
                    </a>
                    <a href="https://wa.me/+79258476457" target="_blank" rel="noopener" aria-label="WhatsApp">
                        <img src="/icons/whatsapp.png" alt="WhatsApp" class="social">
                    </a>
                </div>
            </div>
            <router-link to="/reviews">Отзывы</router-link>
        </nav>
      </div>
      <div class="footer-grid">
        
        <!-- О бренде -->
        <section class="col about">
          <h4>О бренде</h4>
          <p>Мы создаём авторские ёлочные звёзды вручную. Каждая звезда — это уют, который остаётся с вами на многие зимы. <br> Все звезды уникальны и выполнены руками мастера. Для каждого изделия своя подарочная упаковка! </p>
        </section>

        <section class="col about">
          <h4>Как пользоваться сайтом?</h4>
          <p>Во вкладке ТОВАРЫ можно выбрать готовую звезду, которую мы отправим Вам в ближайшее время.<br> Если же в ТОВАРАХ подходящей звезды нет, всегда можно СОБРАТЬ ЗВЕЗДУ в одноименной вкладке.</p>  
        </section>
      </div>

      <div class="footer-bottom">
        <div class="legal">
          <p>© 2025 звезда-на-елку.рф. Все права защищены.</p>
          <p>С заботой о Вашем празднике!</p>
        </div> 

      </div>
    </div>
  </section>
</template>

<script setup>
</script>


<style scoped>

.footer {
  background: #0e2a1f;
  color: #ffffff;
  width: 100%;
  padding: 40px 20px;
  min-height: 100vh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 56px 24px 32px;
}

.footer-regular {
  padding: 40px 20px;
}


.footer.site-footer {
  background: #0E2A1F;
  color: #FFFFFF;
  width: 100%;
  padding: 56px 24px 32px;
}

.footer-container {

  max-width: 1200px;
  margin: 0 auto;
}
.footer-top {
  margin-top: 20vh;
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
  border-radius: 25px;
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
      color: #EAF3EE;
}
.footer-quicklinks a {
  color: #EAF3EE;
  text-decoration: none;
  opacity: 0.95;
}
.footer-quicklinks a:hover { opacity: 1; text-decoration: underline; }

.contact-wrapper {
    position: relative;
      display: inline-block;

}

.contact-link {
  position: relative; /* чтобы соцсети позиционировались относительно Контактов */
  display: inline-block;
}

.social-links {
  visibility: hidden;
  position: absolute;
  background: #174633;
  padding: 8px 12px;
  border-radius: 8px;
  margin-top: 4px;
  white-space: nowrap;
  z-index: 100;
  display: flex;
  gap: 10px;


  transition: opacity 0.3s ease, visibility 0.3s linear 0.5s;

}

.social-links a {
  display: inline-block;
  margin: 0 6px;
}

.contact-wrapper:hover .social-links {
  visibility: visible;
  transition: opacity 0.3s ease;
  gap: 10px;
  
}


/* Grid */
.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
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

/* Socials

.social-links {
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 10px 0 14px 0;
} */
.social {
  height: 22px;
  width: 22px;
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
    margin-bottom: 20vh;

  display: grid;
  grid-template-columns: 1fr;
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
</style>
