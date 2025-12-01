# Immobiliaris - Portale Immobiliare

## Team

Progetto realizzato dal **Group 4** - Team InnovaRe  
Corso: Laboratorio Integrato  
Repository: [laboratorio-integrato-group-4](https://github.com/marcologioco/laboratorio-integrato-group-4)

**Membri:**

- Lamguanouah Badr (Web Developer) -> <https://github.com/pandabluh>
- Lo Gioco Marco (Web Developer) -> <https://github.com/marcologioco>
- Vecchi Alessandro (Web Developer) -> <https://github.com/itstyuda>
- Ferrero Tommaso Francesco (Software Developer) -> <https://github.com/Tommaferre>
- Nechainikov Yaroslav (Software Developer) -> <https://github.com/YaroslavNechainikov>
- Chimirri Simone (Software Developer) -> <https://github.com/SimoneChimirri>
- Casabianca Ivan (Digital Strategist)
- Lasagno Luca (Digital Strategist)
- Affinito Clarissa (Digital Strategist)

## Descrizione del Progetto

Portale web per un'agenzia immobiliare piemontese che modernizza l'acquisizione di immobili in esclusiva, con sistema di valutazione automatica e gestione contratti completa.

**Target:** 35-55 anni  
**Area operativa:** Torino, Cuneo, Alessandria, Asti

## Funzionalità Principali

- **Valutazione automatica immobili** - Stima immediata basata su dati di mercato
- **Dashboard utente** - Tracciamento richieste e valutazioni
- **Dashboard admin** - Gestione completa immobili, utenti, valutazioni e contratti
- **Sistema contratti** - Generazione e gestione contratti di vendita in esclusiva
- **Autenticazione JWT** - Sistema sicuro con ruoli (utente/admin)

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

# Avvia applicazione
mvn spring-boot:run 

oppure lanciare il programma .bat

laboratorio-integrato-group-4\immobiliaris-be\start-backend.bat

e attendere l'avvio del progetto
```

L'applicazione sarà disponibile su: `http://localhost:8080`

## Accesso Rapido

**Frontend:**

- Homepage: `http://localhost:8080`
- Login: `http://localhost:8080/login.html`
- Dashboard Admin: `http://localhost:8080/admin.html`

**Backend:**

- Swagger UI: `http://localhost:8080/swagger`
- H2 Console: `http://localhost:8080/h2` (JDBC: `jdbc:h2:mem:ImmobiliarisDB`, user: `sa`, password: vuota)

## Credenziali di Test

| Email | Password | Ruolo |
|-------|----------|-------|
| <admin@example.com> | admin123 | Admin |
| <luca.rossi@example.com> | pwd123 | Utente |

> **Nota:** Database in-memory - i dati si resettano ad ogni riavvio

## API Principali

**Pubbliche (no autenticazione):**

- `POST /api/valutazioni/automatica` - Valutazione automatica immobile
- `GET /api/immobili` - Lista immobili (con filtri)
- `GET /api/zone` - Zone geografiche e prezzi medi

**Protette (JWT richiesto):**

- `POST /api/auth/login` - Login e generazione token
- `GET /api/utenti` - Gestione utenti
- `GET /api/valutazioni` - Gestione valutazioni
- `POST /api/contratti` - Creazione contratti

> Documentazione completa: vedere [DOCUMENTAZIONE_TECNICA.md](./DOCUMENTAZIONE_TECNICA.md)

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

- **[DOCUMENTAZIONE_TECNICA.md](./DOCUMENTAZIONE_TECNICA.md)** - Documentazione completa Backend, Database e Frontend
- **Swagger UI**: <http://localhost:8080/swagger> - API interattiva
