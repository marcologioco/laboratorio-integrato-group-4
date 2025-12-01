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
| POST   | `/api/valutazioni`                  | Crea nuova valutazione               |
| PUT    | `/api/valutazioni/{id}`             | Aggiorna valutazione                 |
| DELETE | `/api/valutazioni/{id}`             | Elimina valutazione (Admin)          |

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

### Stack Tecnologico Frontend

- **HTML5** - Struttura semantica delle pagine
- **CSS3 + Tailwind CSS** - Styling responsivo e moderno
- **JavaScript Vanilla** - Logica client-side senza framework
- **Swiper.js** - Carousel per showcase immobili
- **JWT** - Gestione autenticazione lato client

### Struttura delle Pagine

#### Pagine Pubbliche

```
static/
├── index.html          - Homepage con form valutazione
├── login.html          - Pagina di autenticazione
└── assets/             - Immagini e risorse statiche
```

#### Pagine Protette (Autenticazione Richiesta)

```
static/
├── account.html        - Dashboard utente standard
└── admin.html          - Dashboard amministratore
```

### File JavaScript

#### 1. auth-utils.js

**Scopo:** Gestione centralizzata dell'autenticazione JWT

**Funzioni principali:**

```javascript
// Configurazione API
AUTH_CONFIG = {
  API_BASE_URL: 'http://localhost:8080/api',
  TOKEN_KEY: 'immobiliaris_token',
  USER_KEY: 'immobiliaris_user'
}

// Salvataggio dati autenticazione
saveAuthData(token, user)

// Recupero token/utente
getToken()
getUser()

// Verifica stato autenticazione
isAuthenticated()
isAdmin()

// Logout
logout()

// Fetch autenticato
authenticatedFetch(url, options)

// Protezione pagine
protectPage(requireAdmin)

// Redirect basato su ruolo
redirectByRole()
```

**Utilizzo:**

- Automaticamente aggiunge header `Authorization: Bearer {token}` alle richieste
- Gestisce redirect automatico su 401/403
- Salva dati utente in localStorage

#### 2. login.js

**Scopo:** Gestione form di login

**Flusso:**

1. Verifica se utente già autenticato
2. Raccolta credenziali (email, password)
3. POST a `/api/auth/login`
4. Salvataggio token e dati utente
5. Redirect basato su ruolo (admin.html o account.html)

**Codice esempio:**

```javascript
const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
saveAuthData(data.token, data.user);
redirectByRole();
```

#### 3. valutazione.js

**Scopo:** Form multi-step per richiesta valutazione automatica

**Caratteristiche:**

- Form a 3 step con progress bar
- Validazione campi per ogni step
- Custom cards per selezione tipo/stato immobile
- Invio dati a `/api/valutazioni/automatica`
- Visualizzazione risultato valutazione

**Step del form:**

1. **Step 1:** Dati personali (nome, cognome, email, telefono, password)
2. **Step 2:** Dati immobile (indirizzo, città, CAP, mq, camere, bagni)
3. **Step 3:** Caratteristiche (tipo, stato, accessori opzionali)

**Selezione tramite card:**

```javascript
// Card cliccabile aggiorna select nascosta
<div class="selection-card" data-target="tipo" data-value="APPARTAMENTO">
  <!-- Visuale della card -->
</div>
<select id="tipo" class="hidden" required></select>
```

**Calcolo automatico:**
Il backend calcola il valore stimato usando la formula:

```
Valore Stimato = metri_quadri × prezzo_medio_zona + fattori correttivi
```

#### 4. user.js

**Scopo:** Dashboard area personale utente

**Funzionalità:**

- Visualizzazione dati utente (nome, email)
- Lista valutazioni richieste dall'utente
- Dettaglio immobili valutati
- Stato valutazioni (IN_CORSO, COMPLETATA, ANNULLATA)

**API utilizzate:**

- GET `/api/auth/me` - Dati utente corrente
- GET `/api/valutazioni/utente/{id}` - Valutazioni dell'utente
- GET `/api/immobili/{id}` - Dettagli immobili

**Visualizzazione:**

- Card valutazioni con stato e valore stimato
- Card immobili con dettagli (mq, camere, bagni)
- Badge colorati per stati (verde=completata, giallo=in corso)

#### 5. admin.js

**Scopo:** Dashboard amministratore completa

**Funzionalità principali:**

1. **Overview Dashboard**
   - Contatori totali: utenti, immobili, valutazioni, venditori
   - Card cliccabili per dettaglio sezioni

2. **Gestione Utenti**
   - Lista completa utenti con ruoli
   - Badge distintivi (Admin/Utente/Venditore)
   - Eliminazione utenti (con conferma)

3. **Gestione Venditori**
   - Visualizzazione venditori registrati e non
   - Collegamento con account utente se presente
   - CRUD completo venditori

4. **Gestione Immobili**
   - Lista immobili con filtri
   - Card con dettagli (foto, mq, prezzo)
   - Eliminazione immobili

5. **Gestione Valutazioni**
   - Visualizzazione tutte le valutazioni
   - Filtro per stato
   - Modifica stato valutazione

6. **Gestione Contratti**
   - Visualizzazione contratti attivi/completati
   - Form creazione nuovo contratto
   - Template contratto personalizzabile
   - Anteprima contratto prima dell'invio
   - Eliminazione contratti

**API utilizzate:**

```javascript
// Caricamento dati
GET /api/utenti
GET /api/immobili
GET /api/valutazioni
GET /api/venditori
GET /api/contratti

// Operazioni CRUD
DELETE /api/utenti/{id}
DELETE /api/immobili/{id}
DELETE /api/valutazioni/{id}
DELETE /api/venditori/{id}
DELETE /api/contratti/{id}
POST /api/contratti
```

**Creazione contratto:**

```javascript
const contractData = {
  idImmobile: parseInt(selectImmobile.value),
  idVenditore: parseInt(selectVenditore.value),
  tipo: 'vendita',
  esclusiva: true,
  dataInizio: '2024-01-01',
  dataFine: '2024-06-01',
  prezzoFinaleMinimo: 150000,
  stato: 'ATTIVO',
  note: 'Contratto generato da admin dashboard'
};

await authenticatedFetch('/api/contratti', {
  method: 'POST',
  body: JSON.stringify(contractData)
});
```

#### 6. faq.js

**Scopo:** Gestione accordion FAQ

**Funzionalità:**

- Espansione/chiusura domande
- Animazioni smooth
- Toggle icone +/-

#### 7. swiper-config.js

**Scopo:** Configurazione carousel Swiper

**Configurazione:**

```javascript
new Swiper('.mySwiper', {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  pagination: { clickable: true },
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  autoplay: { delay: 5000 },
  breakpoints: {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 }
  }
});
```

### Styling e Design

#### Tailwind CSS

**File principale:** `styles/style-tailwind.css`

**Colori personalizzati (tailwind.config.js):**

```javascript
colors: {
  'my-green-dark': '#274239',
  'my-green-light': '#4A7C59',
  'my-orange': '#C85C2E',
  'my-cream': '#F5F5F0',
  'my-black': '#1A1A1A'
}
```

**Classi utility personalizzate:**

- `.bg-my-green-dark` - Sfondo verde scuro brand
- `.text-my-orange` - Testo arancione brand
- `.hover:shadow-2xl` - Ombra al passaggio mouse
- `.transition-all` - Transizioni smooth

#### CSS Custom

**File:** `styles/home-styles.css`

Contiene:

- Animazioni personalizzate
- Stili per componenti specifici
- Override Tailwind quando necessario

### Flussi Utente Principali

#### 1. Richiesta Valutazione (Utente Non Autenticato)

```
1. Utente compila form su index.html (3 step)
2. Submit a POST /api/valutazioni/automatica
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
