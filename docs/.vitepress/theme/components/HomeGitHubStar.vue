<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const REPO_API = 'https://api.github.com/repos/jessefaler/SLS'
const REPO_URL = 'https://github.com/jessefaler/SLS'

const stars = ref<number | null>(null)
const failed = ref(false)

const starsLabel = computed(() => {
  if (stars.value === null) return failed.value ? '—' : '…'
  return formatStarCount(stars.value)
})

const ariaLabel = computed(() => {
  if (stars.value === null) return 'Star SLS on GitHub'
  return `Star SLS on GitHub — ${stars.value} stars`
})

function formatStarCount(n: number): string {
  if (n >= 10_000) return `${Math.round(n / 1000)}k`
  if (n >= 1000) {
    const k = n / 1000
    return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, '')}k`
  }
  return String(n)
}

onMounted(async () => {
  try {
    const res = await fetch(REPO_API)
    if (!res.ok) throw new Error(String(res.status))
    const data = (await res.json()) as { stargazers_count?: unknown }
    const n = data.stargazers_count
    stars.value = typeof n === 'number' && Number.isFinite(n) ? n : null
    if (stars.value === null) failed.value = true
  } catch {
    failed.value = true
  }
})
</script>

<template>
  <div class="home-github-star">
    <a
      class="home-github-star-link"
      :href="REPO_URL"
      target="_blank"
      rel="noopener noreferrer"
      :title="ariaLabel"
      :aria-label="ariaLabel"
    >
      <svg class="home-github-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
        />
      </svg>
      <span class="home-star-label">Star</span>
      <span class="home-star-count-wrap" aria-hidden="true">
        <span class="home-star-count">{{ starsLabel }}</span>
        <svg class="home-gold-star" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
          />
        </svg>
      </span>
    </a>
  </div>
</template>
