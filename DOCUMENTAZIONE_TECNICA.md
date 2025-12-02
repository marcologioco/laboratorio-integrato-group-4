# Documentazione Tecnica - Backend & Database

**Progetto: Immobiliaris**  
**Versione: 1.0.0**  
**Data: Novembre 2025**

---

## Indice

1. [Panoramica del Sistema](#panoramica-del-sistema)
2. [Architettura Backend](#architettura-backend)
3. [Database - Schema e Relazioni](#database---schema-e-relazioni)
4. [API REST - Swagger](#api-rest---swagger)
5. [Autenticazione e Sicurezza](#autenticazione-e-sicurezza)
6. [Configurazione](#configurazione)
7. [Frontend — Panoramica & obiettivi](#panoramica--obiettivi)  
8. [Frontend — Struttura dei file (percorsi chiave)](#struttura-dei-file-percorsi-chiave)  
9. [Architettura client-side](#architettura-client-side)  
10. [File per file (comportamento dettagliato)](#file-per-file-comportamento-dettagliato)  
11. [API consumate dal frontend (sommario)](#api-utilizzate-dal-frontend-sommario)  
12. [Autenticazione lato client](#flusso-di-autenticazione-client)  
13. [UX, accessibilità e validazione](#ux-accessibilita-e-validazione)  
14. [Workflow sviluppo (Tailwind & build)](#workflow-di-sviluppo-come-aggiornare-gli-stili-e-usare-il-watch-locale)  
15. [Styling e Design (Tailwind)](#styling-e-design-dettagli-tecnici)  
16. [Testing, performance e sicurezza frontend](#testing-e-qualità-raccomandazioni)


---

## Panoramica del Sistema

### Stack Tecnologico

- **Framework**: Spring Boot 3.x
- **Database**: H2 (in-memory per sviluppo)
- **ORM**: Spring Data JPA / Hibernate
- **Sicurezza**: Spring Security + JWT
- **Documentazione API**: Swagger/OpenAPI 3
- **Build Tool**: Maven

### Porte e URL Principali

- **Backend**: `http://localhost:8080`
- **Swagger UI**: `http://localhost:8080/swagger`
- **H2 Console**: `http://localhost:8080/h2`
- **API Docs**: `http://localhost:8080/api-docs`

---

## Architettura Backend

### Pattern Architetturale

Il progetto segue un'architettura **a tre livelli (Three-Tier Architecture)**:

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│    (Controllers + REST Endpoints)       │
├─────────────────────────────────────────┤
│         BUSINESS LOGIC LAYER            │
│    (Services + Business Rules)          │
├─────────────────────────────────────────┤
│         DATA ACCESS LAYER               │
│    (Repositories + JPA Entities)        │
└─────────────────────────────────────────┘
```

### Struttura dei Package

```
com.immobiliaris.immobiliaris_be/
├── config/              # Configurazioni (Security, JWT, Swagger, DataLoader)
├── controller/          # REST Controllers
├── dto/                 # Data Transfer Objects
├── enums/               # Enumerazioni (Stati, Tipi)
├── model/               # Entità JPA
├── repos/               # Repository JPA
├── services/            # Logica di business
└── util/                # Utilities (JwtUtil)
```

---

## Database - Schema e Relazioni

### Database H2

```properties
URL: jdbc:h2:mem:ImmobiliarisDB
Username: sa
Password: (vuota)
Mode: In-memory (i dati vengono istanziati nuovamente al riavvio)
```

### Schema Completo

#### Diagramma ER (Entity-Relationship)

```
┌──────────┐          ┌──────────────┐          ┌──────────────┐
│  RUOLO   │◄─────────┤    UTENTE    ├─────────►│  VENDITORE   │
└──────────┘  1:N     └──────────────┘  0:1     └──────────────┘
                             │                         │
                             │ 1:N                     │ 1:N
                             ▼                         ▼
                      ┌──────────────┐          ┌──────────────┐
                      │ VALUTAZIONE  │          │  CONTRATTO   │
                      └──────────────┘          └──────────────┘
                             │                         │
                             │ N:1                     │ N:1
                             ▼                         ▼
                      ┌──────────────┐◄──────────┬────────────────┐
                      │   IMMOBILE   │           │      ZONA      │
                      └──────────────┘  N:1      └────────────────┘
                                         (via CAP)
```

---

### Tabelle del Database

#### 1. **RUOLO**

Gestisce i ruoli degli utenti del sistema.

| Campo     | Tipo         | Chiave | Vincoli          | Descrizione              |
|-----------|--------------|--------|------------------|--------------------------|
| id_ruolo  | INTEGER      | PK     | AUTO_INCREMENT   | ID univoco del ruolo     |
| nome      | VARCHAR(50)  |        | NOT NULL, UNIQUE | Nome del ruolo           |

**Valori Predefiniti:**

- `utente` - Utente standard
- `admin` - Amministratore del sistema

**Relazioni:**

- 1:N con `UTENTE`

---

#### 2. **UTENTE**

Rappresenta gli utenti registrati nel sistema.

| Campo      | Tipo         | Chiave | Vincoli        | Descrizione                     |
|------------|--------------|--------|----------------|---------------------------------|
| id_utente  | INTEGER      | PK     | AUTO_INCREMENT | ID univoco dell'utente          |
| nome       | VARCHAR      |        |                | Nome dell'utente                |
| cognome    | VARCHAR      |        |                | Cognome dell'utente             |
| email      | VARCHAR      |        | UNIQUE         | Email (usata per il login)      |
| password   | VARCHAR      |        | NOT NULL       | Password hashata (BCrypt)       |
| telefono   | VARCHAR      |        |                | Numero di telefono              |
| id_ruolo   | INTEGER      | FK     |                | Riferimento a RUOLO             |

**Relazioni:**

- N:1 con `RUOLO`
- 1:N con `VALUTAZIONE`
- 0:1 con `VENDITORE` (un utente può essere anche venditore)

**Note Sicurezza:**

- Le password sono hashate con **BCrypt** (algoritmo di hashing sicuro)
- Autenticazione tramite **JWT Token**

---

#### 3. **VENDITORE**

Rappresenta i venditori di immobili (possono essere anche utenti registrati).

| Campo           | Tipo         | Chiave | Vincoli        | Descrizione                        |
|-----------------|--------------|--------|----------------|------------------------------------|
| id_venditore    | INTEGER      | PK     | AUTO_INCREMENT | ID univoco del venditore           |
| id_utente       | INTEGER      | FK     | NULLABLE       | Riferimento a UTENTE (opzionale)   |
| nome            | VARCHAR      |        | NOT NULL       | Nome del venditore                 |
| cognome         | VARCHAR      |        |                | Cognome                            |
| email           | VARCHAR      |        |                | Email di contatto                  |
| telefono        | VARCHAR      |        |                | Telefono di contatto               |
| indirizzo       | VARCHAR      |        |                | Indirizzo del venditore            |
| citta           | VARCHAR      |        |                | Città                              |
| provincia       | VARCHAR      |        |                | Provincia                          |
| codice_fiscale  | VARCHAR      |        |                | Codice fiscale                     |

**Relazioni:**

- N:1 con `UTENTE` (opzionale, un venditore può non essere registrato come utente)
- 1:N con `IMMOBILE`
- 1:N con `CONTRATTO`

**Casi d'uso:**

- Venditore registrato: `id_utente` != NULL
- Venditore non registrato: `id_utente` = NULL

---

#### 4. **ZONA**

Tabella di riferimento per le zone geografiche e i prezzi medi al metro quadro.

| Campo             | Tipo         | Chiave | Vincoli                  | Descrizione                     |
|-------------------|--------------|--------|--------------------------|--------------------------------|
| cap               | VARCHAR(10)  | PK     | NOT NULL                 | Codice Avviamento Postale      |
| nome_zona         | VARCHAR(100) |        |                          | Nome descrittivo della zona    |
| prezzo_medio_sqm  | DOUBLE       |        | NOT NULL, DEFAULT 0.00   | Prezzo medio al m² (€/m²)      |

**Relazioni:**

- 1:N con `IMMOBILE` (via campo `cap`)

**Copertura Geografica:**

- Torino: 32 zone (CAP da 10121 a 10156)
- Altre città: Asti, Alessandria, Cuneo

**Utilizzo:**
Utilizzata dal sistema di **valutazione automatica** per calcolare il valore stimato degli immobili:

```
Valore Stimato = metri_quadri × prezzo_medio_sqm
```

---

#### 5. **IMMOBILE**

Gestisce gli immobili in vendita.

| Campo             | Tipo         | Chiave | Vincoli        | Descrizione                          |
|-------------------|--------------|--------|----------------|--------------------------------------|
| id_immobile       | INTEGER      | PK     | AUTO_INCREMENT | ID univoco dell'immobile             |
| id_venditore      | INTEGER      | FK     | NOT NULL       | Riferimento a VENDITORE              |
| tipo              | ENUM         |        |                | Tipo immobile (APPARTAMENTO, VILLA)  |
| indirizzo         | VARCHAR(255) |        |                | Indirizzo completo                   |
| citta             | VARCHAR(100) |        |                | Città                                |
| provincia         | VARCHAR(50)  |        |                | Provincia                            |
| cap               | VARCHAR(10)  | FK     | NOT NULL       | CAP (riferimento a ZONA)             |
| metri_quadri      | DOUBLE       |        |                | Superficie in m²                     |
| camere            | INTEGER      |        |                | Numero di camere                     |
| bagni             | INTEGER      |        |                | Numero di bagni                      |
| prezzo            | DOUBLE       |        |                | Prezzo richiesto (€)                 |
| descrizione       | TEXT         |        |                | Descrizione dettagliata              |
| stato             | ENUM         |        |                | Stato immobile (vedi sotto)          |
| data_inserimento  | TIMESTAMP    |        | AUTO           | Data inserimento (timestamp)         |

**Enumerazioni:**

**TipoImmobile:**

- `APPARTAMENTO`
- `VILLA`

**StatoImmobile:**

- `NUOVA` - Immobile nuovo/ristrutturato
- `ABITABILE` - Buone condizioni, pronto da abitare
- `DA_RISTRUTTURARE` - Necessita ristrutturazione

**Relazioni:**

- N:1 con `VENDITORE`
- N:1 con `ZONA` (tramite `cap`)
- 1:N con `VALUTAZIONE`
- 1:N con `CONTRATTO`

---

#### 6. **VALUTAZIONE**

Gestisce le richieste di valutazione degli immobili.

| Campo                  | Tipo         | Chiave | Vincoli        | Descrizione                          |
|------------------------|--------------|--------|----------------|--------------------------------------|
| id_valutazione         | INTEGER      | PK     | AUTO_INCREMENT | ID univoco della valutazione         |
| id_immobile            | INTEGER      | FK     | NOT NULL       | Riferimento a IMMOBILE               |
| id_utente              | INTEGER      | FK     |                | Utente che gestisce la valutazione   |
| stato                  | ENUM         |        |                | Stato della valutazione              |
| valore_stimato         | DOUBLE       |        |                | Valore finale dopo verifica umana    |
| valore_calcolato_zona  | DOUBLE       |        |                | Valore automatico (m² × prezzo zona) |
| deadline               | TIMESTAMP    |        |                | Scadenza per completare              |
| data_richiesta         | TIMESTAMP    |        | AUTO           | Data richiesta (creazione)           |
| data_completamento     | TIMESTAMP    |        |                | Data completamento valutazione       |
| note                   | TEXT         |        |                | Note dell'esperto                    |

**Enumerazione StatoValutazione:**

- `IN_CORSO` - Valutazione in fase di elaborazione
- `COMPLETATA` - Valutazione completata
- `ANNULLATA` - Valutazione annullata

**Relazioni:**

- N:1 con `IMMOBILE`
- N:1 con `UTENTE`

**Flusso di Valutazione:**

1. **Richiesta automatica**: Sistema calcola `valore_calcolato_zona`
2. **Assegnazione**: Viene assegnato un `id_utente` (esperto)
3. **Verifica**: L'esperto verifica e inserisce `valore_stimato`
4. **Completamento**: Stato → `COMPLETATA`, `data_completamento` impostata

---

#### 7. **CONTRATTO**

Gestisce i contratti di vendita tra agenzia e venditore.

| Campo                 | Tipo         | Chiave | Vincoli        | Descrizione                        |
|-----------------------|--------------|--------|----------------|------------------------------------|
| id_contratto          | INTEGER      | PK     | AUTO_INCREMENT | ID univoco del contratto           |
| id_immobile           | INTEGER      | FK     | NOT NULL       | Riferimento a IMMOBILE             |
| id_venditore          | INTEGER      | FK     | NOT NULL       | Riferimento a VENDITORE            |
| tipo                  | VARCHAR(30)  |        |                | Tipo contratto (es. "vendita")     |
| esclusiva             | BOOLEAN      |        | DEFAULT TRUE   | Se è in esclusiva con l'agenzia    |
| data_inizio           | DATE         |        | NOT NULL       | Data inizio contratto              |
| data_fine             | DATE         |        |                | Data fine contratto (opzionale)    |
| prezzo_finale_minimo  | DOUBLE       |        |                | Prezzo minimo accettato (€)        |
| stato                 | ENUM         |        | NOT NULL       | Stato del contratto                |
| note                  | TEXT         |        |                | Note aggiuntive                    |

**Enumerazione StatoContratto:**

- `ATTIVO` - Contratto in corso
- `COMPLETATO` - Immobile venduto
- `ANNULLATO` - Contratto annullato

**Relazioni:**

- N:1 con `IMMOBILE`
- N:1 con `VENDITORE`

**Business Rules:**

- `esclusiva = TRUE`: Il venditore affida solo a Immobiliaris
- `data_fine = NULL`: Contratto a tempo indeterminato
- `prezzo_finale_minimo`: Prezzo sotto il quale il venditore non accetta

---

## Relazioni del Database - Dettaglio

### Vincoli di Integrità Referenziale

```sql
-- UTENTE → RUOLO
FOREIGN KEY (id_ruolo) REFERENCES ruolo(id_ruolo)

-- VENDITORE → UTENTE (opzionale)
FOREIGN KEY (id_utente) REFERENCES utente(id_utente) ON DELETE SET NULL

-- IMMOBILE → VENDITORE
FOREIGN KEY (id_venditore) REFERENCES venditore(id_venditore) ON DELETE CASCADE

-- IMMOBILE → ZONA
FOREIGN KEY (cap) REFERENCES zona(cap)

-- VALUTAZIONE → IMMOBILE
FOREIGN KEY (id_immobile) REFERENCES immobile(id_immobile) ON DELETE CASCADE

-- VALUTAZIONE → UTENTE
FOREIGN KEY (id_utente) REFERENCES utente(id_utente) ON DELETE SET NULL

-- CONTRATTO → IMMOBILE
FOREIGN KEY (id_immobile) REFERENCES immobile(id_immobile) ON DELETE CASCADE

-- CONTRATTO → VENDITORE
FOREIGN KEY (id_venditore) REFERENCES venditore(id_venditore) ON DELETE CASCADE
```

### Cardinalità delle Relazioni

| Relazione                  | Cardinalità | Descrizione                               |
|----------------------------|-------------|-------------------------------------------|
| RUOLO ↔ UTENTE             | 1:N         | Un ruolo può avere molti utenti           |
| UTENTE ↔ VENDITORE         | 1:0..1      | Un utente può essere venditore (opzionale)|
| VENDITORE ↔ IMMOBILE       | 1:N         | Un venditore può avere molti immobili     |
| ZONA ↔ IMMOBILE            | 1:N         | Una zona contiene molti immobili          |
| IMMOBILE ↔ VALUTAZIONE     | 1:N         | Un immobile può avere molte valutazioni   |
| UTENTE ↔ VALUTAZIONE       | 1:N         | Un utente gestisce molte valutazioni      |
| IMMOBILE ↔ CONTRATTO       | 1:N         | Un immobile può avere più contratti       |
| VENDITORE ↔ CONTRATTO      | 1:N         | Un venditore può avere molti contratti    |

---

## API REST - Swagger

### Accesso a Swagger UI

```
URL: http://localhost:8080/swagger
```

---

## Endpoints API - Elenco Completo

### 1. **Autenticazione** (`/api/auth`)

#### POST `/api/auth/login`

**Descrizione:** Effettua il login e restituisce un JWT token  
**Accesso:**  Pubblico  
**Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response 200:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tipo": "Bearer",
  "email": "user@example.com",
  "ruolo": "utente"
}
```

#### GET `/api/auth/me`

**Descrizione:** Ottiene i dati dell'utente autenticato  
**Accesso:**  Autenticato  
**Headers:** `Authorization: Bearer {token}`  
**Response 200:**

```json
{
  "id_utente": 1,
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario.rossi@example.com",
  "telefono": "3331234567",
  "id_ruolo": 1
}
```

#### GET `/api/auth/validate`

**Descrizione:** Valida un JWT token  
**Accesso:**  Autenticato  
**Headers:** `Authorization: Bearer {token}`  
**Response 200:**

```json
{
  "valid": true,
  "email": "user@example.com",
  "expiresAt": "2025-11-26T12:00:00"
}
```

---

### 2. **Utenti** (`/api/utenti`)

| Metodo | Endpoint                    | Descrizione                        | Accesso     |
|--------|-----------------------------|------------------------------------|-------------|
| GET    | `/api/utenti`               | Lista tutti gli utenti             | Autenticato |
| GET    | `/api/utenti/{id}`          | Ottiene utente per ID              | Autenticato |
| GET    | `/api/utenti/email/{email}` | Cerca utente per email             | Autenticato |
| GET    | `/api/utenti/ruolo/{idRuolo}` | Lista utenti per ruolo           | Autenticato |
| POST   | `/api/utenti`               | Crea nuovo utente                  | Admin       |
| PUT    | `/api/utenti/{id}`          | Aggiorna utente                    | Admin       |
| DELETE | `/api/utenti/{id}`          | Elimina utente                     | Admin       |

---

### 3. **Venditori** (`/api/venditori`)

| Metodo | Endpoint                              | Descrizione                        | Accesso     |
|--------|---------------------------------------|------------------------------------|-------------|
| GET    | `/api/venditori`                      | Lista tutti i venditori            | Autenticato |
| GET    | `/api/venditori/{id}`                 | Ottiene venditore per ID           | Autenticato |
| GET    | `/api/venditori/utente/{idUtente}`    | Ottiene venditore per ID utente    | Autenticato |
| GET    | `/api/venditori/nome/{nome}`          | Cerca venditori per nome           | Autenticato |
| GET    | `/api/venditori/email/{email}`        | Cerca venditore per email          | Autenticato |
| POST   | `/api/venditori`                      | Crea nuovo venditore               | Autenticato |
| PUT    | `/api/venditori/{id}`                 | Aggiorna venditore                 | Autenticato |
| DELETE | `/api/venditori/{id}`                 | Elimina venditore                  | Admin       |

---

### 4. **Immobili** (`/api/immobili`)

#### GET `/api/immobili`

**Descrizione:** Lista immobili con filtri opzionali  
**Accesso:**  Pubblico  
**Query Parameters:**

- `tipo` (APPARTAMENTO, VILLA)
- `stato` (NUOVA, ABITABILE, DA_RISTRUTTURARE)
- `cittaContiene` (ricerca parziale)
- `prezzoMin` (double)
- `prezzoMax` (double)
- `metriMin` (double)
- `metriMax` (double)

**Response 200:**

```json
[
  {
    "id_immobile": 1,
    "id_venditore": 1,
    "tipo": "APPARTAMENTO",
    "indirizzo": "Via Genova 12",
    "citta": "Torino",
    "provincia": "TO",
    "cap": "10137",
    "metri_quadri": 80.0,
    "camere": 3,
    "bagni": 1,
    "prezzo": 160000.0,
    "descrizione": "Appartamento luminoso...",
    "stato": "ABITABILE",
    "data_inserimento": "2024-05-01T10:00:00"
  }
]
```

#### Altri Endpoints Immobili

| Metodo | Endpoint                           | Descrizione                        |
|--------|------------------------------------|-------------------------------------|
| GET    | `/api/immobili/{id}`               | Ottiene immobile per ID             |
| GET    | `/api/immobili/venditore/{id}`     | Lista immobili di un venditore      |
| GET    | `/api/immobili/tipo/{tipo}`        | Filtra per tipo                     |
| GET    | `/api/immobili/stato/{stato}`      | Filtra per stato                    |
| GET    | `/api/immobili/citta/{citta}`      | Filtra per città                    |
| GET    | `/api/immobili/cap/{cap}`          | Filtra per CAP                      |
| POST   | `/api/immobili`                    | Crea nuovo immobile                 |
| PUT    | `/api/immobili/{id}`               | Aggiorna immobile                   |
| DELETE | `/api/immobili/{id}`               | Elimina immobile (Admin)            |

---

### 5. **Valutazioni** (`/api/valutazioni`)

#### POST `/api/valutazioni/automatica`

**Descrizione:** Richiede una valutazione automatica (calcolo immediato)  
**Accesso:**  Pubblico  
**Body:**

```json
{
  "cap": "10137",
  "metri_quadri": 80.0,
  "camere": 3,
  "bagni": 1,
  "stato": "ABITABILE"
}
```

**Response 200:**

```json
{
  "valore_calcolato_zona": 152000.0,
  "prezzo_medio_zona": 1900.0,
  "metri_quadri": 80.0,
  "zona": "Santa Rita Nord",
  "cap": "10137",
  "messaggio": "Valutazione completata con successo"
}
```

#### Altri Endpoints Valutazioni

| Metodo | Endpoint                            | Descrizione                          |
|--------|-------------------------------------|--------------------------------------|
| GET    | `/api/valutazioni`                  | Lista tutte le valutazioni           |
| GET    | `/api/valutazioni/{id}`             | Ottiene valutazione per ID           |
| GET    | `/api/valutazioni/immobile/{id}`    | Valutazioni di un immobile           |
| GET    | `/api/valutazioni/utente/{id}`      | Valutazioni gestite da utente        |
| GET    | `/api/valutazioni/stato/{stato}`    | Filtra per stato                     |
**Questi endpoint vengono utilizzati nei flussi con utente autenticato — usa sempre `authenticatedFetch` per gli endpoint protetti (aggiunge automaticamente l'header Authorization).**
---

### 6. **Contratti** (`/api/contratti`)

| Metodo | Endpoint                              | Descrizione                        |
|--------|---------------------------------------|------------------------------------|
| GET    | `/api/contratti`                      | Lista tutti i contratti            |
| GET    | `/api/contratti/{id}`                 | Ottiene contratto per ID           |
| GET    | `/api/contratti/immobile/{id}`        | Contratti di un immobile           |
| GET    | `/api/contratti/venditore/{id}`       | Contratti di un venditore          |
| GET    | `/api/contratti/stato/{stato}`        | Filtra per stato                   |
| POST   | `/api/contratti`                      | Crea nuovo contratto               |
| PUT    | `/api/contratti/{id}`                 | Aggiorna contratto                 |
| DELETE | `/api/contratti/{id}`                 | Elimina contratto (Admin)          |

---

### 7. **Zone** (`/api/zone`)

| Metodo | Endpoint                     | Descrizione                        |
|--------|------------------------------|------------------------------------|
| GET    | `/api/zone`                  | Lista tutte le zone (Pubblico)     |
| GET    | `/api/zone/{cap}`            | Ottiene zona per CAP               |
| GET    | `/api/zone/nome/{nomeZona}`  | Cerca per nome zona                |
| POST   | `/api/zone`                  | Crea nuova zona (Admin)            |
| PUT    | `/api/zone/{cap}`            | Aggiorna zona (Admin)              |
| DELETE | `/api/zone/{cap}`            | Elimina zona (Admin)               |

---

## Autenticazione e Sicurezza

### JWT (JSON Web Token)

#### Configurazione

```properties
jwt.secret=ImmobiliarisSecretKeyForJWT2024VerySecureAndLongEnoughForHS256Algorithm
jwt.expiration=86400000  # 24 ore
```

#### Struttura del Token

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "user@example.com",
  "iat": 1700000000,
  "exp": 1700086400
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

#### Flusso di Autenticazione

```
1. Client → POST /api/auth/login (email + password)
2. Server → Verifica credenziali + BCrypt
3. Server → Genera JWT token (durata 24h)
4. Client → Salva token (localStorage/sessionStorage)
5. Client → Invia token in header: Authorization: Bearer {token}
6. Server → JwtAuthenticationFilter valida il token
7. Server → Permette accesso alla risorsa
```

### Spring Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    // Endpoints pubblici (whitelist)
    private static final String[] PUBLIC_URLS = {
        "/api/auth/**",
        "/api/zone/**",
        "/api/immobili/**",
        "/api/valutazioni/automatica",
        "/swagger/**",
        "/h2/**"
    };
    
    // Endpoints protetti (richiede autenticazione)
    protected:
        - /api/utenti/**
        - /api/venditori/**
        - /api/valutazioni/** (eccetto /automatica)
        - /api/contratti/**
    
    // Endpoints admin (richiede ruolo ADMIN)
    admin:
        - DELETE su tutte le risorse
        - POST/PUT su utenti
}
```

### Password Hashing

- **Algoritmo**: BCrypt
- **Strength**: 10 rounds (default Spring Security)
- **Esempio**:

  ```
  Plaintext: password123
  Hash: $2a$10$N9qo8uLOickgx2ZMRZoMye1J2LElJ2pK6/SN0.ZF5k8q5xM1K6mOW
  ```

---

## Frontend 

### Panoramica & obiettivi

Questo progetto utilizza una UI semplice e leggera basata su HTML statico + JavaScript vanilla con Tailwind CSS per styling. Le pagine e gli script sono serviti dal backend Spring Boot (cartella resources/static) così che il sistema rimanga facilmente distribuibile e indipendente da toolchain frontend complesse.

Obiettivi della documentazione frontend:
- Descrivere l'architettura client-side e la struttura dei file
- Documentare comportamento, API consumate e flussi di autenticazione
- Fornire linee guida per sviluppo, test e personalizzazione UI/CSS

### Struttura dei file (percorsi chiave)

static/ (contenuto in immobiliaris-be - vedi src/main/resources/static)
- index.html — Homepage / form valutazione
- login.html — Pagina di login
- user.html — Area riservata utente
- admin.html — Area riservata amministratore
- assets/ — immagini, icone e risorse statiche
- styles/
  - input.css — Entry point Tailwind (utilizzato durante lo sviluppo con build/watch)
  - style-tailwind.css — Bundle Tailwind compilato (usato in produzione)
  - home-styles.css — CSS aggiuntivo personalizzato (override e componenti specifici)
- js/
  - auth-utils.js — helper centrale per l'autenticazione (JWT, localStorage, authenticatedFetch)
  - login.js — gestione del form di login e flusso di autenticazione
  - valutazione.js — form multi-step per la valutazione (calcolo locale + chiamate API)
  - user.js — comportamento dashboard utente (rendering liste e utility UI)
  - admin.js — logica frontend dashboard amministratore e helper per CRUD
  - validation-utils.js — validator lato client e helper per messaggi UI
  - faq.js — logica accordion (FAQ)
  - swiper-config.js — inizializzazione Swiper.js

File referenziati nel repository: `src/main/resources/static/js/*` e `src/main/resources/static/styles/*` (vedi il codice per i dettagli).

### Architettura client-side

- Unset di moduli JavaScript leggeri caricati nelle pagine che ne hanno bisogno (no bundler in production). Scripts sono organizzati per responsabilità (auth, forms, dashBoard).
- auth-utils.js è il punto centrale per autenticazione e tutte le pagine protette usano le sue funzioni (`protectPage`, `authenticatedFetch`, `logout`, `getToken`, `getUser`).
- Ogni pagina inizializza solo gli script che necessita per evitare overhead.

### File per file (comportamento dettagliato)

- auth-utils.js
  - Salva token + user in localStorage (chiavi: immobiliaris_token / immobiliaris_user).
  - Funzioni principali: saveAuthData, getToken, getUser, isAuthenticated, isAdmin (idRuolo==2), logout, authenticatedFetch (aggiunge automaticamente l'header Authorization: Bearer {token} e gestisce redirect su 401/403), protectPage e redirectByRole.

- login.js
  - Gestisce l'invio del form di login, con validazione di base e UX (disabilitazione del bottone durante l'autenticazione); chiama `/api/auth/login`, salva token e dati utente e reindirizza (admin -> admin.html, utente -> user.html).

- valutazione.js
  - Multi-step form (0: mode deciding; 1: registration; 2: immobile; 3: features; 4: review/submit) con un estimatore locale (PREZZI constants).per utenti registrati mantiene immobile + valutazione usando endpoints eutenticati mentre per utenti nuovi chiama /api/valutazioni/automatica.
  - Utilizza selezioni tramite card nel DOM (selection-card / feature-card) e integra la validazione lato client tramite `validation-utils`.

- user.js
  - Protegge la pagina, carica i dati utente e chiama il backend per recuperare le valutazioni dell'utente (GET /api/valutazioni/utente/{id}), renderizza la UI dedicata e gestisce piccole utility UX (copia email, scroll fluido).

- admin.js
  - Dashboard amministratore: carica i dati in parallelo (utenti, immobili, valutazioni, venditori, contratti) usando `authenticatedFetch`; renderizza le liste e fornisce handler lato client per create/edit/delete (contratti, immobili, valutazioni, venditori, utenti). Mostra inoltre il formato del payload per la creazione dei contratti (POST /api/contratti).

- validation-utils.js
  - Validator condivisi: isValidEmail, isValidCellulare + helper UI (showFieldError, clearFieldError) e funzioni di setup per collegare automaticamente gli eventi blur/input su campi email e telefono.

- faq.js & swiper-config.js
  - Script per comportamenti UI minori: accordion con comportamento esclusivo di apertura + schema colori personalizzabile; inizializzazione di Swiper con breakpoints responsivi.

### API utilizzate dal frontend (sommario)

- POST /api/auth/login — restituisce { token, tipo, email, ruolo, user } (il frontend si aspetta data.token e data.user)
- GET /api/auth/me — restituisce i dati dell'utente per le pagine della dashboard
- POST /api/valutazioni/automatica — endpoint pubblico per la valutazione automatica da parte degli ospiti
- POST /api/valutazioni, POST /api/immobili, GET /api/valutazioni/utente/{id} — utilizzati nei flussi con utente autenticato
- GET /api/zone, /immobili, /venditori, /contratti, /utenti — area admin

Usa sempre `authenticatedFetch` per gli endpoint protetti: aggiunge automaticamente l'header `Authorization`.

### Flusso di autenticazione (client)

1. L'utente invia le credenziali a POST /api/auth/login (login.js)
2. In caso di successo salvare token e dati utente con `saveAuthData(token, user)` in localStorage
3. Utilizzare `redirectByRole` per reindirizzare a `user.html` o `admin.html` in base al ruolo
4. Le pagine protette chiamano `protectPage(requireAdmin)` all'avvio per verificare token e ruolo
5. `authenticatedFetch` aggiunge il token all'header e forza il logout/redirect su 401/403

### UX, accessibilità e validazione

- Usare HTML semantico nei form (label + input) e attributi ARIA quando possibile.
- Tutti i campi devono avere attributi `required` e `validation-utils.js` fornisce messaggi di errore inline invece di affidarsi solo agli alert.
- Accessibilità da tastiera: garantire che i controlli personalizzati (selection-card) abbiano `role`, `tabindex` e siano attivabili da tastiera.
- Usare colori con contrasto adeguato per il brand e assicurare che gli elementi interattivi abbiano stili di focus visibili.

### Workflow di sviluppo (come aggiornare gli stili e usare il watch locale)

1. Watch di sviluppo Tailwind (consigliato per iterazioni rapide):

```powershell
cd immobiliaris-be
npm run tailwind:watch
```

Questo comando compila `src/main/resources/static/styles/input.css` → `src/main/resources/static/styles/style-tailwind.css` e lo mantiene aggiornato durante le modifiche.

2. Le pagine statiche sono servite da Spring Boot; esegui il backend per visualizzare le risorse frontend su http://localhost:8080.

3. Produzione: il file compilato `style-tailwind.css` è incluso in `resources` e viene utilizzato dalle pagine statiche.

### Testing e qualità (raccomandazioni)

- Test unitari per la logica complessa (es. funzioni di calcolo in valutazione.js) — estrarre funzioni pure e testarle con Jest (se si aggiunge un ambiente Node) o con un semplice harness QUnit.
- Test end-to-end: usare Playwright / Cypress per coprire i flussi critici (login, form valutazione, CRUD admin).
- Test di accessibilità: integrare controlli automatici (es. axe-core) durante lo sviluppo.

### Performance e ottimizzazione

- Tenere ridotto l'uso di script di terze parti (es. solo Swiper). Usare lazy-loading per le immagini e valutare `srcset` per asset responsive.
- In produzione, minimizzare JS/CSS e abilitare caching headers (gestito a livello di server/proxy).

### Note di sicurezza

- Evitare di memorizzare dati sensibili in `localStorage` — l'app memorizza solo il JWT e metadati non sensibili. Per scenari ad alta sicurezza considerare cookie sicuri HttpOnly.
- `authenticatedFetch` centralizza la gestione del token e i redirect su 401/403 — mantiene sincronizzato il comportamento client-server.

### Convenzioni di codifica e componenti

- Mantenere uno script per responsabilità e preferire selettori DOM espliciti con scoping all'interno dell'inizializzazione specifica della pagina, per evitare collisioni globali.
- Usare una nomenclatura coerente: funzioni in camelCase, classi CSS basate sulle utility di Tailwind e classi personalizzate con prefisso `my-` (es. `bg-my-green-dark`).

---

### Styling e Design (dettagli tecnici)

#### Strumenti

- Tailwind CSS v3 è utilizzato nel progetto con uno step di build locale. Il repository contiene lo script `npm run tailwind:watch` che compila `input.css` → `style-tailwind.css` durante lo sviluppo.
- Il bundle CSS compilato si trova in `src/main/resources/static/styles/style-tailwind.css` ed è servito come risorsa statica.

#### Configurazione di Tailwind

Configurazione principale in `tailwind.config.js` — dettagli importanti:
- I percorsi di content includono `./src/main/resources/static/**/*.{html,js}`, quindi Tailwind analizza sia HTML che JS per le classi utilizzate.
- La proprietà `safelist` contiene le utility class usate frequentemente a runtime via JavaScript (es. `bg-my-green-dark`, `text-my-orange`) per evitare che il purging rimuova queste classi.
- theme.extend.colors include brand tokens:
  - my-green-dark: #274239
  - my-green-light: #809074
  - my-black-dark: #111A19
  - my-orange: #BA6830
  - my-cream: #F9F2E8

Per cambiare il branding, aggiorna questi token in `tailwind.config.js` e riesegui la watch/build.

#### Custom CSS files

 - `style-tailwind.css` — output compilato di Tailwind + reset base
 - `home-styles.css` — override personalizzati e componenti specifici (stili Swiper, bottoni, micro-style). Aggiungi nuovi stili componenti qui solo quando non è possibile esprimerli con le utility di Tailwind.

Linee guida:
- Preferire le utility di Tailwind per i nuovi componenti. Usare `home-styles.css` solo per comportamenti visuali altamente personalizzati (es. frecce Swiper o pseudo-element complessi).
- Mantieni `.home-styles.css` mirato e documentato — assegna nomi chiari alle classi (es. `.benefit-img`, `.faq-item`).

#### Classi personalizzate comuni e loro scopo
- `bg-my-green-dark`, `text-my-orange`, `bg-my-cream` — branding
- `hover:shadow-2xl`, `transition-all` — micro-interazioni e piccoli feedback visivi

#### Accessibilità e design responsive
 - Assicurarsi che le interazioni importanti mantengano stili di focus visibili — usare le utility di Tailwind (`focus:ring`, `focus:outline-none`, ecc.).
 - Usare l'approccio mobile-first con le utility responsive (sm, md, lg, xl) — il progetto già segue questo pattern.

#### Build, produzione e uso avanzato di Tailwind

 - Build di produzione / minificazione (esempio):

```powershell
npx tailwindcss -i ./src/main/resources/static/styles/input.css -o ./src/main/resources/static/styles/style-tailwind.css --minify
```

 - Quando si aggiungono classi dinamiche via JS (generate a runtime o toggleate), aggiungerle alla `safelist` in `tailwind.config.js` per evitare che il purge le rimuova.

 - PostCSS / Autoprefixer: il progetto include `postcss` e `autoprefixer` nelle dipendenze di sviluppo (`package.json`) per abilitare funzionalità CSS moderne e vendor prefixes cross-browser.


Esempio: creare lo stile di un bottone in `input.css`:

```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 rounded-lg bg-my-green-dark text-white font-semibold hover:bg-my-green-light;
  }
}
```

#### Nomenclature e convenzioni organizzative

- Usare il prefisso `my-` per classi specifiche per evitare conflitti con Tailwind utilities.
- Mantieni il CSS personalizzato il più piccolo e mirato possibile; preferisci le utility di Tailwind per spacing e layout al posto di regole custom quando possibile.
- Documentare eventuali nuovi design token in `tailwind.config.js` e nella documentazione in modo che designer e sviluppatori possano trovarli facilmente.

---

Questa estensione della documentazione frontend fornisce una guida completa e pratica per i futuri sviluppatori: permette di comprendere, estendere e mantenere l'interfaccia utente e i CSS al livello della documentazione backend.

### Flussi Utente Principali

#### 1. Richiesta Valutazione (Utente Non Autenticato)

```
1. Utente compila form su index.html (3 step)
2. Invia una richiesta POST a /api/valutazioni/automatica
3. Backend calcola valore stimato
4. Visualizzazione risultato immediato
5. (Opzionale) Registrazione per salvare valutazione
```

#### 2. Login e Accesso Area Riservata

```
1. Utente inserisce credenziali su login.html
2. POST /api/auth/login
3. Salvataggio token JWT in localStorage
4. Redirect:
   - Admin → admin.html
   - Utente → account.html
```

#### 3. Gestione Contratto (Admin)

```
1. Admin accede a admin.html
2. Navigazione a sezione Contratti
3. Click "Crea Nuovo Contratto"
4. Selezione immobile e venditore da dropdown
5. Compilazione dati contratto
6. Anteprima template
7. Salvataggio: POST /api/contratti
8. (Opzionale) Invio email con PDF
```

### Gestione Stato e Dati

#### LocalStorage

```javascript
// Chiavi utilizzate
'immobiliaris_token'  // JWT token
'immobiliaris_user'   // Dati utente { idUtente, nome, cognome, email, idRuolo }
```

#### Session Management

- Token valido 24 ore (configurabile)
- Controllo validità su ogni richiesta
- Logout automatico su 401/403
- Refresh page mantiene sessione se token valido

### Responsive Design

#### Breakpoints Tailwind

```
sm:  640px   - Tablet portrait
md:  768px   - Tablet landscape
lg:  1024px  - Desktop
xl:  1280px  - Desktop large
2xl: 1536px  - Desktop XL
```

#### Mobile-First

Tutti i layout sono progettati mobile-first con classi responsive:

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- 1 colonna mobile, 2 tablet, 3 desktop -->
</div>
```

### Sicurezza Frontend

#### Validazione Input

- Validazione HTML5 (required, type="email", pattern)
- Validazione JavaScript custom per form multi-step
- Sanitizzazione input prima dell'invio

#### Protezione XSS

- Uso di textContent invece di innerHTML quando possibile
- Encoding caratteri speciali
- Content Security Policy headers (gestito da backend)

#### Protezione CSRF

- Token JWT include timestamp e firma
- Verifica token server-side
- Nessun cookie sensibile esposto

---

## Configurazione

## Dati di Test

### Utenti Predefiniti (DataLoader)

| Email                  | Password  | Ruolo   | Nome      |
|------------------------|-----------|---------|-----------|
| <admin@immobiliaris.com> | admin123  | admin   | Admin     |
| <user@immobiliaris.com>  | user123   | utente  | Utente    |
| <mario@immobiliaris.com> | mario123  | utente  | Mario     |
| <giulia@immobiliaris.com>| giulia123 | utente  | Giulia    |
| <luca@immobiliaris.com>  | luca123   | utente  | Luca      |

### Dati Statistici

- **Zone**: 36 zone (32 a Torino + 4 altre città)
- **Venditori**: 6 venditori (3 registrati, 3 non registrati)
- **Immobili**: 6 immobili di esempio
- **Valutazioni**: 6 valutazioni (stati misti)
- **Contratti**: 6 contratti (stati misti)

---

## Avvio del Sistema

### 1. Avvio Backend

```bash
cd immobiliaris-be
./mvnw spring-boot:run
```

### 2. Verifica Servizi

- **Backend API**: <http://localhost:8080>
- **Swagger UI**: <http://localhost:8080/swagger>
- **H2 Console**: <http://localhost:8080/h2>

### 3. Test Rapido con Swagger

1. Aprire <http://localhost:8080/swagger>
2. Testare `/api/auth/login` con credenziali:

   ```json
   {
     "email": "admin@immobiliaris.com",
     "password": "admin123"
   }
   ```

3. Copiare il token dalla risposta
4. Cliccare **"Authorize"** in alto a destra
5. Incollare il token (senza "Bearer")
6. Testare gli endpoint protetti

---

## Note Importanti

### Sicurezza in Produzione

- **JWT Secret**: Usare variabile d'ambiente (`${JWT_SECRET}`)
- **Database**: Migrare da H2 in-memory a PostgreSQL/MySQL persistente
- **HTTPS**: Abilitare SSL/TLS per produzione
- **CORS**: Configurare correttamente le origini permesse

### Best Practices

- Tutti gli endpoint DELETE richiedono ruolo `admin`
- Le password vengono sempre hashate con BCrypt
- I timestamp sono gestiti automaticamente da Hibernate (`@CreationTimestamp`)
- Le relazioni FK sono gestite con `ON DELETE CASCADE` o `SET NULL`

### Risorse Utili

- **Repository GitHub**: <https://github.com/marcologioco/laboratorio-integrato-group-4>
- **Swagger UI**: <http://localhost:8080/swagger>
- **H2 Console**: <http://localhost:8080/h2>
