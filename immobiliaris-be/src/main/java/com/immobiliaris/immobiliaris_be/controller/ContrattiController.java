package com.immobiliaris.immobiliaris_be.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.immobiliaris.immobiliaris_be.enums.StatoContratto;
import com.immobiliaris.immobiliaris_be.model.Contratto;
import com.immobiliaris.immobiliaris_be.services.ContrattiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/contratti")
@CrossOrigin(origins = "*")
public class ContrattiController {

    @Autowired
    private ContrattiService service;

    //GET tutti i contratti
    @GetMapping
    public ResponseEntity<List<Contratto>> getAllContratti() {
        List<Contratto> contratti = service.findAllContratti();
        return ResponseEntity.ok(contratti);
    }

    //GET contratto per id
    @GetMapping("/{id}")
    public ResponseEntity<Contratto> getContrattoById(@PathVariable Integer Id){
        Optional<Contratto> contratto = service.findContrattoById(Id);
        return contratto.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //GET contratti per id_immobile
    @GetMapping("/immobile/{idImmobile}")
    public ResponseEntity<List<Contratto>> getContrattiByIdImmobile(@PathVariable Integer idImmobile){
        List<Contratto> contratti = service.findContrattiByIdImmobile(idImmobile);
        return ResponseEntity.ok(contratti);
    }

    //GET contratti per id_venditore
    @GetMapping("/venditore/{idVenditore}")
    public ResponseEntity<List<Contratto>> getContrattiByIdVenditore(@PathVariable Integer idVenditore){
        List<Contratto> contratti = service.findContrattiByIdVenditore(idVenditore);
        return ResponseEntity.ok(contratti);
    }

    //GET contratti per tipo
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Contratto>> getContrattiByTipo(@PathVariable String tipo){
        List<Contratto> contratti = service.findContrattiByTipo(tipo);
        return ResponseEntity.ok(contratti);
    }

    //GET contratti per esclusiva
    @GetMapping("/esclusiva/{esclusiva}")
    public ResponseEntity<List<Contratto>> getContrattiByEsclusiva(@PathVariable Boolean esclusiva){
        List<Contratto> contratti = service.findContrattiByEsclusiva(esclusiva);
        return ResponseEntity.ok(contratti);
    }

    //GET contratti per data_inizio
    @GetMapping("/data-inizio/{dataInizio}")
    public ResponseEntity<List<Contratto>> getContrattiByDataInizio(@PathVariable String dataInizio){
        List<Contratto> contratti = service.findContrattiByDataInizio(java.time.LocalDate.parse(dataInizio));
        return ResponseEntity.ok(contratti);
    }

    //GET contratti per data_fine
    @GetMapping("/data-fine/{dataFine}")
    public ResponseEntity<List<Contratto>> getContrattiByDataFine(@PathVariable String dataFine){
        List<Contratto> contratti = service.findContrattiByDataFine(java.time.LocalDate.parse(dataFine));
        return ResponseEntity.ok(contratti);
    }

    //GET contratti per prezzo minimo
    @GetMapping("/prezzo-finale-minimo/{prezzoFinaleMinimo}")
    public ResponseEntity<List<Contratto>> getContrattiByPrezzoMinimo(@PathVariable Double prezzoMinimo){
        List<Contratto> contratti = service.findContrattiByPrezzoFinaleMinimo(prezzoMinimo);
        return ResponseEntity.ok(contratti);
    }

    //GET contratti per stato
    @GetMapping("/stato/{stato}")
    public ResponseEntity<List<Contratto>> getContrattiByStato(@PathVariable StatoContratto stato){
        List<Contratto> contratti = service.findContrattiByStato(stato);
        return ResponseEntity.ok(contratti);
    }

    //POST crea nuovo contratto
    @PostMapping
    public ResponseEntity<Contratto> createContratto(@RequestBody Contratto contratto){
        Contratto newContratto = service.addContratto(contratto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newContratto);
    }

    //PUT aggiorna contratto completo
    @PutMapping("/{id}")
    public ResponseEntity<Contratto> updateContratto(@PathVariable Integer id,@RequestBody Contratto contratto){
        try{
        Contratto updatedContratto = service.updateContratto(id, contratto);
        return ResponseEntity.ok(updatedContratto);
        } catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    //PATCH aggiorna contratto parziale
    @PatchMapping("/{id}")
    public ResponseEntity<Contratto> patchContratto(@PathVariable Integer id,@RequestBody Contratto contratto){
        try{
            Contratto patchedContratto = service.patchContratto(id, contratto);
            return ResponseEntity.ok(patchedContratto);
        } catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    //DELETE elimina contratto per id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContratto(@PathVariable Integer id){
        try{
            service.deleteContrattoById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }


}
