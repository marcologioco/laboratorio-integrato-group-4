// Eventuale JS per aggiornare dinamicamente i dati utente
// Ad esempio: mostrare overlay sugli immobili al passaggio
document.querySelectorAll('.immobile-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelector('.immobile-overlay').classList.add('opacity-100');
  });
  card.addEventListener('mouseleave', () => {
    card.querySelector('.immobile-overlay').classList.remove('opacity-100');
  });
});
