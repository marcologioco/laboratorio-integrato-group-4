package com.immobiliaris.immobiliaris_be.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.immobiliaris.immobiliaris_be.dto.LoginRequest;
import com.immobiliaris.immobiliaris_be.dto.LoginResponse;
import com.immobiliaris.immobiliaris_be.model.Utente;
import com.immobiliaris.immobiliaris_be.services.AuthService;
import com.immobiliaris.immobiliaris_be.services.UtenteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controller per gestire le operazioni di autenticazione
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Autenticazione", description = "API per login e gestione autenticazione")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UtenteService utenteService;

    /**
     * Endpoint per il login
     * 
     * POST /api/auth/login
     * Body: { "email": "admin@example.com", "password": "admin123" }
     * 
     * Risposta successo (200):
     * {
     *   "user": { "idUtente": 1, "nome": "Admin", ... },
     *   "ruolo": "admin"
     * }
     * 
     * Risposta errore (401):
     * "Email o password non validi"
     */
    @PostMapping("/login")
    @Operation(summary = "Login utente", description = "Autentica un utente con email e password")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Se le credenziali sono sbagliate, ritorniamo 401 Unauthorized
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    /**
     * Endpoint per ottenere info utente corrente dal token
     * 
     * GET /api/auth/me
     * Headers: Authorization: Bearer {token}
     * 
     * Risposta successo (200):
     * {
     *   "idUtente": 1,
     *   "nome": "Admin",
     *   "cognome": "Default",
     *   "email": "admin@example.com",
     *   "telefono": "0000000000",
     *   "idRuolo": 2
     * }
     * 
     * Risposta errore (401):
     * "Utente non autenticato"
     */
    @GetMapping("/me")
    @Operation(
        summary = "Ottieni utente corrente", 
        description = "Restituisce i dati dell'utente autenticato dal token JWT",
        security = @SecurityRequirement(name = "bearer-jwt")
    )
    public ResponseEntity<?> getCurrentUser() {
        try {
            // 1. Ottieni l'autenticazione dal SecurityContext
            // (impostata dal JwtAuthenticationFilter)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Utente non autenticato");
            }

            // 2. L'email è nel "principal" dell'autenticazione
            String email = (String) authentication.getPrincipal();

            // 3. Cerca l'utente nel database
            Utente utente = utenteService.findUtenteByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utente non trovato"));

            // 4. Ritorna i dati dell'utente
            return ResponseEntity.ok(utente);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    /**
     * Endpoint per validare un token
     * 
     * GET /api/auth/validate
     * Headers: Authorization: Bearer {token}
     * 
     * Risposta successo (200): { "valid": true }
     * Risposta errore (401): { "valid": false }
     */
    @GetMapping("/validate")
    @Operation(
        summary = "Valida token JWT",
        description = "Verifica se il token JWT è ancora valido",
        security = @SecurityRequirement(name = "bearer-jwt")
    )
    public ResponseEntity<?> validateToken() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication != null && authentication.isAuthenticated()) {
                return ResponseEntity.ok(java.util.Map.of("valid", true));
            } else {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(java.util.Map.of("valid", false));
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("valid", false));
        }
    }
}
