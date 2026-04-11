<script setup lang="ts">
const github = 'https://github.com/jessefaler/SLS'
const discord = 'https://discord.gg/BrH8GtyGSh'
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__top">
        <div class="site-footer__brand">
          <img class="site-footer__logo" src="/logo.png" width="40" height="40" alt="" />
          <span class="site-footer__title">SLS</span>
        </div>
        <nav class="site-footer__nav" aria-label="Community links">
          <a :href="github" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span class="site-footer__sep" aria-hidden="true">·</span>
          <a :href="discord" target="_blank" rel="noopener noreferrer">Discord</a>
        </nav>
      </div>
      <p class="site-footer__legal">
        AGPL-3.0 Licensed | SLS Copyright © Jesse Faler and contributors
      </p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  z-index: var(--vp-z-index-footer);
  margin-top: auto;
  border-top: 1px solid var(--vp-c-divider);
  padding: 28px 24px 32px;
  background-color: var(--vp-c-bg);
}

.site-footer__inner {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  text-align: center;
}

.site-footer__top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

@media (min-width: 640px) {
  .site-footer__top {
    flex-direction: row;
    justify-content: center;
    gap: 28px;
  }
}

.site-footer__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.site-footer__logo {
  display: block;
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 8px;
}

.site-footer__title {
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.site-footer__nav {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
}

.site-footer__nav a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: color 0.2s ease;
}

.site-footer__nav a:hover {
  color: var(--vp-c-text-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.site-footer__sep {
  color: var(--vp-c-text-3);
  user-select: none;
}

.site-footer__legal {
  margin: 20px 0 0;
  line-height: 1.5;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}
</style>
