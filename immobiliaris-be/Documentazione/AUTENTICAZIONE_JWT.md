# Autenticazione JWT - Documentazione Completa

---

## Indice

1. [Panoramica](#panoramica)
2. [Concetti Fondamentali](#concetti-fondamentali)
3. [Implementazione](#implementazione)
4. [Flussi di Autenticazione](#flussi-di-autenticazione)
5. [Endpoint API](#endpoint-api)
6. [Configurazione](#configurazione)
7. [Testing](#testing)
8. [Sicurezza](#sicurezza)

---

## Panoramica

Il sistema Immobiliaris utilizza JSON Web Token (JWT) per l'autenticazione e l'autorizzazione degli utenti. Il meccanismo è stateless, sicuro e scalabile, permettendo la protezione degli endpoint API basandosi sui ruoli utente.

### Stato Implementazione

- Spring Security configurato
- Password hashing con BCrypt
- Generazione e validazione JWT
- JwtAuthenticationFilter attivo
- Protezione endpoint per ruolo (ADMIN/UTENTE)
- Swagger UI con supporto Bearer JWT

---

## Concetti Fondamentali

### Cos'è JWT

JSON Web Token è uno standard aperto (RFC 7519) che definisce un modo compatto e autonomo per trasmettere informazioni in modo sicuro tra le parti come oggetto JSON. Queste informazioni possono essere verificate poiché sono firmate digitalmente.

### Struttura del Token

Un JWT è composto da tre parti separate da punti:

```
header.payload.signature
```

**Header:**

```json
{
  "alg": "HS512",
  "typ": "JWT"
}
```

**Payload:**

```json
{
  "sub": "luca.rossi@example.com",
  "userId": 2,
  "ruolo": 1,
  "iat": 1731682800,
  "exp": 1731769200
}
```

**Signature:**
Generata usando l'algoritmo specificato nell'header, garantisce l'integrità del token.

### Analogia

Il JWT funziona come un biglietto di accesso:

1. Login alla cassa: POST /api/auth/login
2. Ricezione biglietto: Token JWT
3. Biglietto contiene: identità utente, ruolo, data scadenza
4. Firma del sistema: JWT signature (previene falsificazioni)
5. Presentazione biglietto: Authorization header in ogni richiesta
6. Verifica biglietto: JwtAuthenticationFilter
7. Accesso consentito: se valido e autorizzato

---

## Implementazione

### Componenti Principali

#### 1. JwtUtil

Classe di utilità per la gestione dei token JWT.

**Responsabilità:**

- Generazione token con userId, email, ruolo
- Validazione token
- Estrazione dati (claims) dal token
- Verifica scadenza

**Configurazione:**

- Algoritmo: HS512
- Durata: 24 ore (configurabile)
- Secret: definito in application.properties

#### 2. JwtAuthenticationFilter

Filtro Spring Security che intercetta ogni richiesta HTTP.

**Flusso di esecuzione:**

1. Estrazione header Authorization
2. Verifica formato "Bearer {token}"
3. Estrazione del token
4. Validazione tramite JwtUtil
5. Se valido: estrazione userId, email, ruolo
6. Creazione Authentication object
7. Inserimento nel SecurityContext
8. Proseguimento della richiesta

**Log:**

- Token valido: "Token valido per: email (userId: X, ruolo: ROLE_Y)"
- Token non valido: "Token non valido: motivo"

#### 3. SecurityConfig

Configurazione Spring Security che definisce le regole di accesso.

**Endpoint pubblici (nessuna autenticazione):**

- POST /api/auth/login
- POST /api/valutazioni/automatica
- GET /api/immobili (con filtri)
- GET /api/zone
- Swagger UI e documentazione
- H2 Console (solo sviluppo)

**Endpoint autenticati (qualsiasi ruolo):**

- GET /api/auth/me
- GET /api/auth/validate
- POST /api/valutazioni/logged

**Endpoint riservati ADMIN:**

- GET /api/utenti
- DELETE su tutte le risorse
- POST/PUT su utenti e venditori
- Gestione completa valutazioni e contratti

#### 4. AuthController

Controller REST per le operazioni di autenticazione.

**Endpoint esposti:**

- POST /api/auth/login: Login e generazione token
- GET /api/auth/me: Informazioni utente corrente
- GET /api/auth/validate: Validazione token

#### 5. AuthService

Servizio che implementa la logica di autenticazione.

**Funzionalità:**

- Verifica credenziali utente
- Validazione password con BCrypt
- Generazione token JWT
- Recupero informazioni utente

#### 6. Password Hashing

**Algoritmo:** BCrypt  
**Strength:** 10 rounds (default Spring Security)

BCrypt è un algoritmo di hashing che include automaticamente un salt casuale, rendendo ogni hash unico anche per password identiche.

**Esempio:**

```
Plaintext: password123
Hash: $2a$10$N9qo8uLOickgx2ZMRZoMye1J2LElJ2pK6/SN0.ZF5k8q5xM1K6mOW
```

---

## Flussi di Autenticazione

### Flusso 1: Login Iniziale

```
1. Client invia credenziali
   POST /api/auth/login
   Body: { "email": "user@example.com", "password": "password123" }

2. AuthController riceve richiesta
   
3. AuthService verifica credenziali
   - Cerca utente per email
   - Verifica password con BCrypt
   
4. Se credenziali valide:
   - JwtUtil genera token
   - Token include: userId, email, ruolo
   - Durata: 24 ore
   
5. Risposta al client
   Response: {
     "user": { idUtente, nome, cognome, email, idRuolo },
     "ruolo": "utente" o "admin",
     "token": "eyJhbGciOiJIUzUxMiJ9..."
   }

6. Client salva token
   - localStorage.setItem('token', data.token)
   - localStorage.setItem('user', JSON.stringify(data.user))
```

### Flusso 2: Richieste Autenticate

```
1. Client recupera token
   const token = localStorage.getItem('token')

2. Client invia richiesta con token
   GET /api/immobili
   Headers: { Authorization: "Bearer {token}" }

3. JwtAuthenticationFilter intercetta richiesta
   - Estrae token dall'header
   - Valida con JwtUtil
   - Estrae userId, email, ruolo
   - Crea Authentication
   - Inserisce in SecurityContext

4. Spring Security verifica autorizzazione
   - Controlla se endpoint richiede autenticazione
   - Verifica ruolo se necessario
   - Permette o nega accesso

5. Se autorizzato:
   - Controller esegue logica
   - Risposta inviata al client

6. Se non autorizzato:
   - 401 Unauthorized (non autenticato)
   - 403 Forbidden (autenticato ma ruolo insufficiente)
```

### Flusso 3: Recupero Informazioni Utente

```
1. Client ricarica pagina
   - JavaScript si resetta
   - Token presente in localStorage
   - Informazioni utente perse

2. Client richiede informazioni
   GET /api/auth/me
   Headers: { Authorization: "Bearer {token}" }

3. Backend estrae dati dal token
   - JwtAuthenticationFilter valida token
   - Estrae userId
   - AuthService recupera utente completo

4. Risposta al client
   Response: {
     idUtente, nome, cognome, email, telefono, idRuolo
   }

5. Client ricostruisce stato
   - Mostra nome utente in UI
   - Reindirizza a dashboard corretta
   - Nasconde/mostra elementi per ruolo
```

---

## Endpoint API

### POST /api/auth/login

**Descrizione:** Autenticazione utente e generazione token JWT

**Accesso:** Pubblico

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response 200 OK:**

```json
{
  "user": {
    "idUtente": 1,
    "nome": "Mario",
    "cognome": "Rossi",
    "email": "mario.rossi@example.com",
    "telefono": "3331234567",
    "idRuolo": 1
  },
  "ruolo": "utente",
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

**Response 401 Unauthorized:**

```json
{
  "error": "Credenziali non valide"
}
```

### GET /api/auth/me

**Descrizione:** Ottiene informazioni utente autenticato

**Accesso:** Autenticato

**Headers:**

```
Authorization: Bearer {token}
```

**Response 200 OK:**

```json
{
  "idUtente": 1,
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario.rossi@example.com",
  "telefono": "3331234567",
  "idRuolo": 1
}
```

**Casi d'uso:**

- Ricarica pagina web
- Startup applicazione
- Aggiornamento profilo
- Visualizzazione nome utente in navbar

### GET /api/auth/validate

**Descrizione:** Verifica validità token JWT

**Accesso:** Autenticato

**Headers:**

```
Authorization: Bearer {token}
```

**Response 200 OK:**

```json
{
  "valid": true
}
```

**Response 401 Unauthorized:**

```json
{
  "valid": false,
  "error": "Token scaduto"
}
```

**Casi d'uso:**

- Controllo periodico validità sessione
- Verifica prima operazioni critiche
- Auto-logout se inattivo
- Debug autenticazione

---

## Configurazione

### application.properties

```properties
# JWT Configuration
jwt.secret=ImmobiliarisSecretKeyForJWT2024VerySecureAndLongEnoughForHS256Algorithm
jwt.expiration=86400000
```

**Parametri:**

- `jwt.secret`: Chiave segreta per firma token (minimo 256 bit per HS256)
- `jwt.expiration`: Durata token in millisecondi (86400000 = 24 ore)

**IMPORTANTE:** In produzione, spostare jwt.secret in variabile d'ambiente:

```properties
jwt.secret=${JWT_SECRET:default-dev-secret}
```

### pom.xml

Dipendenze richieste:

```xml
<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

---

## Testing

### Test con Swagger UI

**Setup:**

1. Avviare applicazione
2. Navigare a <http://localhost:8080/swagger>
3. Utilizzare endpoint POST /api/auth/login
4. Copiare token dalla risposta
5. Cliccare "Authorize" in alto a destra
6. Incollare token (senza "Bearer")
7. Cliccare "Authorize" e "Close"

**Test Admin:**

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Test Utente:**

```json
{
  "email": "luca.rossi@example.com",
  "password": "pwd123"
}
```

**Verifica autorizzazioni:**

- Admin: accesso a GET /api/utenti
- Utente: 403 Forbidden su GET /api/utenti

### Test con PowerShell

**Login:**

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@example.com","password":"admin123"}'

$token = $response.token
Write-Host "Token: $token"
```

**Richiesta autenticata:**

```powershell
$headers = @{
  "Authorization" = "Bearer $token"
  "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/me" `
  -Method GET `
  -Headers $headers
```

**Validazione token:**

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/auth/validate" `
  -Method GET `
  -Headers $headers
```

### Credenziali di Test

| Email | Password | Ruolo | ID Ruolo | Nome |
|-------|----------|-------|----------|------|
| admin@example.com | admin123 | admin | 2 | Admin Default |
| luca.rossi@example.com | pwd123 | utente | 1 | Luca Rossi |
| marta.bianchi@example.com | pwd456 | utente | 1 | Marta Bianchi |
| giulia.verdi@example.com | pwd789 | utente | 1 | Giulia Verdi |
| paolo.ferrari@example.com | pwd101 | utente | 1 | Paolo Ferrari |
| sara.conti@example.com | pwd202 | utente | 1 | Sara Conti |

### Verifica Log Console

Token valido:

```
Token valido per: admin@example.com (userId: 1, ruolo: ROLE_ADMIN)
```

Token non valido:

```
Token non valido: Token scaduto
```

---

## Sicurezza

### Perché JWT è Sicuro

**1. Firma Digitale**
Il token è firmato con l'algoritmo HS512 usando il secret. Qualsiasi modifica al payload invalida la firma.

**2. Scadenza Automatica**
Ogni token ha un timestamp di scadenza (exp claim). Dopo 24 ore, il token diventa invalido.

**3. Stateless**
Il server non mantiene sessioni. Ogni token è autonomo e verificabile indipendentemente.

**4. Password Hashing**
Le password sono hashate con BCrypt prima del salvataggio. Impossibile recuperare la password originale.

### Best Practices Implementate

- Token include solo informazioni necessarie (userId, email, ruolo)
- Secret key sufficientemente lunga (256+ bit)
- Algoritmo sicuro (HS512)
- Scadenza configurabile
- CORS configurato (da restringere in produzione)
- Sessioni stateless (no cookie di sessione)

### Raccomandazioni per Produzione

**1. Protezione Secret:**

```bash
export JWT_SECRET="your-production-secret-key-here"
```

**2. HTTPS Obbligatorio:**

- Impedisce intercettazione token
- Protegge credenziali durante login

**3. CORS Restrittivo:**

```java
.allowedOrigins("https://yourdomain.com")
```

**4. Refresh Token:**
Implementare meccanismo per rinnovo automatico token senza ri-login.

**5. Token Blacklist:**
Sistema per invalidare token prima della scadenza (logout).

**6. Rate Limiting:**
Limitare tentativi di login per prevenire brute force.

**7. Audit Log:**
Registrare tutti i tentativi di autenticazione.

### Vulnerabilità Mitigate

- **XSS:** Token in localStorage (non in cookie)
- **CSRF:** Token JWT (non cookie di sessione)
- **Brute Force:** BCrypt con high cost factor
- **Man-in-the-Middle:** HTTPS in produzione
- **Token Tampering:** Firma digitale
- **Session Hijacking:** Stateless, nessuna sessione server

### Note Importanti

- Il database H2 è in-memory: dati persi a ogni riavvio
- H2 Console esposta solo in sviluppo
- CORS permette tutte le origini in sviluppo
- Secret JWT in chiaro nel file properties (accettabile solo in dev)

---

## Risoluzione Problemi

### 401 Unauthorized

**Causa:** Token mancante, non valido o scaduto

**Soluzioni:**

- Verificare header Authorization presente
- Verificare formato: "Bearer {token}"
- Controllare scadenza token (24 ore)
- Effettuare nuovo login

### 403 Forbidden

**Causa:** Token valido ma ruolo insufficiente

**Soluzioni:**

- Verificare idRuolo utente (1=utente, 2=admin)
- Controllare configurazione SecurityConfig
- Verificare che endpoint richieda ruolo corretto

### Password non accettata

**Causa:** Password non corrispondente o formato errato

**Soluzioni:**

- Verificare credenziali di test
- Controllare che DataLoader sia stato eseguito
- Verificare BCrypt configurato correttamente

### Token non generato

**Causa:** Errore nella generazione o configurazione JWT

**Soluzioni:**

- Verificare jwt.secret in application.properties
- Controllare dipendenze JJWT in pom.xml
- Verificare log console per stack trace

---

## Riferimenti

- **Spring Security:** <https://spring.io/projects/spring-security>
- **JWT (RFC 7519):** <https://tools.ietf.org/html/rfc7519>
- **JJWT Library:** <https://github.com/jwtk/jjwt>
- **BCrypt:** <https://en.wikipedia.org/wiki/Bcrypt>
