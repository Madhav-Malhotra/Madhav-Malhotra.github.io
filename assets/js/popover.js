// =========== CREATE EVENT HANDLERS ===============

function pop_mouse_over(e) {
  // Select target modal
  const pop = e.target;
  const target = pop.dataset.target;
  const mod = pop.parentNode.querySelector(`div#${target}`);

  // Animated modal display
  mod.style.opacity = 1.0;
  mod.classList.add('active');
}

function pop_mouse_exit(e) {
  // Select target modal
  const pop = e.target;
  const target = pop.dataset.target;
  const mod = pop.parentNode.querySelector(`div#${target}`);

  // Animated modal display
  mod.style.opacity = 0.0;
  mod.classList.remove('active');
}

// =========== ADD EVENT HANDLERS ===============

// DOM Elements
const popovers = document.querySelectorAll('popover');
const popover_modals = document.querySelectorAll('div.popover-modal-custom-made');

// Bind event handlers
for (p of popovers) {
  p.onmouseover = (e) => pop_mouse_over(e);
  p.onmouseleave = (e) => pop_mouse_exit(e);
}