package com.immobiliaris.immobiliaris_be.util;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.immobiliaris.immobiliaris_be.model.Utente;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * Utility class per gestire JWT (JSON Web Tokens)
 * 
 * Funzioni principali:
 * 1. Generare token dopo login
 * 2. Validare token nelle richieste successive
 * 3. Estrarre informazioni dal token (userId, email, ruolo)
 */
@Component
public class JwtUtil {

    // Legge il secret da application.properties
    @Value("${jwt.secret}")
    private String secret;

    // Legge la durata del token da application.properties (in millisecondi)
    @Value("${jwt.expiration}")
    private long expiration;

    /**
     * Genera una SecretKey da usare per firmare/verificare i token
     * Usa l'algoritmo HS256 (HMAC con SHA-256)
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Genera un JWT token per un utente
     * 
     * Il token contiene (payload):
     * - subject: email dell'utente
     * - userId: ID dell'utente
     * - ruolo: ID del ruolo (1=utente, 2=admin)
     * - issuedAt: data di creazione
     * - expiration: data di scadenza
     * 
     * @param utente l'utente per cui generare il token
     * @return il token JWT come stringa
     */
    public String generateToken(Utente utente) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(utente.getEmail())                    // Email come "subject"
                .claim("userId", utente.getIdUtente())         // ID utente
                .claim("ruolo", utente.getIdRuolo())           // Ruolo (1 o 2)
                .issuedAt(now)                                 // Data creazione
                .expiration(expiryDate)                        // Data scadenza
                .signWith(getSigningKey())                     // Firma con la secret key
                .compact();                                    // Genera la stringa finale
    }

    /**
     * Estrae tutti i "claims" (dati) dal token
     * I claims sono le informazioni che abbiamo messo nel token
     * 
     * @param token il token JWT
     * @return oggetto Claims con tutti i dati
     */
    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())   // Verifica la firma
                .build()
                .parseSignedClaims(token)      // Legge il token
                .getPayload();                 // Estrae il payload (i dati)
    }

    /**
     * Estrae l'email (subject) dal token
     */
    public String getEmailFromToken(String token) {
        return extractClaims(token).getSubject();
    }

    /**
     * Estrae l'userId dal token
     */
    public Integer getUserIdFromToken(String token) {
        return extractClaims(token).get("userId", Integer.class);
    }

    /**
     * Estrae il ruolo dal token
     */
    public Integer getRuoloFromToken(String token) {
        return extractClaims(token).get("ruolo", Integer.class);
    }

    /**
     * Verifica se il token è scaduto
     */
    public boolean isTokenExpired(String token) {
        Date expiration = extractClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    /**
     * Valida il token
     * Controlla:
     * 1. Che il token sia firmato correttamente (non modificato)
     * 2. Che non sia scaduto
     * 
     * @param token il token da validare
     * @return true se valido, false altrimenti
     */
    public boolean validateToken(String token) {
        try {
            extractClaims(token);  // Se riesce a estrarre i claims, è valido
            return !isTokenExpired(token);
        } catch (Exception e) {
            // Token non valido (firma errata, formato sbagliato, ecc.)
            return false;
        }
    }
}
