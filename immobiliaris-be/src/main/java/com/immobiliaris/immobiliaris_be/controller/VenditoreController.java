package com.immobiliaris.immobiliaris_be.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.immobiliaris.immobiliaris_be.model.Venditore;
import com.immobiliaris.immobiliaris_be.services.VenditoreService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/api/venditori")
@CrossOrigin(origins = "*")
public class VenditoreController {
    
    @Autowired
    private VenditoreService venditoreService;

    // GET tutti i venditori
    // GET http://localhost:8080/api/venditori
    @GetMapping
    public ResponseEntity<List<Venditore>> getAllVenditori() {
        List<Venditore> venditori= venditoreService.findAllVenditori();
        return ResponseEntity.ok(venditori);
    }
    
    // GET venditore per ID
    // GET http://localhost:8080/api/venditori/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Venditore> getVenditoreById(@PathVariable Integer id) {
        Optional <Venditore> venditore = venditoreService.findVenditoreById(id);
        return venditore.map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // GET venditori per id_utente
    // GET http://localhost:8080/api/venditori/utente/{idUtente}
    @GetMapping("/utente/{idUtente}")
    public ResponseEntity<List<Venditore>> getVenditoreByUtente(@PathVariable Integer idUtente) {
        List<Venditore> venditori = venditoreService.findVenditoreByIdUtente(idUtente);
        return ResponseEntity.ok(venditori);
    }

    // POST crea nuovo venditore
    // POST http://localhost:8080/api/venditori
    @PostMapping
    public ResponseEntity<Venditore> createVenditore(@RequestBody Venditore venditore) {
        Venditore nuovoVenditore = venditoreService.saveVenditore(venditore);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuovoVenditore);
    }

    // PUT aggiorna venditore completo
    // PUT http://localhost:8080/api/venditori/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Venditore> updateVenditore(@PathVariable Integer id, @RequestBody Venditore venditore) {
        try {
            Venditore venditoreAggiornato = venditoreService.updateVenditore(id, venditore);
            return ResponseEntity.ok(venditoreAggiornato);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PATCH aggiorna venditore parziale
    // PATCH http://localhost:8080/api/venditori/{id}
    @PatchMapping("/{id}")
    public ResponseEntity<Venditore> patchVenditore(@PathVariable Integer id, @RequestBody Venditore venditore) {
        try {
            Venditore venditoreAggiornato = venditoreService.patchVenditore(id, venditore);
            return ResponseEntity.ok(venditoreAggiornato);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE elimina venditore
    // DELETE http://localhost:8080/api/venditori/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVenditore(@PathVariable Integer id) {
        try {
            venditoreService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET venditori per nome
    // GET http://localhost:8080/api/venditori/nome/{nome}
    @GetMapping("/nome/{nome}")
    public ResponseEntity<List<Venditore>> getVenditoreByNome(@PathVariable String nome) {
        List<Venditore> venditori=venditoreService.findVenditoreByNome(nome);
        return ResponseEntity.ok(venditori);
    }
    
    // GET venditori per cognome
    // GET http://localhost:8080/api/venditori/cognome/{cognome}
    @GetMapping("/cognome/{cognome}")
    public ResponseEntity<List<Venditore>> getVenditoreByCognome(@PathVariable String cognome) {
        List<Venditore> venditori = venditoreService.findVenditoreByCognome(cognome);
        return ResponseEntity.ok(venditori);
    }

    // GET venditori per email
    // GET http://localhost:8080/api/venditori/email/{email}
    @GetMapping("/email/{email}")
    public ResponseEntity<List<Venditore>> getVenditoreByEmail(@PathVariable String email) {
        List<Venditore> venditori = venditoreService.findVenditoreByEmail(email);
        return ResponseEntity.ok(venditori);
    }

    // GET venditori per telefono
    // GET http://localhost:8080/api/venditori/telefono/{telefono}
    @GetMapping("/telefono/{telefono}")
    public ResponseEntity<List<Venditore>> getVenditoreByTelefono(@PathVariable String telefono) {
        List<Venditore> venditori = venditoreService.findVenditoreByTelefono(telefono);
        return ResponseEntity.ok(venditori);
    }

    // GET venditori per indirizzo
    // GET http://localhost:8080/api/venditori/indirizzo/{indirizzo}
    @GetMapping("/indirizzo/{indirizzo}")
    public ResponseEntity<List<Venditore>> getVenditoreByIndirizzo(@PathVariable String indirizzo) {
        List<Venditore> venditori = venditoreService.findVenditoreByIndirizzo(indirizzo);
        return ResponseEntity.ok(venditori);
    }

    // GET venditori per citta
    // GET http://localhost:8080/api/venditori/citta/{citta}
    @GetMapping("/citta/{citta}")
    public ResponseEntity<List<Venditore>> getVenditoreByCitta(@PathVariable String citta) {
        List<Venditore> venditori = venditoreService.findVenditoreByCitta(citta);
        return ResponseEntity.ok(venditori);
    }

    // GET venditori per provincia
    // GET http://localhost:8080/api/venditori/provincia/{provincia}
    @GetMapping("/provincia/{provincia}")
    public ResponseEntity<List<Venditore>> getVenditoreByProvincia(@PathVariable String provincia) {
        List<Venditore> venditori = venditoreService.findVenditoreByProvincia(provincia);
        return ResponseEntity.ok(venditori);
    }

    // GET venditori per codice fiscale
    // GET http://localhost:8080/api/venditori/codicefiscale/{codiceFiscale}
    @GetMapping("/codicefiscale/{codiceFiscale}")
    public ResponseEntity<List<Venditore>> getVenditoreByCodiceFiscale(@PathVariable String codiceFiscale) {
        List<Venditore> venditori = venditoreService.findVenditoreByCodiceFiscale(codiceFiscale);
        return ResponseEntity.ok(venditori);
    }
    

}
