document.addEventListener("DOMContentLoaded", () => {
    const questions = document.querySelectorAll('.faq-question');

    questions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.faq-icon');
            const isOpen = answer.style.maxHeight && answer.style.maxHeight !== "0px";

            // Chiude tutte le risposte
            document.querySelectorAll('.faq-answer').forEach(a => a.style.maxHeight = "0px");
            document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = "rotate(0deg)");

            // Se non era aperto → apri
            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + "px";
                icon.style.transform = "rotate(45deg)"; // + diventa ×
            }
        });
    });
});