package com.immobiliaris.immobiliaris_be.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.immobiliaris.immobiliaris_be.enums.StatoImmobile;
import com.immobiliaris.immobiliaris_be.enums.TipoImmobile;
import com.immobiliaris.immobiliaris_be.model.Immobile;
import com.immobiliaris.immobiliaris_be.model.Utente;
import com.immobiliaris.immobiliaris_be.model.Venditore;
import com.immobiliaris.immobiliaris_be.services.ImmobileService;
import com.immobiliaris.immobiliaris_be.services.UtenteService;
import com.immobiliaris.immobiliaris_be.services.VenditoreService;
import com.immobiliaris.immobiliaris_be.util.JwtUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/immobili")
@CrossOrigin(origins = "*")
@Tag(name = "Immobili", description = "Gestione immobili - Admin vede tutti, Utente vede solo i suoi")
public class ImmobileController {

    @Autowired
    private ImmobileService immobileService;
    
    @Autowired
    private UtenteService utenteService;
    
    @Autowired
    private VenditoreService venditoreService;
    
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * GET tutti gli immobili
     * 
     * LOGICA:
     * - Se ADMIN → vede tutti gli immobili
     * - Se UTENTE NORMALE → vede solo i suoi immobili (se è venditore)
     * - Se UTENTE NON è venditore → lista vuota
     * 
     * GET http://localhost:8080/api/immobili
     */
    @GetMapping
    @Operation(
        summary = "Lista immobili",
        description = "Admin vede tutti gli immobili. Utente normale vede solo i suoi (se è venditore).",
        security = @SecurityRequirement(name = "bearer-jwt")
    )
    public ResponseEntity<List<Immobile>> getAllImmobili() {
        // 1. Ottieni l'autenticazione dal SecurityContext (impostata dal JwtAuthenticationFilter)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        // 2. Se non autenticato, ritorna tutti (per ora - endpoint pubblico)
        if (authentication == null || !authentication.isAuthenticated() 
            || authentication.getPrincipal().equals("anonymousUser")) {
            List<Immobile> immobili = immobileService.findAllImmobili();
            return ResponseEntity.ok(immobili);
        }
        
        // 3. Estrai email dal principal
        String email = (String) authentication.getPrincipal();
        
        // 4. Trova l'utente
        Utente utente = utenteService.findUtenteByEmail(email)
                .orElse(null);
                
        if (utente == null) {
            return ResponseEntity.ok(List.of()); // Utente non trovato, lista vuota
        }
        
        // 5. Se è ADMIN (idRuolo = 2) → vede tutti gli immobili
        if (utente.getIdRuolo() == 2) {
            List<Immobile> immobili = immobileService.findAllImmobili();
            return ResponseEntity.ok(immobili);
        }
        
        // 6. Se è UTENTE NORMALE (idRuolo = 1) → cerca se è un venditore
        List<Venditore> venditori = venditoreService.findVenditoreByIdUtente(utente.getIdUtente());
        
        if (venditori.isEmpty()) {
            // Non è un venditore, non ha immobili
            return ResponseEntity.ok(List.of());
        }
        
        // 7. Trova tutti gli immobili del venditore
        Venditore venditore = venditori.get(0); // Prendi il primo (un utente dovrebbe avere un solo profilo venditore)
        List<Immobile> immobili = immobileService.findImmobiliByIdVenditore(venditore.getIdVenditore());
        
        return ResponseEntity.ok(immobili);
    }

    // GET immobile per ID
    // GET http://localhost:8080/api/immobili/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Immobile> getImmobileById(@PathVariable Integer id) {
        Optional<Immobile> immobile = immobileService.findImmobileById(id);
        return immobile.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET immobili per id_venditore
    // GET http://localhost:8080/api/immobili/venditore/{idVenditore}
    @GetMapping("/venditore/{idVenditore}")
    public ResponseEntity<List<Immobile>> getImmobiliByVenditore(@PathVariable Integer idVenditore) {
        List<Immobile> immobili = immobileService.findImmobiliByIdVenditore(idVenditore);
        return ResponseEntity.ok(immobili);
    }

    // GET immobili per tipo
    // GET http://localhost:8080/api/immobili/tipo/{tipo}
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Immobile>> getImmobiliByTipo(@PathVariable TipoImmobile tipo) {
        List<Immobile> immobili = immobileService.findImmobiliByTipo(tipo);
        return ResponseEntity.ok(immobili);
    }

    // GET immobili per stato
    // GET http://localhost:8080/api/immobili/stato/{stato}
    @GetMapping("/stato/{stato}")
    public ResponseEntity<List<Immobile>> getImmobiliByStato(@PathVariable StatoImmobile stato) {
        List<Immobile> immobili = immobileService.findImmobiliByStato(stato);
        return ResponseEntity.ok(immobili);
    }

    // GET immobili per città
    // GET http://localhost:8080/api/immobili/citta/{citta}
    @GetMapping("/citta/{citta}")
    public ResponseEntity<List<Immobile>> getImmobiliByCitta(@PathVariable String citta) {
        List<Immobile> immobili = immobileService.findImmobiliByCitta(citta);
        return ResponseEntity.ok(immobili);
    }

    // GET immobili per CAP
    // GET http://localhost:8080/api/immobili/cap/{cap}
    @GetMapping("/cap/{cap}")
    public ResponseEntity<List<Immobile>> getImmobiliByCap(@PathVariable String cap) {
        List<Immobile> immobili = immobileService.findImmobiliByCap(cap);
        return ResponseEntity.ok(immobili);
    }

    // GET immobili per provincia
    // GET http://localhost:8080/api/immobili/provincia/{provincia}
    @GetMapping("/provincia/{provincia}")
    public ResponseEntity<List<Immobile>> getImmobiliByProvincia(@PathVariable String provincia) {
        List<Immobile> immobili = immobileService.findImmobiliByProvincia(provincia);
        return ResponseEntity.ok(immobili);
    }

    /**
     * POST crea nuovo immobile
     * SOLO ADMIN può creare immobili
     * 
     * POST http://localhost:8080/api/immobili
     */
    @PostMapping
    @Operation(
        summary = "Crea nuovo immobile",
        description = "SOLO ADMIN può creare immobili. Utenti normali ricevono 403 Forbidden.",
        security = @SecurityRequirement(name = "bearer-jwt")
    )
    public ResponseEntity<?> createImmobile(@RequestBody Immobile immobile) {
        // Verifica che sia ADMIN
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) authentication.getPrincipal();
        Utente utente = utenteService.findUtenteByEmail(email).orElse(null);
        
        if (utente == null || utente.getIdRuolo() != 2) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Solo gli amministratori possono creare immobili");
        }
        
        Immobile nuovoImmobile = immobileService.saveImmobile(immobile);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuovoImmobile);
    }

    /**
     * PUT aggiorna immobile completo
     * SOLO ADMIN può modificare immobili
     * 
     * PUT http://localhost:8080/api/immobili/{id}
     */
    @PutMapping("/{id}")
    @Operation(
        summary = "Aggiorna immobile completo",
        description = "SOLO ADMIN può modificare immobili. Utenti normali ricevono 403 Forbidden.",
        security = @SecurityRequirement(name = "bearer-jwt")
    )
    public ResponseEntity<?> updateImmobile(@PathVariable Integer id, @RequestBody Immobile immobile) {
        // Verifica che sia ADMIN
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) authentication.getPrincipal();
        Utente utente = utenteService.findUtenteByEmail(email).orElse(null);
        
        if (utente == null || utente.getIdRuolo() != 2) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Solo gli amministratori possono modificare immobili");
        }
        
        try {
            Immobile immobileAggiornato = immobileService.updateImmobile(id, immobile);
            return ResponseEntity.ok(immobileAggiornato);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * PATCH aggiorna immobile parziale
     * SOLO ADMIN può modificare immobili
     * 
     * PATCH http://localhost:8080/api/immobili/{id}
     */
    @PatchMapping("/{id}")
    @Operation(
        summary = "Aggiorna immobile parzialmente",
        description = "SOLO ADMIN può modificare immobili. Utenti normali ricevono 403 Forbidden.",
        security = @SecurityRequirement(name = "bearer-jwt")
    )
    public ResponseEntity<?> patchImmobile(@PathVariable Integer id, @RequestBody Immobile immobile) {
        // Verifica che sia ADMIN
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) authentication.getPrincipal();
        Utente utente = utenteService.findUtenteByEmail(email).orElse(null);
        
        if (utente == null || utente.getIdRuolo() != 2) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Solo gli amministratori possono modificare immobili");
        }
        
        try {
            Immobile immobileAggiornato = immobileService.patchImmobile(id, immobile);
            return ResponseEntity.ok(immobileAggiornato);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE elimina immobile
     * SOLO ADMIN può eliminare immobili
     * 
     * DELETE http://localhost:8080/api/immobili/{id}
     */
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Elimina immobile",
        description = "SOLO ADMIN può eliminare immobili. Utenti normali ricevono 403 Forbidden.",
        security = @SecurityRequirement(name = "bearer-jwt")
    )
    public ResponseEntity<?> deleteImmobile(@PathVariable Integer id) {
        // Verifica che sia ADMIN
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) authentication.getPrincipal();
        Utente utente = utenteService.findUtenteByEmail(email).orElse(null);
        
        if (utente == null || utente.getIdRuolo() != 2) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Solo gli amministratori possono eliminare immobili");
        }
        
        try {
            immobileService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}