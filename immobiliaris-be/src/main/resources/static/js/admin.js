const overview = document.getElementById('overview');
const detailView = document.getElementById('detail-view');
const detailCards = document.getElementById('detail-cards');
const detailTitle = document.getElementById('detail-title');
const closeBtn = document.getElementById('close-overview');
const sidebarLinks = document.querySelectorAll('aside nav a');

const sampleData = {
  utenti: [
    { name: 'Mario Rossi', email: 'mario@example.com' },
    { name: 'Luca Bianchi', email: 'luca@example.com' },
  ],
  case: [
    { name: 'Appartamento Centro', city: 'Milano', price: '€250.000' },
    { name: 'Villa al Mare', city: 'Napoli', price: '€450.000' },
  ],
  preventivi: [
    { client: 'Mario Rossi', total: '€1.200', status: 'Completato' },
    { client: 'Luca Bianchi', total: '€2.500', status: 'Completato' },
  ]
};

// Funzione per mostrare le card
function showCards(type = null) {
  overview.classList.remove('hidden');
  detailView.classList.add('hidden');
  closeBtn.classList.add('hidden');

  // Mostra tutte le card se type è null, altrimenti solo le specifiche
  overview.querySelectorAll('.card-admin').forEach(card => {
    if(!type || card.dataset.type === type) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// Click sulle card principali
overview.querySelectorAll('.card-admin').forEach(card => {
  card.addEventListener('click', () => {
    const type = card.dataset.type;
    detailTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    detailCards.innerHTML = '';

    sampleData[type].forEach(item => {
      const cardEl = document.createElement('div');
      cardEl.className = 'bg-white p-4 rounded-xl shadow-md relative flex flex-col justify-between';

      cardEl.innerHTML = `
        <div class="card-content mb-2">
          ${Object.entries(item).map(([k,v]) => `<p class="text-sm text-gray-600"><strong>${k}:</strong> ${v}</p>`).join('')}
        </div>
        <div class="flex flex-col items-end space-y-1 mt-2">
          <button class="edit-btn text-xs text-my-green-dark hover:text-my-green-light">Modifica</button>
          <button class="delete-btn text-xs text-my-orange hover:text-my-green-dark">Elimina</button>
        </div>
      `;
      detailCards.appendChild(cardEl);

      cardEl.querySelector('.delete-btn').addEventListener('click', e => { e.stopPropagation(); cardEl.remove(); });
      cardEl.querySelector('.edit-btn').addEventListener('click', e => {
        e.stopPropagation();
        const cardContent = cardEl.querySelector('.card-content');
        const newItem = {};
        Object.keys(item).forEach(key => {
          const newValue = prompt(`Modifica ${key}:`, item[key]);
          newItem[key] = newValue !== null ? newValue : item[key];
        });
        cardContent.innerHTML = Object.entries(newItem).map(([k,v]) => `<p class="text-sm text-gray-600"><strong>${k}:</strong> ${v}</p>`).join('');
        Object.assign(item, newItem);
      });
    });

    overview.classList.add('hidden');
    detailView.classList.remove('hidden');
    closeBtn.classList.remove('hidden');
  });
});

// Click X per tornare all’over view
closeBtn.addEventListener('click', () => { showCards(); });

// Click sui link della sidebar
sidebarLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const text = link.textContent.toLowerCase();
    if(text.includes('dashboard')) showCards();
    else if(text.includes('utenti')) showCards('utenti');
    else if(text.includes('valutazioni')) showCards('case');
    else if(text.includes('preventivi')) showCards('preventivi'); 
  });
});
