/** Gives each [data-parallax] section the pointer position as --px / --py, from -1 to 1. */
export default function initParallax() {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((section) => {
    section.addEventListener('pointermove', (event) => {
      const box = section.getBoundingClientRect();
      section.style.setProperty('--px', (((event.clientX - box.left) / box.width) * 2 - 1).toFixed(3));
      section.style.setProperty('--py', (((event.clientY - box.top) / box.height) * 2 - 1).toFixed(3));
    });
  });
}
