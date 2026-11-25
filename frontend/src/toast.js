export const toast = m => {
  const t = document.createElement('div'); t.textContent = m;
  t.className = 'fixed left-1/2 -translate-x-1/2 bottom-6 bg-pine text-cream px-5 py-2.5 rounded-full shadow-xl z-[70]';
  document.body.appendChild(t); setTimeout(() => t.remove(), 2000);
};
