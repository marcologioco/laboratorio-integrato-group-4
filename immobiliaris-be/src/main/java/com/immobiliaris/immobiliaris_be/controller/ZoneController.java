package com.immobiliaris.immobiliaris_be.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.immobiliaris.immobiliaris_be.model.Zona;
import com.immobiliaris.immobiliaris_be.services.ZoneService;

@RestController
@RequestMapping("/api/zone")
@CrossOrigin(origins = "*")
public class ZoneController {

    @Autowired
    private ZoneService service;

    //GET tutte le zone
    @GetMapping
    public ResponseEntity<List<Zona>> getAllZone(){
        List<Zona> zone = service.findAllZone();
        return ResponseEntity.ok(zone);
    }

    //GET zona per cap
    @GetMapping("/{id}")
    public ResponseEntity<Zona> getZonaByCap(@PathVariable String cap){
        return service.findZonaByCap(cap)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //GET zona per nome
    @GetMapping("/nome/{nomeZona}")
    public ResponseEntity<Zona> getZonaByNome(@PathVariable String nome){
        Zona zona = service.findZonaByNome(nome);
        return ResponseEntity.ok(zona);
    }

    //GET zone per prezzo medio
    @GetMapping("/prezzo-medio/{prezzoMedioSqm}")
    public ResponseEntity<List<Zona>> getZonaByPrezzoMedio(@PathVariable Double prezzo){
        List<Zona> zone = service.findZonaByPrezzoMedio(prezzo);
        return ResponseEntity.ok(zone);
    }

    //POST crea nuova zona
    @PostMapping
    public ResponseEntity<Zona> createZona(@RequestBody Zona zona){
        Zona newZona = service.addZona(zona);
        return ResponseEntity.status(HttpStatus.CREATED).body(newZona);
    }

    //PUT aggiorna zona completa
    @PutMapping("/{id}")
    public ResponseEntity<Zona> updateZona(@PathVariable String cap, @RequestBody Zona zona){
        try{
            Zona updatedZona = service.updateZona(cap, zona);
            return ResponseEntity.ok(updatedZona);
        } catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    //PATCH aggiorna zona parziale
    @PatchMapping("/{id}")
    public ResponseEntity<Zona> patchZona(@PathVariable String cap, @RequestBody Zona zona){
        try{
            Zona patchedZona = service.patchZona(cap, zona);
            return ResponseEntity.ok(patchedZona);
        } catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

    //elimina zona per id
    @DeleteMapping
    public ResponseEntity<Void> deleteZonaById(@PathVariable String cap){
        try{
            service.deleteZonaById(cap);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e){
            return ResponseEntity.notFound().build();
        }
    }

}
