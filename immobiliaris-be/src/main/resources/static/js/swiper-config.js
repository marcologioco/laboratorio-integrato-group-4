document.addEventListener('DOMContentLoaded', function() {
    var swiper = new Swiper(".mySwiper", {
        // Default per schermi piccoli (mobile)
        slidesPerView: 1.1, // Mostra una card e un pezzo della successiva
        spaceBetween: 20, 
        
        speed: 600, 
        
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        
        // Breakpoints per visualizzare più card su schermi più grandi
        breakpoints: {
            // Tablet (640px e oltre)
            640: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            // Desktop (1024px e oltre)
            1024: {
                slidesPerView: 3, // Mostra 3 card
                spaceBetween: 30,
            },
        }
    });
});