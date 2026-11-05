const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function closeNavigation() {
  navLinks.classList.remove('mobile-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('mobile-open');
  navToggle.setAttribute('aria-expanded', String(open));
  if (open) navLinks.querySelector('a').focus();
});

navLinks.addEventListener('click', event => {
  if (event.target.closest('a')) closeNavigation();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
    closeNavigation();
    navToggle.focus();
  }
});
