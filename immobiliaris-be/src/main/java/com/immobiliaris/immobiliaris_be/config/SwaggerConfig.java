package com.immobiliaris.immobiliaris_be.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Immobiliaris API")
                        .version("1.0.0")
                        .description("""
                                API REST per la gestione del sistema Immobiliaris.
                                
                                ### Funzionalità principali:
                                * Gestione immobili
                                * Valutazioni immobiliari
                                * Gestione utenti
                                * Ricerca avanzata
                                
                                ### Autenticazione:
                                Per utilizzare gli endpoint protetti:
                                1. Fare login con POST /api/auth/login
                                2. Copiare il token dalla risposta
                                3. Cliccare il bottone "Authorize" in alto
                                4. Inserire: Bearer {token}
                                """)
                        .contact(new Contact()
                                .name("Team InnovaRe - Immobiliaris")
                                .url("https://github.com/marcologioco/laboratorio-integrato-group-4")))
                .components(new Components()
                        .addSecuritySchemes("bearer-jwt", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Inserire il token JWT ottenuto dal login")));
    }
}