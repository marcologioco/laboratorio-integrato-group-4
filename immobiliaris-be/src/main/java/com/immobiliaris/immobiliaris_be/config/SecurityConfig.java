package com.immobiliaris.immobiliaris_be.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// RICORDARSI DI RIMUOVERE LE CONFIGURAZIONI DI SICUREZZA DI H2 PRIMA DI ANDARE IN PRODUZIONE!!!


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    } 
    //crea un "encoder" per le password usando l'algoritmo BCrypt utile per salvare le password in modo sicuro nel database BCrypt è molto sicuro trasformando la password in un hash non reversibile aggiungendo un "salt" (dato random) per rendere ogni hash unico anche per password uguali

    // Nel service quando salviamo un utente --> String passwordHashata = passwordEncoder.encode("pwd123"); 
    //Risultato: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            // Disabilita CSRF per API REST (usiamo JWT, non sessioni)
            
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                // STATELESS = non creare sessioni HTTP, usiamo solo JWT
            )
            
            .headers(headers -> headers
                .frameOptions(frame -> frame.disable())
                // Disabilita X-Frame-Options per console H2 (SOLO SVILUPPO!)
            )
            
            .authorizeHttpRequests(auth -> auth
                // ===== ENDPOINT PUBBLICI (senza autenticazione) =====
                .requestMatchers("/h2/**").permitAll()                    // Console H2 (SOLO SVILUPPO!)
                .requestMatchers("/api/auth/login").permitAll()           // Login
                .requestMatchers(HttpMethod.POST, "/api/utenti").permitAll()  // Registrazione (solo POST)
                .requestMatchers(HttpMethod.POST, "/api/valutazioni/automatica").permitAll()  // Valutazione automatica
                .requestMatchers("/api/zone/**").permitAll()              // Zone pubbliche
                .requestMatchers("/swagger-ui/**").permitAll()            // Swagger UI
                .requestMatchers("/api-docs/**").permitAll()              // OpenAPI docs
                .requestMatchers("/swagger").permitAll()                  // Swagger redirect
                
                // ===== FILE STATICI PUBBLICI (HTML, CSS, JS, immagini) =====
                .requestMatchers("/", "/index.html").permitAll()          // Homepage
                .requestMatchers("/login.html").permitAll()               // Pagina login
                .requestMatchers("/styles/**").permitAll()                // CSS
                .requestMatchers("/js/**").permitAll()                    // JavaScript
                .requestMatchers("/assets/**").permitAll()                // Immagini e assets
                .requestMatchers("/*.html").permitAll()                   // Tutte le pagine HTML nella root
                
                // ===== ENDPOINT AUTENTICATI (qualsiasi utente loggato - USER e ADMIN) =====
                .requestMatchers("/api/auth/me").authenticated()          // Info utente corrente
                .requestMatchers("/api/auth/validate").authenticated()    // Validazione token
                .requestMatchers(HttpMethod.GET, "/api/immobili/**").authenticated()  // GET immobili per tutti
                .requestMatchers(HttpMethod.GET, "/api/valutazioni/utente/*").authenticated()  // Valutazioni proprie
                .requestMatchers(HttpMethod.POST, "/api/valutazioni/logged").authenticated()  // Nuova valutazione per utente loggato
                
                // ===== ENDPOINT SOLO ADMIN (hasRole richiede ROLE_ADMIN) =====
                .requestMatchers("/api/immobili/**").hasRole("ADMIN")     // POST/PUT/PATCH/DELETE immobili solo admin
                .requestMatchers("/api/utenti/**").hasRole("ADMIN")       // Gestione utenti (tutti i metodi)
                .requestMatchers("/api/venditori/**").hasRole("ADMIN")    // Gestione venditori
                .requestMatchers("/api/contratti/**").hasRole("ADMIN")    // Gestione contratti
                .requestMatchers("/api/valutazioni/**").hasRole("ADMIN")  // Gestione valutazioni (automatica è già permitAll sopra)
                
                // ===== TUTTO IL RESTO RICHIEDE AUTENTICAZIONE =====
                .anyRequest().authenticated()
            )
            
            // Aggiungi il filtro JWT PRIMA del filtro standard di autenticazione
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }
}
