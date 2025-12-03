# Immobiliaris - Portale Immobiliare

## Team

Progetto realizzato dal **Group 4** - Team InnovaRe  
Corso: Laboratorio Integrato  
Repository: [laboratorio-integrato-group-4](https://github.com/marcologioco/laboratorio-integrato-group-4)

**Membri del Team:**

- Lamguanouah Badr (Web Developer) - [GitHub](https://github.com/pandabluh)
- Lo Gioco Marco (Web Developer - Team Leader) - [GitHub](https://github.com/marcologioco)
- Vecchi Alessandro (Web Developer) - [GitHub](https://github.com/itstyuda)
- Ferrero Tommaso Francesco (Software Developer - Referente SWD) - [GitHub](https://github.com/Tommaferre)
- Nechainikov Yaroslav (Software Developer) - [GitHub](https://github.com/YaroslavNechainikov)
- Chimirri Simone (Software Developer) - [GitHub](https://github.com/SimoneChimirri)
- Casabianca Ivan (Digital Strategist)
- Lasagno Luca (Digital Strategist)
- Affinito Clarissa (Digital Strategist - Referente)

## Descrizione del Progetto

Portale web professionale per agenzia immobiliare che opera in Piemonte. Il sistema modernizza il processo di acquisizione immobili in esclusiva attraverso valutazioni automatiche basate su dati di mercato e gestione completa dei contratti.

**Target di riferimento:** Fascia 35-55 anni  
**Area geografica:** Province di Torino, Cuneo, Alessandria e Asti

## Funzionalità Principali

**Valutazione Automatica Immobili**  
Stima immediata del valore di mercato basata su dati georeferenziati e caratteristiche dell'immobile.

**Dashboard Utente**  
Area personale per il tracciamento delle richieste di valutazione e visualizzazione storico.

**Dashboard Amministratore**  
Gestione centralizzata di immobili, utenti, valutazioni e contratti con accesso completo alle funzionalità del sistema.

**Sistema Contratti**  
Generazione e gestione contratti di vendita in esclusiva con template personalizzabili.

**Autenticazione Sicura**  
Sistema di autenticazione basato su JWT con gestione ruoli utente e amministratore.

## Stack Tecnologico

**Backend**

- Java 17 + Spring Boot 3.5.6
- Spring Security + JWT
- H2 Database (in-memory)
- Swagger/OpenAPI

**Frontend**

- HTML5/CSS3 + Tailwind CSS
- JavaScript Vanilla
- Swiper.js

**Tools**

- Maven
- Git/GitHub

## Struttura del Progetto

```bash
immobiliaris-be/
├── src/main/
│   ├── java/com/immobiliaris/immobiliaris_be/
│   │   ├── config/      # Security, JWT, Swagger
│   │   ├── controller/  # REST API
│   │   ├── model/       # Entità JPA
│   │   ├── services/    # Business Logic
│   │   └── repos/       # Repository
│   └── resources/
│       ├── static/      # Frontend (HTML/CSS/JS)
│       └── data-test.sql
└── pom.xml
```

## Installazione e Avvio

**Prerequisiti:** Java 17+, Maven 3.6+

```bash
# Clona repository
git clone https://github.com/marcologioco/laboratorio-integrato-group-4.git
cd laboratorio-integrato-group-4/immobiliaris-be

# Avvia applicazione con Maven
mvn spring-boot:run
```

**Oppure (più semplice su Windows):**

1. Vai nella cartella `immobiliaris-be\avviamento\`
2. Fai **doppio click** su `start.bat`
3. Attendi l'avvio del progetto (apparirà una finestra console)

L'applicazione sarà disponibile su: `http://localhost:8080`

## Accesso Rapido

### Frontend
- Homepage: http://localhost:8080
- Login: http://localhost:8080/login.html
- Dashboard Admin: http://localhost:8080/admin.html

### Backend
- Swagger UI: http://localhost:8080/swagger
- H2 Console: http://localhost:8080/h2
  - JDBC URL: `jdbc:h2:mem:ImmobiliarisDB`
  - Username: `sa`
  - Password: (vuota)

## Credenziali di Test

| Email | Password | Ruolo | Nome |
|-------|----------|-------|------|
| admin@example.com | admin123 | Amministratore | Admin Default |
| luca.rossi@example.com | pwd123 | Utente | Luca Rossi |
| marta.bianchi@example.com | pwd456 | Utente | Marta Bianchi |
| giulia.verdi@example.com | pwd789 | Utente | Giulia Verdi |
| paolo.ferrari@example.com | pwd101 | Utente | Paolo Ferrari |
| sara.conti@example.com | pwd202 | Utente | Sara Conti |

Nota: Il database è in-memory e viene reinizializzato a ogni riavvio dell'applicazione.

## API Principali

### Endpoint Pubblici (nessuna autenticazione richiesta)
- `POST /api/valutazioni/automatica` - Richiesta valutazione automatica immobile
- `GET /api/immobili` - Elenco immobili con filtri opzionali
- `GET /api/zone` - Zone geografiche e prezzi medi al metro quadro

### Endpoint Protetti (autenticazione JWT richiesta)
- `POST /api/auth/login` - Autenticazione e generazione token
- `GET /api/utenti` - Gestione utenti (solo amministratori)
- `GET /api/valutazioni` - Gestione valutazioni
- `POST /api/contratti` - Creazione e gestione contratti

Per la documentazione completa delle API consultare la [Documentazione Tecnica](./immobiliaris-be/Documentazione/DOCUMENTAZIONE_TECNICA.md).

## Struttura Database

7 tabelle principali:

- **Ruolo** - Definizione ruoli utente
- **Utente** - Utenti registrati (con autenticazione)
- **Venditore** - Proprietari immobili (opzionalmente collegati a Utente)
- **Zona** - Zone geografiche con prezzi medi al m²
- **Immobile** - Immobili in gestione
- **Valutazione** - Richieste di valutazione (automatica + manuale)
- **Contratto** - Contratti di vendita in esclusiva

> Schema completo e relazioni: vedere [DOCUMENTAZIONE_TECNICA.md](./DOCUMENTAZIONE_TECNICA.md)

## Pagine Frontend

**Pubbliche:**

- `index.html` - Homepage + form valutazione 3 step
- `login.html` - Autenticazione

**Protette (autenticazione richiesta):**

- `user.html` - Dashboard utente (valutazioni personali)
- `admin.html` - Dashboard admin (gestione completa sistema)

**File JavaScript:**

- `auth-utils.js` - Gestione JWT e autenticazione
- `valutazione.js` - Form multi-step valutazione
- `admin.js` - Dashboard amministratore
- `user.js` - Dashboard utente

## Documentazione

**Documentazione Completa:**
- [DOCUMENTAZIONE_TECNICA.md](./immobiliaris-be/Documentazione/DOCUMENTAZIONE_TECNICA.md) - Architettura sistema, database e API
- [AUTENTICAZIONE_JWT.md](./immobiliaris-be/Documentazione/AUTENTICAZIONE_JWT.md) - Sistema autenticazione e sicurezza
- [GUIDA_TESTING_VALUTAZIONE.md](./immobiliaris-be/Documentazione/GUIDA_TESTING_VALUTAZIONE.md) - Test e sistema valutazione
- [GUIDA_DEPLOYMENT.md](./immobiliaris-be/Documentazione/GUIDA_DEPLOYMENT.md) - Deploy e configurazione produzione
- [TROUBLESHOOTING.md](./immobiliaris-be/Documentazione/TROUBLESHOOTING.md) - Risoluzione problemi comuni
- [MANUALE_UTENTE.md](./immobiliaris-be/Documentazione/MANUALE_UTENTE.md) - Guida utilizzo sistema

**API Interattiva:**
- Swagger UI: http://localhost:8080/swagger
