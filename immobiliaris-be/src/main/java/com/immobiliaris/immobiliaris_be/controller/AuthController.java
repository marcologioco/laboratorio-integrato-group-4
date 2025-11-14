package com.immobiliaris.immobiliaris_be.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.immobiliaris.immobiliaris_be.dto.LoginRequest;
import com.immobiliaris.immobiliaris_be.dto.LoginResponse;
import com.immobiliaris.immobiliaris_be.services.AuthService;

import io.swagger.v3.oas.annotations.Operation;
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
}
