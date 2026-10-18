<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger'
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { variant: 'primary', type: 'button' },
)
</script>

<template>
  <button :type="type" class="btn" :class="`btn--${variant}`">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font: inherit;
  font-weight: 500;
  line-height: 1.25;
  border: 1px solid transparent;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn--secondary {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-border);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--color-surface);
}

.btn--danger {
  background: var(--color-danger);
  color: var(--color-on-danger);
}

.btn--danger:hover:not(:disabled) {
  background: var(--color-danger-hover);
}
</style>
