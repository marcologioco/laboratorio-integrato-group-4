package com.immobiliaris.immobiliaris_be.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.immobiliaris.immobiliaris_be.model.Venditore;

@Repository
public interface VenditoreRepo extends JpaRepository<Venditore, Integer>{

    //Trova per id_venditore
    //SELECT * FROM venditore WHERE id_venditore = ?;
    List<Venditore> findByIdVenditore(Integer id_venditore);

    //Trova per id_utente
    //SELECT * FROM venditore WHERE id_utente = ?;
    List<Venditore> findByIdUtenteVenditore(String id_utente);

    //Trova per nome
    //SELECT * FROM venditore WHERE nome = ?;
    List<Venditore> findByNomeVenditore(String nome);

    //Trova per nome
    //SELECT * FROM venditore WHERE cognome = ?;
    List<Venditore> findByCognomeVenditore(String cognome);

    //Trova per email
    //SELECT * FROM venditore WHERE email = ?;
    List<Venditore> findByEmailVenditore(String email);

    //Trova per telefono
    //SELECT * FROM venditore WHERE telefono = ?;
    List<Venditore> findByTelefonoVenditore(String telefono);

    //Trova per indirizzo
    //SELECT * FROM venditore WHERE indirizzo = ?;
    List<Venditore> findByIndirizzoVenditore(String indirizzo);

    //Trova per citta
    //SELECT * FROM venditore WHERE citta = ?;
    List<Venditore> findByCittaVenditore(String citta);

    //Trova per provincia
    //SELECT * FROM venditore WHERE provincia = ?;
    List<Venditore> findByProvinciaVenditore(String provincia);

    //Trova per codice_fiscale
    //SELECT * FROM venditore WHERE codice_fiscale = ?;
    List<Venditore> findByCodiceFiscaleVenditore(String codice_fiscale);
}
