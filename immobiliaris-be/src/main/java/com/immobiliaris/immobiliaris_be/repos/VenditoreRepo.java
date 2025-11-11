package com.immobiliaris.immobiliaris_be.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.immobiliaris.immobiliaris_be.model.Venditore;

@Repository
public interface VenditoreRepo extends JpaRepository<Venditore, Integer> {

    // Trova per id_utente
    // SELECT * FROM venditore WHERE id_utente = ?
    List<Venditore> findByIdUtente(Integer idUtente);

    // Trova per nome
    // SELECT * FROM venditore WHERE nome = ?
    List<Venditore> findByNome(String nome);

    // Trova per cognome
    // SELECT * FROM venditore WHERE cognome = ?
    List<Venditore> findByCognome(String cognome);

    // Trova per email
    // SELECT * FROM venditore WHERE email = ?
    List<Venditore> findByEmail(String email);

    // Trova per telefono
    // SELECT * FROM venditore WHERE telefono = ?
    List<Venditore> findByTelefono(String telefono);

    // Trova per indirizzo
    // SELECT * FROM venditore WHERE indirizzo = ?
    List<Venditore> findByIndirizzo(String indirizzo);

    // Trova per citta
    // SELECT * FROM venditore WHERE citta = ?
    List<Venditore> findByCitta(String citta);

    // Trova per provincia
    // SELECT * FROM venditore WHERE provincia = ?
    List<Venditore> findByProvincia(String provincia);

    // Trova per codice_fiscale
    // SELECT * FROM venditore WHERE codice_fiscale = ?
    List<Venditore> findByCodiceFiscale(String codiceFiscale);
}
