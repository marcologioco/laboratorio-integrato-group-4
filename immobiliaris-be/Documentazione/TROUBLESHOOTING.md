# Troubleshooting - Guida Risoluzione Problemi

---

## Indice

1. [Problemi Avvio Applicazione](#problemi-avvio-applicazione)
2. [Problemi Database](#problemi-database)
3. [Problemi Autenticazione](#problemi-autenticazione)
4. [Problemi API](#problemi-api)
5. [Problemi Frontend](#problemi-frontend)
6. [Problemi Performance](#problemi-performance)
7. [Errori Comuni](#errori-comuni)

---

## Problemi Avvio Applicazione

### Errore: Port 8080 already in use

**Sintomo:**
```
Web server failed to start. Port 8080 was already in use.
```

**Causa:** Un altro processo sta utilizzando la porta 8080.

**Soluzioni:**

**Windows:**
```powershell
# Trova processo su porta 8080
netstat -ano | findstr :8080

# Termina processo (usa PID dalla comando precedente)
taskkill /PID <PID> /F

# Oppure cambia porta in application.properties
server.port=8081
```

**Linux:**
```bash
# Trova processo
sudo lsof -i :8080

# Termina processo
sudo kill -9 <PID>

# Oppure cambia porta
server.port=8081
```

### Errore: JAVA_HOME not set

**Sintomo:**
```
Error: JAVA_HOME is not defined correctly
```

**Causa:** Variabile ambiente JAVA_HOME non configurata.

**Soluzioni:**

**Windows:**
```cmd
# Verifica installazione Java
java -version

# Configura JAVA_HOME
setx JAVA_HOME "C:\Program Files\Java\jdk-17"
setx PATH "%PATH%;%JAVA_HOME%\bin"
```

**Linux:**
```bash
# Trova installazione Java
which java
readlink -f $(which java)

# Aggiungi a ~/.bashrc
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin

# Ricarica
source ~/.bashrc
```

### Errore: Maven build failed

**Sintomo:**
```
[ERROR] Failed to execute goal ... compilation failure
```

**Causa:** Errori compilazione, dipendenze mancanti o versione Java errata.

**Soluzioni:**

```bash
# Pulisci cache Maven
mvn clean

# Aggiorna dipendenze
mvn dependency:purge-local-repository

# Build con debug
mvn clean package -X

# Verifica versione Java
mvn -version

# Salta test temporaneamente
mvn clean package -DskipTests
```

### Errore: OutOfMemoryError

**Sintomo:**
```
java.lang.OutOfMemoryError: Java heap space
```

**Causa:** Memoria heap insufficiente.

**Soluzioni:**

```bash
# Aumenta memoria heap
export MAVEN_OPTS="-Xmx2048m"

# Oppure in systemd service
Environment="JAVA_OPTS=-Xms512m -Xmx2048m"

# Verifica memoria disponibile
free -h  # Linux
systeminfo | findstr Memory  # Windows
```

---

## Problemi Database

### Errore: H2 Console non accessibile

**Sintomo:** HTTP 404 su /h2-console

**Causa:** H2 Console disabilitata o path errato.

**Soluzioni:**

Verifica `application.properties`:
```properties
spring.h2.console.enabled=true
spring.h2.console.path=/h2
```

URL corretto:
```
http://localhost:8080/h2
```

Credenziali:
```
JDBC URL: jdbc:h2:mem:ImmobiliarisDB
Username: sa
Password: (vuoto)
```

### Errore: Database connection failed

**Sintomo:**
```
Unable to create initial connections of pool
Connection refused
```

**Causa:** Database non avviato, credenziali errate, network issue.

**Soluzioni:**

**PostgreSQL:**
```bash
# Verifica stato
sudo systemctl status postgresql

# Avvia se necessario
sudo systemctl start postgresql

# Test connessione
psql -U immobiliaris_user -d immobiliaris_prod -h localhost

# Verifica pg_hba.conf permetta connessioni
sudo nano /etc/postgresql/13/main/pg_hba.conf
```

**MySQL:**
```bash
# Verifica stato
sudo systemctl status mysql

# Test connessione
mysql -u immobiliaris_user -p immobiliaris_prod

# Verifica permessi
SHOW GRANTS FOR 'immobiliaris_user'@'localhost';
```

### Errore: Schema validation failed

**Sintomo:**
```
Schema-validation: missing table [nome_tabella]
```

**Causa:** Schema database non inizializzato o versione non compatibile.

**Soluzioni:**

```bash
# Verifica tabelle esistenti
psql -U immobiliaris_user -d immobiliaris_prod
\dt

# Reinizializza schema
psql -U immobiliaris_user -d immobiliaris_prod -f src/main/resources/schema.sql

# Verifica ddl-auto
spring.jpa.hibernate.ddl-auto=update  # Sviluppo
spring.jpa.hibernate.ddl-auto=validate  # Produzione
```

### Dati persi dopo riavvio (H2)

**Sintomo:** Database vuoto dopo restart server.

**Causa:** H2 in-memory perde dati a ogni riavvio.

**Soluzioni:**

**Opzione 1 - H2 File-based (sviluppo):**
```properties
spring.datasource.url=jdbc:h2:file:./data/immobiliaris
```

**Opzione 2 - Migrare a PostgreSQL (produzione):**
Vedere GUIDA_DEPLOYMENT.md sezione Database.

### Errore: Duplicate entry for key PRIMARY

**Sintomo:**
```
Duplicate entry '1' for key 'PRIMARY'
SQLIntegrityConstraintViolationException
```

**Causa:** ID duplicato, sequence non sincronizzata.

**Soluzioni:**

```sql
-- PostgreSQL: Reset sequence
SELECT setval('utente_id_seq', (SELECT MAX(id_utente) FROM utente));
SELECT setval('immobile_id_seq', (SELECT MAX(id_immobile) FROM immobile));

-- MySQL: Reset auto_increment
ALTER TABLE utente AUTO_INCREMENT = 1;
```

---

## Problemi Autenticazione

### Errore: 401 Unauthorized

**Sintomo:** API ritorna 401 anche con token valido.

**Causa:** Token mancante, malformato, scaduto o non valido.

**Soluzioni:**

**Verifica token presente:**
```javascript
const token = localStorage.getItem('token');
console.log('Token:', token);
```

**Verifica header formato:**
```javascript
// Corretto
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...

// Errato
Authorization: eyJhbGciOiJIUzUxMiJ9...  // Manca "Bearer "
Authorization: bearer eyJhbGciOiJIUzUxMiJ9...  // "bearer" minuscolo
```

**Verifica scadenza:**
```javascript
// Decodifica token (solo lettura, non validazione)
const payload = JSON.parse(atob(token.split('.')[1]));
const exp = new Date(payload.exp * 1000);
console.log('Token scade:', exp);
```

**Rigenera token:**
```javascript
// Effettua nuovo login
const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});
const { token } = await response.json();
localStorage.setItem('token', token);
```

### Errore: 403 Forbidden

**Sintomo:** Token valido ma accesso negato.

**Causa:** Ruolo utente insufficiente per l'endpoint.

**Soluzioni:**

**Verifica ruolo utente:**
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('ID Ruolo:', user.idRuolo);  // 1=utente, 2=admin
```

**Verifica configurazione SecurityConfig:**
```java
// Admin only
.requestMatchers("/api/utenti/**").hasRole("ADMIN")

// Authenticated only
.requestMatchers("/api/auth/me").authenticated()

// Public
.requestMatchers("/api/auth/login").permitAll()
```

**Log backend:**
```
Token valido per: email (userId: X, ruolo: ROLE_UTENTE)
```

Se ruolo è ROLE_UTENTE ma endpoint richiede ROLE_ADMIN, errore 403 è corretto.

### Password non accettata

**Sintomo:** Login fallisce con credenziali corrette.

**Causa:** Password hashata in modo diverso, DataLoader non eseguito.

**Soluzioni:**

**Verifica DataLoader eseguito:**
```java
// Log all'avvio
Data initialized successfully!
```

**Test con credenziali predefinite:**
```
admin@example.com / admin123
luca.rossi@example.com / pwd123
```

**Verifica hash password in DB:**
```sql
SELECT email, password FROM utente;
```

Password devono iniziare con `$2a$` (BCrypt).

**Reset password utente:**
```java
// In UtenteService
String hashedPassword = passwordEncoder.encode("nuova_password");
utente.setPassword(hashedPassword);
utenteRepository.save(utente);
```

### Token non generato

**Sintomo:** Login ritorna errore 500 o token null.

**Causa:** Errore JwtUtil, secret non configurato.

**Soluzioni:**

**Verifica jwt.secret:**
```properties
# application.properties
jwt.secret=ImmobiliarisSecretKeyForJWT2024VerySecureAndLongEnoughForHS256Algorithm
jwt.expiration=86400000
```

Secret deve essere minimo 256 bit (43+ caratteri base64).

**Verifica dipendenze JJWT:**
```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
```

**Log JwtUtil:**
```java
log.info("Generating token for user: {}", email);
```

---

## Problemi API

### Errore: CORS policy blocked

**Sintomo:**
```
Access to fetch at 'http://localhost:8080/api/...' has been blocked by CORS policy
```

**Causa:** Frontend su origine diversa, CORS non configurato.

**Soluzioni:**

**Sviluppo - Permetti tutte le origini:**
```java
@CrossOrigin(origins = "*")
```

**Produzione - Origine specifica:**
```java
@CrossOrigin(origins = "https://yourdomain.com")
```

**Global Configuration:**
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "https://yourdomain.com"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### Errore: 404 Not Found

**Sintomo:** Endpoint non trovato.

**Causa:** URL errato, controller non registrato, context path.

**Soluzioni:**

**Verifica URL:**
```javascript
// Corretto
/api/immobili

// Errato
/immobili  // Manca /api
/api/immobili/  // Slash finale può causare problemi
```

**Verifica controller attivo:**
```bash
# Log all'avvio
Mapped "{[/api/immobili]}" onto public ResponseEntity<List<Immobile>>...
```

**Verifica context path:**
```properties
# Se configurato
server.servlet.context-path=/immobiliaris

# URL diventa
http://localhost:8080/immobiliaris/api/immobili
```

### Errore: 500 Internal Server Error

**Sintomo:** Richiesta causa crash server.

**Causa:** Eccezione non gestita, null pointer, validazione fallita.

**Soluzioni:**

**Controlla log backend:**
```bash
# Linux systemd
sudo journalctl -u immobiliaris -f

# File log
tail -f /var/log/immobiliaris/application.log

# Windows
type C:\immobiliaris\logs\application.log
```

**Stack trace comune:**
```
NullPointerException
  at com.immobiliaris.service.ImmobileServiceImpl.findById
```

**Debugging:**
1. Identifica riga errore da stack trace
2. Verifica input non-null
3. Aggiungi validazione:
```java
if (id == null) {
    throw new IllegalArgumentException("ID cannot be null");
}
```

### Errore: Request Body missing

**Sintomo:**
```
Required request body is missing
```

**Causa:** POST/PUT senza body o Content-Type errato.

**Soluzioni:**

**Verifica Content-Type:**
```javascript
fetch('/api/immobili', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',  // Obbligatorio
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(data)  // Converti oggetto a JSON
});
```

**Verifica body presente:**
```javascript
console.log('Body:', JSON.stringify(data));
```

### Errore: Validation failed

**Sintomo:**
```
400 Bad Request
Validation failed for argument...
```

**Causa:** Input non valido, constraint violati.

**Soluzioni:**

**Verifica annotazioni DTO:**
```java
@NotNull(message = "Nome obbligatorio")
@Size(min = 2, max = 50, message = "Nome deve essere tra 2 e 50 caratteri")
private String nome;

@Email(message = "Email non valida")
private String email;
```

**Verifica formato input:**
```javascript
// Corretto
{ "metri_quadri": 85.5 }

// Errato
{ "metri_quadri": "85.5" }  // String invece di number
```

---

## Problemi Frontend

### Form valutazione non avanza

**Sintomo:** Click su "Avanti" non cambia step.

**Causa:** Validazione JavaScript fallita.

**Soluzioni:**

**Apri console browser (F12):**
```javascript
// Cerca errori
console.error(...)
```

**Verifica campi obbligatori:**
```javascript
const campoObbligatorio = document.getElementById('nome');
if (!campoObbligatorio.value) {
    console.log('Campo nome vuoto');
}
```

**Verifica event listener:**
```javascript
document.getElementById('btnAvanti').addEventListener('click', function() {
    console.log('Click avanti rilevato');
});
```

### Dashboard vuota dopo login

**Sintomo:** Pagina bianca o nessun dato visualizzato.

**Causa:** Errore fetch API, token non salvato, JavaScript error.

**Soluzioni:**

**Verifica token in localStorage:**
```javascript
const token = localStorage.getItem('token');
console.log('Token presente:', !!token);
```

**Verifica chiamata API:**
```javascript
// Console browser Network tab
// Cerca chiamata a /api/valutazioni/utente/X
// Verifica:
// - Status Code (200 OK)
// - Response contiene dati
// - Authorization header presente
```

**Verifica errori JavaScript:**
```javascript
// Console tab
// Cerca errori in rosso
```

**Test manuale API:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/valutazioni/utente/1
```

### Stili CSS non applicati

**Sintomo:** Pagina senza formattazione.

**Causa:** Tailwind non compilato, path CSS errato.

**Soluzioni:**

**Verifica path CSS:**
```html
<!-- Corretto -->
<link href="/styles/style-tailwind.css" rel="stylesheet">

<!-- Errato -->
<link href="styles/style-tailwind.css" rel="stylesheet">  <!-- Manca / iniziale -->
```

**Compila Tailwind:**
```bash
cd immobiliaris-be
npm run tailwind:watch
```

**Verifica file CSS esiste:**
```bash
ls src/main/resources/static/styles/style-tailwind.css
```

### JavaScript non eseguito

**Sintomo:** Nessuna interattività, form non funziona.

**Causa:** Errore JavaScript, script non caricato.

**Soluzioni:**

**Console browser errori:**
```
Uncaught ReferenceError: functionName is not defined
```

**Verifica script caricato:**
```html
<script src="/js/valutazione.js"></script>
```

**Verifica ordine script:**
```html
<!-- Corretto: auth-utils prima di user.js -->
<script src="/js/auth-utils.js"></script>
<script src="/js/user.js"></script>

<!-- Errato: user.js usa funzioni di auth-utils -->
<script src="/js/user.js"></script>
<script src="/js/auth-utils.js"></script>
```

---

## Problemi Performance

### Applicazione lenta

**Sintomo:** Tempo risposta alto, timeout.

**Causa:** Query inefficienti, memoria insufficiente, carico alto.

**Soluzioni:**

**Verifica log query:**
```properties
spring.jpa.show-sql=true
logging.level.org.hibernate.SQL=DEBUG
```

**Ottimizza query N+1:**
```java
// Problema
@OneToMany(fetch = FetchType.LAZY)
List<Immobile> immobili;

// Soluzione
@Query("SELECT v FROM Venditore v LEFT JOIN FETCH v.immobili")
List<Venditore> findAllWithImmobili();
```

**Aggiungi indici database:**
```sql
CREATE INDEX idx_immobile_cap ON immobile(cap);
CREATE INDEX idx_valutazione_utente ON valutazione(id_utente);
CREATE INDEX idx_utente_email ON utente(email);
```

**Aumenta connection pool:**
```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
```

### OutOfMemoryError in produzione

**Sintomo:** Server crash con heap space error.

**Causa:** Memory leak, heap size troppo piccola.

**Soluzioni:**

**Heap dump analysis:**
```bash
# Abilita heap dump
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/var/log/immobiliaris/

# Analizza dump
jhat heap_dump.hprof
```

**Aumenta heap:**
```bash
JAVA_OPTS="-Xms1024m -Xmx4096m"
```

**Profiling:**
```bash
# VisualVM, JProfiler, YourKit
jvisualvm
```

### Database connection timeout

**Sintomo:**
```
Connection is not available, request timed out after 30000ms
```

**Causa:** Pool connessioni esaurito, query lente.

**Soluzioni:**

**Aumenta connection timeout:**
```properties
spring.datasource.hikari.connection-timeout=60000
spring.datasource.hikari.maximum-pool-size=20
```

**Verifica query lente:**
```sql
-- PostgreSQL
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

**Connection leak:**
```properties
spring.datasource.hikari.leak-detection-threshold=60000
```

---

## Errori Comuni

### Errore: No mapping for GET /

**Causa:** Nessun controller per root path.

**Soluzione:** Aggiungi redirect:
```java
@GetMapping("/")
public String home() {
    return "redirect:/index.html";
}
```

### Errore: Whitelabel Error Page

**Causa:** Eccezione non gestita, template non trovato.

**Soluzione:** Verifica controller e path template.

### Errore: Bean creation exception

**Causa:** Dipendenza circolare, configurazione errata.

**Soluzione:** Verifica @Autowired e constructor injection.

### Errore: Failed to determine suitable driver class

**Causa:** Datasource non configurato, dipendenza driver mancante.

**Soluzione:** Verifica pom.xml e application.properties.

---

## Logging e Debugging

### Abilita Debug Logging

```properties
# Application
logging.level.com.immobiliaris=DEBUG

# Spring Security
logging.level.org.springframework.security=DEBUG

# Hibernate
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# HTTP Requests
logging.level.org.springframework.web=DEBUG
```

### Useful Logs

```bash
# Systemd
sudo journalctl -u immobiliaris --since "1 hour ago" -f

# File
tail -f /var/log/immobiliaris/application.log | grep ERROR

# Docker
docker logs -f immobiliaris-app

# Windows
Get-Content C:\immobiliaris\logs\application.log -Wait -Tail 50
```

---

## Contatti Supporto

Per problemi non risolti:
- Repository GitHub: https://github.com/marcologioco/laboratorio-integrato-group-4
- Issue Tracker: https://github.com/marcologioco/laboratorio-integrato-group-4/issues
- Email: support@yourdomain.com
