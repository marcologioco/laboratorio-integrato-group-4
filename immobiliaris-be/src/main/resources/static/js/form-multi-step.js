document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("multi-step-form");
  const steps = [...form.querySelectorAll(".step")];
  const progressBar = document.getElementById("progress-bar");
  let currentStep = 1;

  // Mostra uno step specifico
  function showStep(n) {
    steps.forEach((step) => step.classList.add("hidden"));
    const active = steps.find((s) => s.dataset.step == n);
    if (!active) return;
    active.classList.remove("hidden");
    progressBar.style.width = `${(n / steps.length) * 100}%`;
  }

  // Event delegation per pulsanti next/back
  form.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const step = Number(btn.dataset.step);

    if (action === "next") {
      if (step === 1) {
        const tipo = form.querySelector('input[name="tipo"]:checked');
        if (!tipo) {
          alert("Seleziona un tipo di abitazione prima di continuare.");
          return;
        }
      }

      if (step === 2) {
        const mq = Number(form.querySelector('input[name="metratura"]').value);
        if (!mq || mq <= 0) {
          alert("Inserisci una metratura valida.");
          return;
        }
      }

      currentStep = Math.min(currentStep + 1, steps.length);
      showStep(currentStep);
    }

    if (action === "back") {
      currentStep = Math.max(currentStep - 1, 1);
      showStep(currentStep);
    }
  });

  // Submit finale
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Qui potresti chiamare un’API per inviare i dati
    alert("Form completato con successo!");
  });

  // Futuro: caricamento dei campi dinamici da API
  try {
    const response = await fetch("/api/form-fields");
    if (response.ok) {
      const data = await response.json();
      console.log("Campi ricevuti dall’API:", data);
      // TODO: popolare dinamicamente i campi se serve
    }
  } catch (err) {
    console.warn("Impossibile caricare i campi da API:", err);
  }

  showStep(currentStep);
});