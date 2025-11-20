document.addEventListener("DOMContentLoaded", () => {
    const questions = document.querySelectorAll('.faq-question');

    questions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement; // La card
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.faq-icon');
            const title = question.querySelector('.faq-title');
            const text = item.querySelector('.faq-text');

            const isOpen = answer.style.maxHeight && answer.style.maxHeight !== "0px";

            // --- 1. RESET (Chiudi tutto) ---
            document.querySelectorAll('.faq-answer').forEach(a => a.style.maxHeight = "0px");
            document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = "rotate(0deg)");
            
            // Ripristina stile "Bianco" per tutti
            document.querySelectorAll('.faq-item').forEach(el => {
                // Rimuoviamo le classi "attive"
                el.classList.remove('bg-my-green-dark', 'border-my-green-dark'); 
                el.classList.add('bg-white', 'border-gray-200');
                
                //IMPORTANTE: Riaggiungiamo le classi group per permettere l'hover sugli altri elementi
                el.classList.add('group'); 
            });
            
            // Ripristina testi neri/grigi
            document.querySelectorAll('.faq-title').forEach(t => {
                t.classList.remove('text-white');
                t.classList.add('text-my-black');
            });
            document.querySelectorAll('.faq-text').forEach(txt => {
                txt.classList.remove('text-white');
                txt.classList.add('text-gray-600');
            });
            
            // Ripristina Icone
            document.querySelectorAll('.faq-icon').forEach(ic => {
                ic.classList.remove('bg-white', 'text-my-green-dark');
                ic.classList.add('bg-my-cream', 'text-my-green-dark');
            });


            // --- 2. ATTIVA ELEMENTO CORRENTE ---
            if (!isOpen) {
                // Apri
                answer.style.maxHeight = answer.scrollHeight + "px";
                // Ruota
                icon.style.transform = "rotate(45deg)";

                // --- Applica Colori FISSI (Verde scuro) ---
                
                // Sfondo Card
                item.classList.remove('bg-white', 'border-gray-200', 'group'); // Rimuovo group per bloccare l'hover state
                item.classList.add('bg-my-green-dark', 'border-my-green-dark');

                // Testi in Bianco
                title.classList.remove('text-my-black');
                title.classList.add('text-white');
                
                text.classList.remove('text-gray-600');
                text.classList.add('text-white');

                // Icona (Sfondo bianco, simbolo verde)
                icon.classList.remove('bg-my-cream', 'text-my-green-dark');
                icon.classList.add('bg-white', 'text-my-green-dark');
            }
        });
    });
});