# TODO: Sicurezza e Collegamento Frontend

file creato con l'aiuto dell'ia per brevità e coerenza con i prossimi passi da fare

## 📋 FASE 1: SICUREZZA - Password Hashate

### 1.1 Aggiungere Dipendenze Spring Security

- [ ] Aprire `pom.xml`
- [ ] Aggiungere dipendenza `spring-boot-starter-security`
- [ ] Aggiungere dipendenza `jjwt` per JWT (opzionale ma consigliato)
- [ ] Eseguire `mvn clean install`

### 1.2 Configurare Password Encoder

- [ ] Creare classe `SecurityConfig.java` in package `config`
- [ ] Definire bean `PasswordEncoder` (BCryptPasswordEncoder)
- [ ] Configurare HTTP Security per permettere accesso pubblico alle API necessarie

### 1.3 Modificare Gestione Password

- [ ] Aggiornare `UtenteService.saveUtente()` per hashare password prima del salvataggio
- [ ] Aggiornare `UtenteService.updateUtente()` per hashare nuove password
- [ ] Aggiornare `UtenteService.patchUtente()` per hashare password se presente

### 1.4 Aggiornare Dati di Test

- [ ] Modificare `data-test.sql` con password pre-hashate
- [ ] Oppure creare script per hashare password all'avvio

---

## 🔐 FASE 2: AUTENTICAZIONE E AUTORIZZAZIONE

### 2.1 Creare Sistema di Login

- [ ] Creare `LoginRequest` DTO (email, password)
- [ ] Creare `LoginResponse` DTO (token, user info, ruolo)
- [ ] Creare `AuthController` con endpoint `/api/auth/login`
- [ ] Implementare `AuthService` per validare credenziali

### 2.2 Implementare JWT (Opzionale ma Consigliato)

- [ ] Creare `JwtUtil` per generare e validare token
- [ ] Configurare durata token (es: 24 ore)
- [ ] Aggiungere claims: userId, email, ruolo

### 2.3 Proteggere Endpoint per Ruolo

- [ ] Endpoint Admin-only:
  - `GET /api/utenti` - lista tutti utenti
  - `DELETE /api/utenti/{id}` - eliminare utenti
  - `GET /api/venditori` - lista tutti venditori
  - Dashboard admin
- [ ] Endpoint Utente autenticato:
  - `GET /api/utenti/{id}` - solo proprio profilo
  - `PATCH /api/utenti/{id}` - solo proprio profilo
  - Creare/vedere proprie valutazioni
- [ ] Endpoint Pubblici:
  - `POST /api/auth/login`
  - `POST /api/utenti` (registrazione)
  - `GET /api/immobili` (ricerca pubblica)
  - `GET /api/zone` (dati pubblici)

### 2.4 Aggiungere Filtri di Sicurezza

- [ ] Creare `JwtAuthenticationFilter` per validare token
- [ ] Configurare filter chain in `SecurityConfig`
- [ ] Gestire eccezioni 401 Unauthorized e 403 Forbidden

---

## 🌐 FASE 3: COLLEGAMENTO FRONTEND

### 3.1 Configurare CORS Correttamente

- [ ] Verificare annotazione `@CrossOrigin` su tutti i controller
- [ ] Oppure configurare CORS globale in `SecurityConfig`
- [ ] Permettere: GET, POST, PUT, PATCH, DELETE
- [ ] Permettere headers: Authorization, Content-Type
- [ ] Definire origine frontend (es: `http://localhost:3000` o URL produzione)

### 3.2 Creare Endpoint di Utilità per FE

- [ ] `GET /api/auth/me` - ottenere info utente corrente da token
- [ ] `GET /api/auth/validate` - validare token
- [ ] `POST /api/auth/refresh` - refresh token (opzionale)
- [ ] `POST /api/auth/logout` - invalidare token (opzionale)

### 3.3 Standardizzare Risposte API

- [ ] Creare `ApiResponse<T>` wrapper per risposte consistenti
- [ ] Includere: success, message, data, timestamp
- [ ] Gestire errori uniformemente con `@ControllerAdvice`

### 3.4 Documentazione per Frontend

- [ ] Aggiornare `API_TEST_BODIES.json` con endpoint auth
- [ ] Documentare formato token (Bearer {token})
- [ ] Documentare codici errore e messaggi
- [ ] Fornire esempi di chiamate con autenticazione

---

## 🎯 FASE 4: ROUTING UTENTE VS ADMIN

### 4.1 Backend - Endpoint Separati

- [ ] Creare `AdminController` per operazioni admin
  - Dashboard statistiche
  - Gestione utenti
  - Approvazione valutazioni
- [ ] Creare `UserController` per operazioni utente
  - Profilo personale
  - Richieste valutazione
  - Cronologia

### 4.2 Frontend - Routing (da implementare lato FE)

/login → Pagina login
/register → Registrazione nuovo utente

--- UTENTE NORMALE ---
/user/dashboard → Dashboard utente
/user/profile → Profilo personale
/user/immobili → Ricerca immobili
/user/valutazioni → Le mie richieste valutazione

--- ADMIN ---
/admin/dashboard → Dashboard admin
/admin/utenti → Gestione utenti
/admin/venditori → Gestione venditori
/admin/valutazioni → Tutte le valutazioni
/admin/statistiche → Report e statistiche

### 4.3 Logica di Redirect dopo Login

- [ ] Backend ritorna ruolo in LoginResponse
- [ ] Frontend salva token e ruolo in localStorage/sessionStorage
- [ ] Frontend redirect basato su ruolo:
  - `idRuolo === 1` → `/user/dashboard`
  - `idRuolo === 2` → `/admin/dashboard`

### 4.4 Protezione Route Frontend

- [ ] Implementare Route Guard/Protected Route
- [ ] Verificare token valido prima di accedere
- [ ] Verificare ruolo corretto per route admin
- [ ] Redirect a /login se non autenticato
- [ ] Redirect a /unauthorized se ruolo insufficiente

---

## 🧪 FASE 5: TESTING

### 5.1 Test Sicurezza

- [ ] Testare login con credenziali corrette
- [ ] Testare login con credenziali errate
- [ ] Testare accesso endpoint protetti senza token
- [ ] Testare accesso endpoint admin con utente normale
- [ ] Testare refresh/validazione token

### 5.2 Test Integrazione FE-BE

- [ ] Testare login da frontend
- [ ] Testare salvataggio token
- [ ] Testare chiamate API con Authorization header
- [ ] Testare redirect dopo login
- [ ] Testare logout e cancellazione token

### 5.3 Test Password

- [ ] Verificare password hashate nel database
- [ ] Testare cambio password
- [ ] Testare reset password (se implementato)

---

## 📦 DIPENDENZE DA AGGIUNGERE

```xml
<!-- pom.xml -->
<dependencies>
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
</dependencies>
```

---

## 🔑 ESEMPIO FLUSSO COMPLETO

### 1. Utente fa Login

```
POST /api/auth/login
Body: { "email": "luca.rossi@example.com", "password": "pwd123" }

Response: {
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "idUtente": 2,
    "nome": "Luca",
    "cognome": "Rossi",
    "email": "luca.rossi@example.com",
    "idRuolo": 1
  },
  "ruolo": "utente"
}
```

### 2. Frontend Salva Token e Ruolo

```javascript
localStorage.setItem('token', response.token);
localStorage.setItem('user', JSON.stringify(response.user));

if (response.ruolo === 'admin') {
  navigate('/admin/dashboard');
} else {
  navigate('/user/dashboard');
}
```

### 3. Chiamate API Successive

```
GET /api/utenti/2
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs...",
  "Content-Type": "application/json"
}
```

---

## ⚠️ NOTE IMPORTANTI

1. **Password Attuali**: Le password in `data-test.sql` sono in chiaro. Vanno hashate!
2. **Token Secret**: Usare variabile d'ambiente per JWT secret, NON hardcodare
3. **HTTPS**: In produzione usare SEMPRE HTTPS
4. **CORS**: Configurare origine specifica, non usare "*" in produzione
5. **Validation**: Aggiungere validazione input (email formato, password lunghezza)
6. **Rate Limiting**: Considerare rate limiting su endpoint login

---

## 📝 ORDINE CONSIGLIATO

1. ✅ Fase 1: Sicurezza password (PRIORITÀ ALTA)
2. ✅ Fase 2.1-2.2: Sistema login base con JWT
3. ✅ Fase 3.1: Configurare CORS
4. ✅ Fase 2.3: Proteggere endpoint per ruolo
5. ✅ Fase 3.2-3.3: Endpoint utilità e standardizzazione
6. ✅ Fase 4: Routing e separazione utente/admin
7. ✅ Fase 5: Testing completo

---

## 🎓 RISORSE UTILI

- Spring Security: https://spring.io/guides/gs/securing-web/
- JWT Java: https://github.com/jwtk/jjwt
- BCrypt: https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/crypto/bcrypt/BCryptPasswordEncoder.html
- CORS Spring Boot: https://spring.io/guides/gs/rest-service-cors/

---

## 🗄️ EXTRA: MIGRAZIONE DA H2 A MYSQL (Per Produzione)

### Perché migrare da H2 a MySQL?

**H2 (attuale)** - Database in-memory:

- ❌ **Dati volatili**: Tutti i dati vengono persi quando fermi l'applicazione
- ❌ **Solo sviluppo**: Non adatto per ambienti di produzione
- ❌ **Rischio sicurezza**: Console H2 esposta è un rischio in produzione
- ✅ **Vantaggi**: Veloce da configurare, zero installazione, ottimo per testing

**MySQL (produzione)** - Database persistente:

- ✅ **Dati persistenti**: I dati rimangono salvati anche dopo restart
- ✅ **Scalabile**: Supporta grandi volumi di dati e utenti concorrenti
- ✅ **Affidabile**: Backup, replica, transaction log
- ✅ **Standard industry**: Usato da milioni di applicazioni in produzione

### Passi per la migrazione:

#### 1. Aggiungere dipendenza MySQL in `pom.xml`

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

#### 2. Modificare `application.properties`

**Commentare configurazione H2:**
```properties
# H2 - SOLO SVILUPPO
#spring.datasource.url=jdbc:h2:mem:ImmobiliarisDB;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
#spring.datasource.driverClassName=org.h2.Driver
#spring.h2.console.enabled=true
#spring.h2.console.path=/h2
```

**Aggiungere configurazione MySQL:**
```properties
# MySQL - PRODUZIONE
spring.datasource.url=jdbc:mysql://localhost:3306/immobiliaris_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA con MySQL
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

#### 3. Rimuovere configurazioni H2 da SecurityConfig

Rimuovere:
```java
.requestMatchers("/h2/**").permitAll()
.headers(headers -> headers.frameOptions(frame -> frame.disable()))
```

#### 4. Installare e configurare MySQL

- Installare MySQL Server localmente o usare servizio cloud (AWS RDS, Azure Database, etc.)
- Creare database: `CREATE DATABASE immobiliaris_db;`
- Creare utente con permessi appropriati

#### 5. Testare la migrazione

- Avviare applicazione
- Hibernate creerà automaticamente le tabelle in MySQL
- DataLoader inserirà gli utenti
- data-test.sql inserirà i dati di test

### Note importanti:

- **Environment variables**: In produzione, usa variabili d'ambiente per password DB
- **Backup**: Implementa strategia di backup regolare
- **Connection pooling**: HikariCP (già incluso) gestisce le connessioni
- **Performance**: Considera l'aggiunta di indici su colonne frequentemente ricercate

