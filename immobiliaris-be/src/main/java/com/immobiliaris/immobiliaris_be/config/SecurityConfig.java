package com.immobiliaris.immobiliaris_be.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

// RICORDARSI DI RIMUOVERE LE CONFIGURAZIONI DI SICUREZZA DI H2 PRIMA DI ANDARE IN PRODUZIONE!!!


@Configuration
@EnableWebSecurity
public class SecurityConfig {

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
             // Disabilita CSRF (Cross-Site Request Forgery (attacco dove qualcuno fa richieste a tuo nome)) per API REST,CSRF è utile per applicazioni con sessioni e cookie, noi usiamo token
            .headers(headers -> headers
                .frameOptions(frame -> frame.disable())
                // Disabilita X-Frame-Options per permettere l'uso della console H2 in iframe
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/h2/**").permitAll() 
                // Permette accesso alla console H2 senza autenticazione (solo in sviluppo!)
                .anyRequest().permitAll() 
                // Permesso  l'accesso a TUTTE le richieste senza autenticazione, Serve per non bloccare le API mentre sviluppiamo
                // dopo sarà tipo 
                // .authorizeHttpRequests(auth -> auth
                //.requestMatchers("/api/auth/login").permitAll()  //           Login pubblico
                //.requestMatchers("/api/admin/**").hasRole("ADMIN") // Solo admin
                //     .anyRequest().authenticated()  // Tutto il resto richiede login
                // )
            );        
        return http.build();
    }
}
