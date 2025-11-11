package com.immobiliaris.immobiliaris_be.controller;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.immobiliaris.immobiliaris_be.enums.StatoValutazione;
import com.immobiliaris.immobiliaris_be.model.Valutazione;
import com.immobiliaris.immobiliaris_be.services.ValutazioneService;

@RestController
@RequestMapping("/api/valutazioni")
@CrossOrigin(origins = "*")
public class ValutazioneController {

    @Autowired
    private ValutazioneService valutazioneService;

    // GET tutte le valutazioni
    // GET http://localhost:8080/api/valutazioni
    @GetMapping
    public ResponseEntity<List<Valutazione>> getAllValutazioni() {
        List<Valutazione> valutazioni = valutazioneService.findAllValutazioni();
        return ResponseEntity.ok(valutazioni);
    }

    // GET valutazione per ID
    // GET http://localhost:8080/api/valutazioni/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Valutazione> getValutazioneById(@PathVariable Integer id) {
        Optional<Valutazione> valutazione = valutazioneService.findValutazioneById(id);
        return valutazione.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET valutazione per id_immobile
    // GET http://localhost:8080/api/valutazioni/immobile/{idImmobile}
    @GetMapping("/immobile/{idImmobile}")
    public ResponseEntity<Valutazione> getValutazioneByImmobile(@PathVariable Integer idImmobile) {
        Optional<Valutazione> valutazione = valutazioneService.findValutazioneByIdImmobile(idImmobile);
        return valutazione.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET valutazioni per id_utente
    // GET http://localhost:8080/api/valutazioni/utente/{idUtente}
    @GetMapping("/utente/{idUtente}")
    public ResponseEntity<List<Valutazione>> getValutazioniByUtente(@PathVariable Integer idUtente) {
        List<Valutazione> valutazioni = valutazioneService.findValutazioniByIdUtente(idUtente);
        return ResponseEntity.ok(valutazioni);
    }

    // GET valutazioni per stato
    // GET http://localhost:8080/api/valutazioni/stato/{stato}
    @GetMapping("/stato/{stato}")
    public ResponseEntity<List<Valutazione>> getValutazioniByStato(@PathVariable StatoValutazione stato) {
        List<Valutazione> valutazioni = valutazioneService.findValutazioniByStato(stato);
        return ResponseEntity.ok(valutazioni);
    }

    // POST crea nuova valutazione
    // POST http://localhost:8080/api/valutazioni
    @PostMapping
    public ResponseEntity<Valutazione> createValutazione(@RequestBody Valutazione valutazione) {
        Valutazione nuovaValutazione = valutazioneService.saveValutazione(valutazione);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuovaValutazione);
    }

    // PUT aggiorna valutazione completa
    // PUT http://localhost:8080/api/valutazioni/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Valutazione> updateValutazione(@PathVariable Integer id, @RequestBody Valutazione valutazione) {
        try {
            Valutazione valutazioneAggiornata = valutazioneService.updateValutazione(id, valutazione);
            return ResponseEntity.ok(valutazioneAggiornata);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PATCH aggiorna valutazione parziale
    // PATCH http://localhost:8080/api/valutazioni/{id}
    @PatchMapping("/{id}")
    public ResponseEntity<Valutazione> patchValutazione(@PathVariable Integer id, @RequestBody Valutazione valutazione) {
        try {
            Valutazione valutazioneAggiornata = valutazioneService.patchValutazione(id, valutazione);
            return ResponseEntity.ok(valutazioneAggiornata);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE elimina valutazione
    // DELETE http://localhost:8080/api/valutazioni/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteValutazione(@PathVariable Integer id) {
        try {
            valutazioneService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}