package com.immobiliaris.immobiliaris_be.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.immobiliaris.immobiliaris_be.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Filtro JWT che intercetta TUTTE le richieste HTTP
 * 
 * Flusso:
 * 1. Estrae il token dall'header "Authorization: Bearer {token}"
 * 2. Valida il token usando JwtUtil
 * 3. Se valido, estrae userId e ruolo
 * 4. Crea un'autenticazione e la mette nel SecurityContext
 * 5. Spring Security usa questa autenticazione per decidere se permettere l'accesso
 * 
 * Questo filtro viene eseguito PRIMA di SecurityFilterChain
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Metodo principale che viene chiamato per ogni richiesta HTTP
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // 1. Estrai l'header Authorization
        String authHeader = request.getHeader("Authorization");

        // 2. Verifica che l'header esista e inizi con "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // 3. Estrai il token (rimuovi "Bearer " dall'inizio)
            String token = authHeader.substring(7);

            try {
                // 4. Valida il token
                if (jwtUtil.validateToken(token)) {
                    // 5. Estrai informazioni dal token
                    String email = jwtUtil.getEmailFromToken(token);
                    Integer userId = jwtUtil.getUserIdFromToken(token);
                    Integer ruoloId = jwtUtil.getRuoloFromToken(token);

                    // 6. Determina il ruolo (1 = ROLE_USER, 2 = ROLE_ADMIN)
                    String role = ruoloId == 2 ? "ROLE_ADMIN" : "ROLE_USER";
                    
                    System.out.println("🔍 DEBUG: ruoloId dal token = " + ruoloId);
                    System.out.println("🔍 DEBUG: role assegnato = " + role);

                    // 7. Crea l'oggetto autenticazione
                    // Spring Security usa questo per sapere chi è l'utente e che ruolo ha
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    email,                                          // Principal (chi è)
                                    null,                                           // Credentials (password - non serve)
                                    java.util.List.of(new SimpleGrantedAuthority(role))  // Authorities (ruoli)
                            );

                    // 8. Aggiungi dettagli della richiesta (IP, session, ecc.)
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // 9. Metti l'autenticazione nel SecurityContext
                    // Da questo momento Spring Security sa che l'utente è autenticato
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    // Debug log (opzionale)
                    System.out.println("✅ Token valido per: " + email + " (userId: " + userId + ", ruolo: " + role + ")");
                    System.out.println("🔍 DEBUG: Authorities = " + authentication.getAuthorities());
                }
            } catch (Exception e) {
                // Token non valido o scaduto
                System.out.println("❌ Token non valido: " + e.getMessage());
                // Non facciamo nulla, la richiesta continuerà ma senza autenticazione
            }
        }

        // 10. Passa la richiesta al prossimo filtro nella catena
        // Se l'utente è autenticato, SecurityFilterChain permetterà l'accesso
        // Se non è autenticato, SecurityFilterChain bloccherà (se l'endpoint richiede auth)
        filterChain.doFilter(request, response);
    }
}
