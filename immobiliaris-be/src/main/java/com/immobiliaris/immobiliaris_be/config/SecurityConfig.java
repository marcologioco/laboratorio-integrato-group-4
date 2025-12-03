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

/**
 * Configurazione sicurezza Spring Security con JWT
 * 
 * IMPORTANTE PRODUZIONE:
 * - Rimuovere accesso H2 Console (.requestMatchers("/h2/**").permitAll())
 * - Abilitare CSRF se necessario
 * - Configurare CORS con domini specifici
 * - Rimuovere frameOptions disable
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            .headers(headers -> headers
                .frameOptions(frame -> frame.disable()) // Per H2 Console (solo sviluppo)
            )
            
            .authorizeHttpRequests(auth -> auth
                // Endpoint pubblici (senza autenticazione)
                .requestMatchers("/h2/**").permitAll()
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/utenti").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/valutazioni/automatica").permitAll()
                .requestMatchers("/api/zone/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/api-docs/**", "/swagger").permitAll()
                
                // File statici pubblici (HTML, CSS, JS, immagini)
                .requestMatchers("/", "/index.html", "/login.html").permitAll()
                .requestMatchers("/styles/**", "/js/**", "/assets/**", "/*.html").permitAll()
                
                // Endpoint autenticati (qualsiasi utente loggato)
                .requestMatchers("/api/auth/me", "/api/auth/validate").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/immobili/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/valutazioni/utente/*").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/valutazioni/logged").authenticated()
                
                // Endpoint solo admin
                .requestMatchers("/api/immobili/**").hasRole("ADMIN")
                .requestMatchers("/api/utenti/**").hasRole("ADMIN")
                .requestMatchers("/api/venditori/**").hasRole("ADMIN")
                .requestMatchers("/api/contratti/**").hasRole("ADMIN")
                .requestMatchers("/api/valutazioni/**").hasRole("ADMIN")
                
                // Tutto il resto richiede autenticazione
                .anyRequest().authenticated()
            )
            
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }
}
