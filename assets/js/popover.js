// =========== CREATE EVENT HANDLERS ===============

function pop_mouse_over(e) {
  // Select target modal
  const pop = e.target;
  const target = pop.dataset.target;
  const mod = pop.parentNode.querySelector(`div#${target}`);

  // Animated modal display
  let currOpacity = 0;
  mod.style.opacity = currOpacity;
  mod.classList.add('active');

  const interval = setInterval(() => {
    if (mod.style.opacity < 1) {
      currOpacity += 0.01;
      mod.style.opacity = currOpacity;
    } else clearInterval(interval);
  }, 2)
}

function pop_mouse_exit(e) {
  // Select target modal
  const pop = e.target;
  const target = pop.dataset.target;
  const mod = pop.parentNode.querySelector(`div#${target}`);

  // Animated modal display
  let currOpacity = 1;
  mod.style.opacity = currOpacity;

  const interval = setInterval(() => {
    if (mod.style.opacity > 0) {
      currOpacity -= 0.01;
      mod.style.opacity = currOpacity;
    } else {
      clearInterval(interval);
      mod.classList.remove('active');
    }
  }, 2)
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