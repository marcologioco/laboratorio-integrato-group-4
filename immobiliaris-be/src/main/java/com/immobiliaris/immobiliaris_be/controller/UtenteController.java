package com.immobiliaris.immobiliaris_be.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.immobiliaris.immobiliaris_be.model.Utente;
import com.immobiliaris.immobiliaris_be.services.UtenteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/utenti")
@CrossOrigin(origins = "*")
@Validated
public class UtenteController {

    @Autowired
    private UtenteService utenteService;

    // GET tutti gli utenti
    // GET http://localhost:8080/api/utenti
    @GetMapping
    public ResponseEntity<List<Utente>> getAllUtenti() {
        List<Utente> utenti = utenteService.findAllUtenti();
        return ResponseEntity.ok(utenti);
    }

    // GET utente per ID
    // GET http://localhost:8080/api/utenti/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Utente> getUtenteById(@PathVariable Integer id) {
        Optional<Utente> utente = utenteService.findUtenteById(id);
        return utente.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET utente per email
    // GET http://localhost:8080/api/utenti/email/{email}
    @GetMapping("/email/{email}")
    public ResponseEntity<Utente> getUtenteByEmail(@PathVariable String email) {
        Optional<Utente> utente = utenteService.findUtenteByEmail(email);
        return utente.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET utenti per id_ruolo
    // GET http://localhost:8080/api/utenti/ruolo/{idRuolo}
    @GetMapping("/ruolo/{idRuolo}")
    public ResponseEntity<List<Utente>> getUtentiByRuolo(@PathVariable Integer idRuolo) {
        List<Utente> utenti = utenteService.findUtentiByIdRuolo(idRuolo);
        return ResponseEntity.ok(utenti);
    }

    // POST crea nuovo utente
    // POST http://localhost:8080/api/utenti
    @PostMapping
    public ResponseEntity<Utente> createUtente(@Valid @RequestBody Utente utente) {
        Utente nuovoUtente = utenteService.saveUtente(utente);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuovoUtente);
    }

    // PUT aggiorna utente completo
    // PUT http://localhost:8080/api/utenti/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Utente> updateUtente(@PathVariable Integer id, @Valid @RequestBody Utente utente) {
        try {
            Utente utenteAggiornato = utenteService.updateUtente(id, utente);
            return ResponseEntity.ok(utenteAggiornato);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PATCH aggiorna utente parziale
    // PATCH http://localhost:8080/api/utenti/{id}
    @PatchMapping("/{id}")
    public ResponseEntity<Utente> patchUtente(@PathVariable Integer id, @RequestBody Utente utente) {
        try {
            Utente utenteAggiornato = utenteService.patchUtente(id, utente);
            return ResponseEntity.ok(utenteAggiornato);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE elimina utente
    // DELETE http://localhost:8080/api/utenti/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtente(@PathVariable Integer id) {
        try {
            utenteService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
