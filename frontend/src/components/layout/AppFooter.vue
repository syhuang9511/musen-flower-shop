<script setup></script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div>
        <strong class="footer__brand">沐森植研所</strong>
        <p>MUSEN ㅤ以植物為語，沉澱日常</p>
      </div>
      <div class="footer__social">
        <a href="#" target="_blank" rel="noopener">LINE 官方帳號</a>
        <a href="#" target="_blank" rel="noopener">Instagram</a>
        <a href="#" target="_blank" rel="noopener">Facebook</a>
      </div>
    </div>
    <p class="footer__copy">© 2026 沐森植研所 MUSEN. All Rights Reserved.</p>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--color-primary-dark);
  color: #d6dcd2;
  margin-top: 3rem;
  padding: 2.5rem 0 1.2rem;
}
.footer__inner {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.footer__brand {
  font-size: 1.2rem;
  letter-spacing: 0.18em;
}
.footer__social {
  display: flex;
  gap: 1.2rem;
}
.footer__social a {
  color: var(--color-accent);
  letter-spacing: 0.04em;
}
.footer__copy {
  text-align: center;
  margin: 1.8rem 0 0;
  font-size: 0.82rem;
  letter-spacing: 0.06em;
  color: rgba(214, 220, 210, 0.55);
}
</style>
