
document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");
  const progressBar = document.getElementById("progress-bar");
  let currentStep = 1;

  const showStep = (n) => {
    steps.forEach(step => step.classList.add("hidden"));
    document.querySelector(`.step[data-step="${n}"]`).classList.remove("hidden");
    progressBar.style.width = `${(n / steps.length) * 100}%`;
  };

  document.getElementById("next1").addEventListener("click", () => {
    const tipo = document.querySelector('input[name="tipo"]:checked');
    if (!tipo) {
      alert("Seleziona un tipo di abitazione prima di continuare.");
      return;
    }
    currentStep = 2;
    showStep(currentStep);
  });

  document.getElementById("back2").addEventListener("click", () => {
    currentStep = 1;
    showStep(currentStep);
  });

  document.getElementById("next2").addEventListener("click", () => {
    const metratura = document.querySelector('input[name="metratura"]').value;
    if (!metratura || metratura <= 0) {
      alert("Inserisci una metratura valida.");
      return;
    }
    currentStep = 3;
    showStep(currentStep);
  });

  document.getElementById("back3").addEventListener("click", () => {
    currentStep = 2;
    showStep(currentStep);
  });

  document.getElementById("multi-step-form").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Form completato con successo!");
  });
});

(function(){
  // small helper
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  document.addEventListener('DOMContentLoaded', () => {
    const form = $('#multi-step-form');
    if (!form) {
      console.warn('multi-step form non trovato');
      return;
    }
    const steps = $$('.step');
    const progressBar = $('#progress-bar');
    let current = 1;

    const showStep = (n) => {
      steps.forEach(s => s.classList.add('hidden'));
      const el = document.querySelector(`.step[data-step="${n}"]`);
      if (!el) {
        console.error('step non trovato:', n);
        return;
      }
      el.classList.remove('hidden');
      if (progressBar) progressBar.style.width = `${Math.round((n / steps.length) * 100)}%`;
      current = n;
    };

    // Event delegation per next/back
    form.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-action]');
      if (!btn) return;

      const action = btn.getAttribute('data-action');
      const stepAttr = Number(btn.getAttribute('data-step')) || current;

      if (action === 'next') {
        if (stepAttr === 1) {
          const tipo = form.querySelector('input[name="tipo"]:checked');
          if (!tipo) {
            // meglio messaggio non intrusivo
            alert('Seleziona un tipo di abitazione prima di continuare.');
            return;
          }
          showStep(2);
          return;
        }
        if (stepAttr === 2) {
          const mq = Number(form.querySelector('input[name="metratura"]').value);
          if (!Number.isFinite(mq) || mq <= 0) {
            alert('Inserisci una metratura valida.');
            return;
          }
          showStep(3);
          return;
        }
        // fallback: avanza di uno
        showStep(Math.min(current + 1, steps.length));
      }

      if (action === 'back') {
        showStep(Math.max(current - 1, 1));
      }
    });


    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        tipo: form.querySelector('input[name="tipo"]:checked')?.value || null,
        metratura: form.querySelector('input[name="metratura"]')?.value || null
      };
      console.log('Dati form inviati:', data);
      alert('Form completato — controlla console per i dati.');
      
    });

    // inizializza
    showStep(1);
  });
})();