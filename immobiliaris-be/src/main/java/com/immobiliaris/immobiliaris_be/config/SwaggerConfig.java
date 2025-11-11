package com.immobiliaris.immobiliaris_be.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
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
                                """)
                        .contact(new Contact()
                                .name("Team InnovaRe - Immobiliaris")
                                .url("https://github.com/marcologioco/laboratorio-integrato-group-4")));
    }
}