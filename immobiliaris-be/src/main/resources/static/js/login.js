document.addEventListener('DOMContentLoaded', () => {
  try {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openModal');
    const closeBtn = document.getElementById('closeModal');
    const emailInput = document.getElementById('email');

    if (!modal) throw new Error('Elemento modal non trovato (id=loginModal).');
    if (!openBtn) throw new Error('Bottone openModal non trovato.');
    if (!closeBtn) throw new Error('Bottone closeModal non trovato.');

    // Funzioni per aprire/chiudere e bloccare scroll
    const openModal = () => {
      // mostra overlay e card
      modal.style.display = 'flex';
      // piccolo delay per permettere la transizione css se hai .modal-fade
      requestAnimationFrame(() => modal.classList.add('show'));
      modal.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      // autofocus campo email se presente
      if (emailInput) {
        // piccolo timeout per sicurezza (render)
        setTimeout(() => emailInput.focus(), 120);
      }
    };

    const closeModal = () => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      // attendi la fine dell'animazione prima di nascondere per evitare flicker
      setTimeout(() => {
        // verifica ancora che non sia riaperto nel frattempo
        if (!modal.classList.contains('show')) modal.style.display = 'none';
      }, 300);
    };

    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });

    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });

    // Chiudi cliccando sullo sfondo
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // ESC per chiudere
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
      }
    });

  } catch (err) {
    console.error('Errore init login modal:', err);
  }
});