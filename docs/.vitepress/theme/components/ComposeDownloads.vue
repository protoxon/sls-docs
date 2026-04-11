<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** `all` shows both compose files; otherwise only the matching row. */
    which?: 'all' | 'protocube' | 'daemon'
  }>(),
  { which: 'all' },
)

const FILES = [
  {
    label: 'Protocube',
    downloadName: 'protocube-docker-compose.yml',
    cdnPath: 'protocube/docker-compose.yml',
    htmlUrl: 'https://github.com/jessefaler/SLS/blob/main/protocube/docker-compose.yml',
  },
  {
    label: 'Daemon (node)',
    downloadName: 'daemon-docker-compose.yml',
    cdnPath: 'daemon/docker-compose.yml',
    htmlUrl: 'https://github.com/jessefaler/SLS/blob/main/daemon/docker-compose.yml',
  },
] as const

const visibleFiles = computed(() => {
  if (props.which === 'all') return [...FILES]
  const prefix = `${props.which}/`
  return FILES.filter((f) => f.cdnPath.startsWith(prefix))
})

const JSDELIVR = 'https://cdn.jsdelivr.net/gh/jessefaler/SLS@main'

const downloading = ref<string | null>(null)

async function downloadFile(entry: (typeof FILES)[number]) {
  if (downloading.value) return
  downloading.value = entry.cdnPath
  const cdnUrl = `${JSDELIVR}/${entry.cdnPath}`
  try {
    const res = await fetch(cdnUrl)
    if (!res.ok) throw new Error(String(res.status))
    const text = await res.text()
    const blob = new Blob([text], { type: 'text/yaml;charset=utf-8' })
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = entry.downloadName
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(objectUrl)
  } catch {
    window.open(cdnUrl, '_blank', 'noopener,noreferrer')
  } finally {
    downloading.value = null
  }
}
</script>

<template>
  <div class="compose-downloads">
    <ul class="compose-downloads__items">
      <li v-for="f in visibleFiles" :key="f.cdnPath" class="compose-downloads__row">
        <div class="compose-downloads__meta">
          <span class="compose-downloads__label">{{ f.label }}</span>
          <code class="compose-downloads__path">{{ f.cdnPath }}</code>
        </div>
        <span class="compose-downloads__actions">
          <button
            type="button"
            class="compose-downloads__btn compose-downloads__btn--brand"
            :disabled="downloading !== null"
            @click="downloadFile(f)"
          >
            {{ downloading === f.cdnPath ? 'Saving…' : 'Download' }}
          </button>
          <a
            class="compose-downloads__btn compose-downloads__btn--alt"
            :href="f.htmlUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.compose-downloads {
  margin: 1rem 0 1.5rem;
}

.compose-downloads__items {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-alt);
}

.compose-downloads__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.compose-downloads__row:last-child {
  border-bottom: none;
}

.compose-downloads__meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.compose-downloads__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.compose-downloads__path {
  font-size: 0.8rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  word-break: break-all;
}

.compose-downloads__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.compose-downloads__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  line-height: 32px;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  border-radius: 6px;
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    color 0.2s,
    background-color 0.2s,
    border-color 0.2s;
}

button.compose-downloads__btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.compose-downloads__btn--brand {
  color: var(--vp-button-brand-text);
  background-color: var(--vp-button-brand-bg);
  border-color: var(--vp-button-brand-border);
}

.compose-downloads__btn--brand:hover {
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-hover-bg);
  border-color: var(--vp-button-brand-hover-border);
}

.compose-downloads__btn--alt {
  color: var(--vp-button-alt-text);
  background-color: var(--vp-button-alt-bg);
  border-color: var(--vp-button-alt-border);
}

.compose-downloads__btn--alt:hover {
  color: var(--vp-button-alt-hover-text);
  background-color: var(--vp-button-alt-hover-bg);
  border-color: var(--vp-button-alt-hover-border);
}
</style>
