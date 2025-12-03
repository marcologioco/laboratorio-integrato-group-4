# Guida Testing e Sistema Valutazione

---

## Indice

1. [Sistema Valutazione Automatica](#sistema-valutazione-automatica)
2. [Flussi Valutazione](#flussi-valutazione)
3. [Test Completi](#test-completi)
4. [Algoritmo di Calcolo](#algoritmo-di-calcolo)
5. [Troubleshooting](#troubleshooting)

---

## Sistema Valutazione Automatica

### Panoramica

Il sistema di valutazione automatica di Immobiliaris permette agli utenti di ottenere una stima del valore di un immobile basata su dati di mercato reali, caratteristiche dell'immobile e stato di conservazione.

### Caratteristiche Principali

**Form Multi-Step:**

- Step 0: Scelta modalità (utente registrato o nuovo)
- Step 1: Dati personali (solo per nuovi utenti)
- Step 2: Localizzazione immobile
- Step 3: Tipo immobile
- Step 4: Stato conservazione
- Step 5: Pertinenze e dettagli

**Funzionalità:**

- Progress bar animata
- Validazione real-time
- Chiamata API /api/valutazioni/automatica
- Visualizzazione risultato immediato
- Nessun modale, tutto integrato nella pagina
- Possibilità di nuova valutazione

### File Coinvolti

**Frontend:**

- `index.html`: Form valutazione nella sezione hero
- `js/valutazione.js`: Logica multi-step e chiamata API
- `js/validation-utils.js`: Validazione campi

**Backend:**

- `ValutazioneAutomaticaController.java`: Endpoint REST
- `ValutazioneAutomaticaService.java`: Logica calcolo
- `RichiestaValutazioneDTO.java`: DTO richiesta
- `RispostaValutazioneDTO.java`: DTO risposta

---

## Flussi Valutazione

### Flusso 1: Utente Non Registrato

**Scenario:** L'utente non ha account e vuole registrarsi e richiedere valutazione in un unico flusso.

**Percorso Completo:**

```
1. PAGINA INIZIALE (index.html)
   └─> Step 0: Sei già registrato?
       └─> Selezione "NO"

2. COMPILAZIONE FORM COMPLETO
   Step 1 - Dati Personali:
   - Nome, Cognome
   - Email, Telefono
   - Password
   - Sei proprietario? (Sì/No)
   
   Step 2 - Dati Immobile:
   - Indirizzo, Città, Provincia, CAP
   - Metri quadri, Camere, Bagni
   
   Step 3 - Tipo Immobile:
   - Appartamento / Villa / Ufficio
   
   Step 4 - Stato Immobile:
   - Nuova / Ristrutturata / Abitabile / Da Ristrutturare
   
   Step 5 - Pertinenze:
   - Balconi, Terrazzo, Giardino, Garage
   - Descrizione opzionale

3. ELABORAZIONE BACKEND
   POST /api/valutazioni/automatica
   
   Operazioni:
   a. Crea nuovo Utente (password hashata)
   b. Crea Venditore (se isProprietario = true)
   c. Crea Immobile (associato al venditore)
   d. Calcola valutazione automatica
   e. Crea record Valutazione (stato COMPLETATA)
   f. Invia risposta al frontend

4. RISULTATO
   - Valore Stimato visualizzato
   - Valore Base Zona
   - Messaggio conferma
   - Bottone "Nuova Valutazione"
```

**Dati Creati nel Database:**

```sql
-- Utente
INSERT INTO utente (nome, cognome, email, password, telefono, id_ruolo)
VALUES ('Mario', 'Rossi', 'mario.rossi@email.com', '$2a$10$...', '3331234567', 1);

-- Venditore (se proprietario)
INSERT INTO venditore (id_utente, nome, cognome, email, telefono, citta, provincia)
VALUES (6, 'Mario', 'Rossi', 'mario.rossi@email.com', '3331234567', 'Torino', 'TO');

-- Immobile
INSERT INTO immobile (id_venditore, tipo, indirizzo, citta, provincia, cap, 
                      metri_quadri, camere, bagni, prezzo, stato)
VALUES (7, 'APPARTAMENTO', 'Via Roma 15', 'Torino', 'TO', '10121', 
        85, 3, 2, 0, 'RISTRUTTURATA');

-- Valutazione
INSERT INTO valutazione (id_immobile, id_utente, stato, valore_stimato, 
                         valore_calcolato_zona, data_richiesta, data_completamento)
VALUES (7, 6, 'COMPLETATA', 375000, 340000, NOW(), NOW());
```

### Flusso 2: Utente Già Registrato

**Scenario:** L'utente ha account e vuole richiedere valutazione per nuovo immobile.

**Percorso Completo:**

```
1. PAGINA INIZIALE (index.html)
   └─> Step 0: Sei già registrato?
       └─> Selezione "SÌ"
           └─> REDIRECT a login.html

2. PAGINA LOGIN (login.html)
   - Email: luca.rossi@example.com
   - Password: pwd123
   └─> Backend: POST /api/auth/login
       └─> Token JWT generato
           └─> REDIRECT a user.html

3. DASHBOARD UTENTE (user.html)
   - Benvenuto, [Nome Utente]
   - Le mie Valutazioni (storico)
   └─> CLICK "Richiedi Nuova Valutazione"
       └─> REDIRECT a index.html?mode=logged

4. FORM SEMPLIFICATO
   JavaScript rileva mode=logged
   - Salta Step 0 (scelta registrazione)
   - Salta Step 1 (dati personali)
   - Inizia da Step 2 (solo dati immobile)
   
   Step 2-5: Come Flusso 1

5. ELABORAZIONE BACKEND
   POST /api/valutazioni/logged
   Header: Authorization: Bearer {token}
   
   Operazioni:
   a. Estrae email dal token JWT
   b. Recupera Utente dal database
   c. Recupera/Crea Venditore per utente
   d. Crea Immobile
   e. Calcola valutazione automatica
   f. Crea record Valutazione
   g. Invia risposta

6. RISULTATO
   - Valore Stimato visualizzato
   - Bottone "Torna alla Dashboard"
   └─> REDIRECT a user.html
```

**Dati Creati nel Database:**

```sql
-- Utente: già esistente (recuperato da token)

-- Venditore: recuperato o creato se non esiste

-- Immobile (NUOVO)
INSERT INTO immobile (id_venditore, tipo, indirizzo, citta, provincia, cap, 
                      metri_quadri, camere, bagni, prezzo, stato)
VALUES (1, 'VILLA', 'Corso Vittorio 88', 'Torino', 'TO', '10138', 
        120, 4, 2, 0, 'NUOVA');

-- Valutazione (NUOVA)
INSERT INTO valutazione (id_immobile, id_utente, stato, valore_stimato, 
                         valore_calcolato_zona, data_richiesta, data_completamento)
VALUES (8, 1, 'COMPLETATA', 380650, 288000, NOW(), NOW());
```

### Confronto tra i Flussi

| Caratteristica | Flusso 1 (Nuovo) | Flusso 2 (Loggato) |
|----------------|------------------|---------------------|
| Punto partenza | index.html | index.html → Login → Dashboard |
| Autenticazione | Nessuna | Token JWT richiesto |
| Step compilare | 0 → 1 → 2 → 3 → 4 → 5 | 2 → 3 → 4 → 5 |
| Dati richiesti | Utente + Immobile | Solo Immobile |
| Endpoint | /api/valutazioni/automatica | /api/valutazioni/logged |
| DTO utilizzato | RichiestaValutazioneDTO | RichiestaValutazioneImmobileDTO |
| Crea utente | Sì | No (già esistente) |
| Crea venditore | Se proprietario | Solo se non esiste |
| Tempo stimato | 3-5 minuti | 2 minuti |

---

## Test Completi

### Test Flusso 1: Nuovo Utente

**Prerequisiti:**

- Backend avviato su <http://localhost:8080>
- Database H2 inizializzato

**Passi:**

1. **Avvia Backend:**

   **Opzione A - Da terminale:**
   ```bash
   cd immobiliaris-be
   ./mvnw spring-boot:run
   ```

   **Opzione B - Con doppio click (Windows):**
   - Vai nella cartella `immobiliaris-be\avviamento\`
   - Fai **doppio click** su `start.bat`
   - Attendi che appaia il messaggio "Started ImmobiliarisBeApplication"

2. **Apri Browser:**
   Vai a <http://localhost:8080/>

3. **Compila Form:**

   **Step 0:**
   - Clicca "NO" su "Sei già registrato?"

   **Step 1 - Dati Personali:**
   - Nome: Mario
   - Cognome: Bianchi
   - Email: <mario.bianchi@test.it>
   - Telefono: 3331234567
   - Password: test123
   - Proprietario: Sì

   **Step 2 - Localizzazione:**
   - Indirizzo: Via Garibaldi 15
   - Città: Torino
   - Provincia: TO
   - CAP: 10121 (Centro Storico - 4000 euro/m²)
   - Metri Quadri: 85
   - Camere: 3
   - Bagni: 2

   **Step 3 - Tipo:**
   - Seleziona: Appartamento

   **Step 4 - Stato:**
   - Seleziona: Abitabile

   **Step 5 - Pertinenze:**
   - Balconi: 1
   - Terrazzo: Sì (check)
   - Giardino: No
   - Garage: Sì (check)
   - Descrizione: Appartamento luminoso in zona centrale

4. **Invia Valutazione:**
   - Clicca "Calcola Valutazione"

5. **Verifica Risultato:**
   - Valore Stimato: circa 375.000 euro
   - Valore Base Zona: 340.000 euro (85m² × 4000 euro/m²)
   - Messaggio conferma

6. **Verifica Database:**

   ```
   http://localhost:8080/h2-console
   JDBC URL: jdbc:h2:mem:ImmobiliarisDB
   Username: sa
   Password: (vuoto)
   ```

   ```sql
   SELECT * FROM utente WHERE email = 'mario.bianchi@test.it';
   SELECT * FROM immobile WHERE citta = 'Torino' AND cap = '10121';
   SELECT v.*, i.indirizzo, u.nome, u.cognome 
   FROM valutazione v
   JOIN immobile i ON v.id_immobile = i.id_immobile
   JOIN utente u ON v.id_utente = u.id_utente
   WHERE u.email = 'mario.bianchi@test.it';
   ```

### Test Flusso 2: Utente Loggato

**Credenziali Test:**

- Email: <luca.rossi@example.com>
- Password: pwd123

**Passi:**

1. **Avvia Backend** (come Test 1)

2. **Vai a Homepage:**
   <http://localhost:8080/>

3. **Scegli Login:**
   - Step 0: Clicca "SÌ" su "Sei già registrato?"
   - Redirect automatico a login.html

4. **Effettua Login:**
   - Email: <luca.rossi@example.com>
   - Password: pwd123
   - Clicca "Accedi"
   - Redirect a user.html

5. **Dashboard Utente:**
   - Visualizza valutazioni esistenti
   - Clicca "Richiedi Nuova Valutazione"

6. **Compila Form Semplificato:**
   (Solo Step 2-5, dati personali già salvati)

   **Step 2 - Localizzazione:**
   - Indirizzo: Corso Vittorio 88
   - Città: Torino
   - Provincia: TO
   - CAP: 10138 (Santa Rita - 1900 euro/m²)
   - Metri Quadri: 120
   - Camere: 4
   - Bagni: 2

   **Step 3 - Tipo:**
   - Seleziona: Villa

   **Step 4 - Stato:**
   - Seleziona: Nuova

   **Step 5 - Pertinenze:**
   - Balconi: 2
   - Terrazzo: No
   - Giardino: Sì (check)
   - Garage: Sì (check)
   - Descrizione: Villa moderna con giardino

7. **Invia e Verifica:**
   - Valore Stimato: circa 301.000 euro
   - Redirect a dashboard
   - Verifica nuova valutazione in lista

### Test con CAP Diversi

Testa con vari CAP disponibili per verificare calcolo zone:

**Torino (prezzi diversi):**

- 10121 Centro Storico: 4000 euro/m²
- 10126 Lingotto: 2400 euro/m²
- 10138 Santa Rita: 1900 euro/m²

**Altre città:**

- 14100 Asti Centro: 1900 euro/m²
- 15121 Alessandria Centro: 1700 euro/m²
- 12100 Cuneo Centro: 2200 euro/m²

### Test Admin

**Credenziali Admin:**

- Email: <admin@example.com>
- Password: admin123

**Passi:**

1. Login come admin
2. Vai a admin.html
3. Verifica visibilità:
   - Tutti gli utenti (incluso <mario.bianchi@test.it>)
   - Tutti gli immobili
   - Tutte le valutazioni
4. Conferma separazione dati utente vs admin

---

## Algoritmo di Calcolo

### Formula Generale

```
Valore Finale = (Valore Base + Extra) × Moltiplicatore Stato
```

### Componenti

**1. Valore Base:**

```
Valore Base = Metri Quadri × Prezzo Medio Zona (da tabella zona tramite CAP)
```

**2. Extra (addizioni):**

- Bagni extra (oltre il primo): 5.000 euro ciascuno
- Balconi: 3.000 euro ciascuno
- Terrazzo: 15.000 euro
- Giardino: 20.000 euro
- Garage: 12.000 euro

**3. Moltiplicatore Stato:**

- Nuova: 1.15 (+15%)
- Ristrutturata: 1.05 (+5%)
- Abitabile: 1.0 (nessun cambiamento)
- Da Ristrutturare: 0.75 (-25%)

### Esempio Calcolo Dettagliato

**Dati Immobile:**

- CAP: 10121 (Centro Storico Torino - 4000 euro/m²)
- Metri Quadri: 85
- Bagni: 2
- Balconi: 1
- Terrazzo: Sì
- Giardino: No
- Garage: Sì
- Stato: Abitabile

**Calcolo:**

```
Valore Base = 85 m² × 4000 euro/m² = 340.000 euro

Extra:
- 1 bagno extra (2 - 1): 5.000 euro
- 1 balcone: 3.000 euro
- Terrazzo: 15.000 euro
- Garage: 12.000 euro
Totale Extra = 35.000 euro

Valore + Extra = 340.000 + 35.000 = 375.000 euro

Moltiplicatore (Abitabile) = 1.0

Valore Finale = 375.000 × 1.0 = 375.000 euro
```

### CAP Disponibili

**Torino (32 zone):**

- 10121-10156: Varie zone con prezzi da 1700 a 4000 euro/m²

**Altre città:**

- 14100 Asti: 1900 euro/m²
- 15121 Alessandria: 1700 euro/m²
- 12100 Cuneo: 2200 euro/m²

Verifica CAP disponibili:

```sql
SELECT cap, nome_zona, prezzo_medio_sqm FROM zona ORDER BY cap;
```

---

## Troubleshooting

### Errore 403 Forbidden

**Causa:** Endpoint non configurato come pubblico

**Soluzione:**
Verifica SecurityConfig.java:

```java
.requestMatchers("/api/valutazioni/automatica").permitAll()
```

### CAP non trovato

**Problema:** CAP inserito non esiste in tabella zona

**Soluzione:**

- Usa CAP esistenti (verifica con query SQL)
- Sistema usa prezzo fallback 2500 euro/m² se CAP non trovato
- Aggiungi CAP mancante in data-test.sql

**Verifica CAP:**

```sql
SELECT cap, nome_zona, prezzo_medio_sqm FROM zona WHERE cap = 'IL_TUO_CAP';
```

### Email già esistente

**Comportamento:** Sistema recupera utente esistente invece di crearne uno nuovo

**Nota:** Non è un errore, è comportamento intenzionale. La nuova valutazione viene collegata all'utente esistente.

**Se necessario nuovo utente:** Usa email diversa.

### Dashboard vuota dopo login

**Possibili cause:**

1. Token JWT non valido
2. Errore JavaScript
3. Endpoint API non accessibile

**Soluzioni:**

- Verifica console browser (F12) per errori
- Controlla che token sia salvato in localStorage
- Verifica endpoint /api/valutazioni/utente/{id} accessibile
- Rieffettua login

### Risultato valutazione non visualizzato

**Causa:** Errore chiamata API o risposta

**Debugging:**

1. Apri console browser (F12)
2. Vai a tab Network
3. Cerca chiamata a /api/valutazioni/automatica
4. Verifica:
   - Status Code (deve essere 200)
   - Response Body (deve contenere valori)
5. Se errore 500: verifica log backend
6. Se errore 400: verifica formato dati inviati

### Valore stimato sembra errato

**Verifica:**

1. CAP corretto e esistente
2. Prezzo medio zona corretto
3. Formula applicata correttamente

**Debug manuale:**

```
Valore Base = metri_quadri × prezzo_medio_zona
Extra = somma pertinenze
Moltiplicatore = in base a stato
Risultato = (Base + Extra) × Moltiplicatore
```

### Form non avanza agli step successivi

**Causa:** Validazione campi fallita

**Soluzione:**

- Compila tutti i campi obbligatori (marcati con *)
- Verifica formato:
  - Email: formato valido
  - Telefono: 10 cifre
  - CAP: 5 cifre
  - Provincia: 2 lettere
- Controlla messaggi errore sotto i campi

### Connessione backend fallita

**Sintomo:** Errore "Failed to fetch" o simili

**Soluzioni:**

1. Verifica backend avviato:

   ```bash
   curl http://localhost:8080/api/zone
   ```

2. Controlla porta 8080 non occupata
3. Verifica firewall non blocchi connessione
4. Riavvia backend se necessario

---

## Note Importanti

### Database H2

- Database in-memory: dati persi a ogni riavvio
- Dati ripristinati da data-test.sql all'avvio
- Per persistenza permanente: migrare a PostgreSQL/MySQL

### Sicurezza

- Password hashate con BCrypt
- Token JWT per autenticazione
- Sessioni stateless
- Endpoint pubblici limitati
- Validazione input lato client e server

### Performance

- Calcolo valutazione istantaneo
- Nessuna elaborazione asincrona necessaria
- Database in-memory velocissimo
- Ottimizzazione query con indici

### Prossimi Sviluppi

- Validazione lato client più sofisticata
- Autocomplete città e province
- Integrazione mappe per selezione indirizzo
- Salvataggio bozze valutazione
- Notifiche email post-valutazione
- Export PDF valutazione
