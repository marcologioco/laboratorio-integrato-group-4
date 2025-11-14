package com.immobiliaris.immobiliaris_be.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.immobiliaris.immobiliaris_be.enums.StatoImmobile;
import com.immobiliaris.immobiliaris_be.enums.TipoImmobile;
import com.immobiliaris.immobiliaris_be.model.Immobile;
import com.immobiliaris.immobiliaris_be.services.ImmobileService;

@RestController
@RequestMapping("/api/immobili")
@CrossOrigin(origins = "*")
public class ImmobileController {

    @Autowired
    private ImmobileService immobileService;

    // GET tutti gli immobili
    // GET http://localhost:8080/api/immobili
    @GetMapping
    public ResponseEntity<List<Immobile>> getAllImmobili() {
        List<Immobile> immobili = immobileService.findAllImmobili();
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

    // POST crea nuovo immobile
    // POST http://localhost:8080/api/immobili
    @PostMapping
    public ResponseEntity<Immobile> createImmobile(@RequestBody Immobile immobile) {
        Immobile nuovoImmobile = immobileService.saveImmobile(immobile);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuovoImmobile);
    }

    // PUT aggiorna immobile completo
    // PUT http://localhost:8080/api/immobili/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Immobile> updateImmobile(@PathVariable Integer id, @RequestBody Immobile immobile) {
        try {
            Immobile immobileAggiornato = immobileService.updateImmobile(id, immobile);
            return ResponseEntity.ok(immobileAggiornato);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PATCH aggiorna immobile parziale
    // PATCH http://localhost:8080/api/immobili/{id}
    @PatchMapping("/{id}")
    public ResponseEntity<Immobile> patchImmobile(@PathVariable Integer id, @RequestBody Immobile immobile) {
        try {
            Immobile immobileAggiornato = immobileService.patchImmobile(id, immobile);
            return ResponseEntity.ok(immobileAggiornato);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE elimina immobile
    // DELETE http://localhost:8080/api/immobili/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImmobile(@PathVariable Integer id) {
        try {
            immobileService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}