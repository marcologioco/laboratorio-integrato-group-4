package com.immobiliaris.immobiliaris_be.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

/**
 * Gestore globale delle eccezioni per fornire risposte uniformi
 * agli errori di validazione e altri errori dell'applicazione
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Gestisce errori di validazione Bean Validation (@Valid)
     * Restituisce un JSON con campo → messaggio di errore
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        
        // Estrai tutti gli errori di validazione
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        response.put("status", "error");
        response.put("message", "Errori di validazione");
        response.put("errors", errors);
        
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Gestisce errori di validazione a livello di constraint
     */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(
            ConstraintViolationException ex) {
        
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        
        // Estrai tutti i constraint violati
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            String propertyPath = violation.getPropertyPath().toString();
            String message = violation.getMessage();
            errors.put(propertyPath, message);
        }
        
        response.put("status", "error");
        response.put("message", "Errori di validazione");
        response.put("errors", errors);
        
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * Gestisce eccezioni generiche
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", "Errore interno del server");
        response.put("details", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
