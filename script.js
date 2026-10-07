'use strict';

function initializeApplication() {
  const application = document.getElementById('app');

  if (!application) {
    return;
  }

  application.dataset.initialized = 'true';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApplication, { once: true });
} else {
  initializeApplication();
}
