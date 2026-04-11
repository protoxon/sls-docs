<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface GhFile {
  name: string
  path: string
  download_url: string | null
  html_url: string
  type: string
}

const API = 'https://api.github.com/repos/jessefaler/SLS/contents/software'
const RAW_BASE = 'https://raw.githubusercontent.com/jessefaler/SLS/main/software'

const FALLBACK: GhFile[] = [
  {
    name: 'paper.yml',
    path: 'software/paper.yml',
    download_url: `${RAW_BASE}/paper.yml`,
    html_url: 'https://github.com/jessefaler/SLS/blob/main/software/paper.yml',
    type: 'file',
  },
  {
    name: 'spigot.yml',
    path: 'software/spigot.yml',
    download_url: `${RAW_BASE}/spigot.yml`,
    html_url: 'https://github.com/jessefaler/SLS/blob/main/software/spigot.yml',
    type: 'file',
  },
]

const files = ref<GhFile[]>([])
const loading = ref(true)
const usedFallback = ref(false)
/** Which file is currently being saved (jsDelivr fetch + blob download). */
const downloading = ref<string | null>(null)

const JSDELIVR =
  'https://cdn.jsdelivr.net/gh/jessefaler/SLS@main/software'

function hrefForDownload(file: GhFile) {
  return file.download_url || `${RAW_BASE}/${encodeURIComponent(file.name)}`
}

/**
 * Browsers ignore `download` on cross-origin anchors. Fetch via jsDelivr (CORS-enabled
 * mirror of GitHub) then trigger a same-origin blob URL so the file saves as `.yml`.
 */
async function downloadFile(file: GhFile) {
  if (downloading.value) return
  downloading.value = file.name
  const cdnUrl = `${JSDELIVR}/${encodeURIComponent(file.name)}`
  try {
    const res = await fetch(cdnUrl)
    if (!res.ok) throw new Error(String(res.status))
    const text = await res.text()
    const blob = new Blob([text], { type: 'text/yaml;charset=utf-8' })
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = file.name
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(objectUrl)
  } catch {
    window.open(hrefForDownload(file), '_blank', 'noopener,noreferrer')
  } finally {
    downloading.value = null
  }
}

onMounted(async () => {
  try {
    const res = await fetch(API, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) throw new Error(`${res.status}`)
    const data = (await res.json()) as unknown
    if (!Array.isArray(data)) throw new Error('unexpected')
    const list = data
      .filter(
        (item): item is GhFile =>
          typeof item === 'object' &&
          item !== null &&
          (item as GhFile).type === 'file' &&
          /\.ya?ml$/i.test((item as GhFile).name),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
    if (list.length === 0) throw new Error('empty')
    files.value = list
  } catch {
    files.value = FALLBACK
    usedFallback.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="software-repo-list">
    <p v-if="loading || usedFallback" class="software-repo-list__intro">
      <template v-if="loading">Loading list…</template>
      <span v-else class="software-repo-list__note">
        (Showing known files — live listing unavailable.)
      </span>
    </p>

    <ul v-if="!loading && files.length" class="software-repo-list__items">
      <li v-for="f in files" :key="f.name" class="software-repo-list__row">
        <code class="software-repo-list__name">{{ f.name }}</code>
        <span class="software-repo-list__actions">
          <button
            type="button"
            class="software-repo-list__btn software-repo-list__btn--brand"
            :disabled="downloading !== null"
            @click="downloadFile(f)"
          >
            {{ downloading === f.name ? 'Saving…' : 'Download' }}
          </button>
          <a
            class="software-repo-list__btn software-repo-list__btn--alt"
            :href="f.html_url"
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
.software-repo-list {
  margin: 1rem 0 1.5rem;
}

.software-repo-list__intro {
  margin: 0 0 0.75rem;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}

.software-repo-list__intro a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
}

.software-repo-list__intro a:hover {
  text-decoration: underline;
}

.software-repo-list__note {
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
}

.software-repo-list__items {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-alt);
}

.software-repo-list__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.software-repo-list__row:last-child {
  border-bottom: none;
}

.software-repo-list__name {
  font-size: 0.9rem;
  font-family: var(--vp-font-family-mono);
}

.software-repo-list__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.software-repo-list__btn {
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

button.software-repo-list__btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.software-repo-list__btn--brand {
  color: var(--vp-button-brand-text);
  background-color: var(--vp-button-brand-bg);
  border-color: var(--vp-button-brand-border);
}

.software-repo-list__btn--brand:hover {
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-hover-bg);
  border-color: var(--vp-button-brand-hover-border);
}

.software-repo-list__btn--alt {
  color: var(--vp-button-alt-text);
  background-color: var(--vp-button-alt-bg);
  border-color: var(--vp-button-alt-border);
}

.software-repo-list__btn--alt:hover {
  color: var(--vp-button-alt-hover-text);
  background-color: var(--vp-button-alt-hover-bg);
  border-color: var(--vp-button-alt-hover-border);
}
</style>
