# Manuale Utente - Immobiliaris

---

## Indice

1. [Introduzione](#introduzione)
2. [Accesso al Sistema](#accesso-al-sistema)
3. [Funzionalità per Utenti Non Registrati](#funzionalità-per-utenti-non-registrati)
4. [Funzionalità per Utenti Registrati](#funzionalità-per-utenti-registrati)
5. [Funzionalità per Amministratori](#funzionalità-per-amministratori)
6. [Risoluzione Problemi Comuni](#risoluzione-problemi-comuni)

---

## Introduzione

Immobiliaris è un portale immobiliare che permette di:

- Ottenere valutazioni automatiche di immobili
- Gestire le proprie richieste di valutazione
- Amministrare l'intero sistema (solo per amministratori)

### Avvio Rapido del Sistema

**Windows:**
1. Vai nella cartella `AVVIAMENTO\` (nella root del progetto)
2. Fai **doppio click** su `start.bat`
3. Attendi l'avvio (circa 30-60 secondi)
4. Il sistema sarà accessibile su: `http://localhost:8080`

**Altri sistemi:**
```bash
cd immobiliaris-be
mvn spring-boot:run
```

Il sistema è accessibile tramite browser web all'indirizzo: `http://localhost:8080`

---

## Accesso al Sistema

### Visitare il Sito

1. Aprire il browser web (Chrome, Firefox, Edge, Safari)
2. Digitare nella barra degli indirizzi: `http://localhost:8080`
3. Si visualizzerà la homepage con il form di valutazione

### Effettuare il Login

1. Dalla homepage, cliccare su "Area Riservata" nel menu in alto
2. Inserire email e password
3. Cliccare su "Accedi"
4. Il sistema reindirizza automaticamente all'area personale in base al ruolo:
   - Utenti normali: Dashboard Utente
   - Amministratori: Dashboard Admin

### Credenziali di Test

Per testare il sistema sono disponibili i seguenti account:

**Amministratore:**

- Email: `admin@example.com`
- Password: `admin123`
- Nome: Admin Default

**Utenti Standard:**

- Email: `luca.rossi@example.com` / Password: `pwd123` (Luca Rossi)
- Email: `marta.bianchi@example.com` / Password: `pwd456` (Marta Bianchi)
- Email: `giulia.verdi@example.com` / Password: `pwd789` (Giulia Verdi)
- Email: `paolo.ferrari@example.com` / Password: `pwd101` (Paolo Ferrari)
- Email: `sara.conti@example.com` / Password: `pwd202` (Sara Conti)

---

## Funzionalità per Utenti Non Registrati

### Richiedere una Valutazione Automatica

Gli utenti non registrati possono richiedere una valutazione creando automaticamente un account.

#### Passaggio 1: Scelta Modalità

1. Nella homepage, individuare il form di valutazione a destra
2. Selezionare "No" alla domanda "Sei già registrato?"
3. Il sistema procederà con la registrazione guidata

#### Passaggio 2: Inserimento Dati Personali

Compilare tutti i campi obbligatori:

- Nome
- Cognome
- Email (verrà utilizzata per il login)
- Telefono
- Password (minimo 6 caratteri)
- Proprietà dell'immobile (Sì/No)

#### Passaggio 3: Dati Immobile

Inserire le informazioni dell'immobile:

- Indirizzo completo
- Città
- Provincia (sigla a 2 lettere, es. TO)
- CAP (5 cifre)
- Metri quadri
- Numero camere
- Numero bagni

#### Passaggio 4: Tipologia Immobile

Selezionare la tipologia tra:

- Appartamento
- Villa
- Ufficio

#### Passaggio 5: Stato dell'Immobile

Indicare lo stato di conservazione:

- Nuova costruzione
- Ristrutturata
- Abitabile
- Da ristrutturare

#### Passaggio 6: Pertinenze

Specificare eventuali pertinenze:

- Numero balconi (campo numerico)
- Terrazzo (checkbox)
- Giardino (checkbox)
- Garage (checkbox)
- Note aggiuntive (campo opzionale)

#### Passaggio 7: Invio e Risultato

1. Cliccare su "Calcola Valutazione"
2. Il sistema elabora i dati e mostra:
   - Valore stimato dell'immobile
   - Valore base zona
   - Messaggio di conferma
3. L'account viene creato automaticamente
4. La valutazione viene salvata nel sistema

### Consultare gli Immobili in Vendita

1. Dalla homepage, scorrere fino alla sezione "Successi Recenti"
2. Visualizzare gli immobili recentemente valutati e venduti
3. Ogni card mostra: località, metratura, numero locali, bagni e prezzo

---

## Funzionalità per Utenti Registrati

### Accedere alla Dashboard Personale

1. Effettuare il login con le proprie credenziali
2. Il sistema reindirizza automaticamente alla dashboard utente
3. La dashboard mostra:
   - Nome utente e email
   - Statistiche valutazioni totali
   - Elenco valutazioni recenti
   - Immobili censiti

### Richiedere una Nuova Valutazione (Utente Loggato)

1. Dalla dashboard, cliccare su "Richiedi Nuova Valutazione" in alto a destra
2. Il sistema salta automaticamente i dati personali (già salvati)
3. Compilare solo i dati dell'immobile (passi 2-6 del processo standard)
4. La valutazione viene associata automaticamente al proprio account

### Visualizzare le Proprie Valutazioni

Nella sezione "Ultime Valutazioni" della dashboard:

- Stato della valutazione (In Attesa, Completata)
- Data richiesta
- Valore stimato
- Immobile associato
- Filtri e ordinamento disponibili

### Consultare i Propri Immobili

Nella sezione "Immobili Censiti":

- Indirizzo completo
- Caratteristiche principali (mq, camere, bagni)
- Tipologia e stato
- Card visualizzate in griglia

### Navigare nel Sito

Dal menu laterale è possibile:

- Tornare alla Dashboard (visualizzazione principale)
- Accedere a "Le mie Valutazioni"
- Tornare al sito pubblico (pulsante in basso)
- Effettuare il logout

---

## Funzionalità per Amministratori

### Accedere alla Dashboard Admin

1. Effettuare il login con credenziali amministratore
2. Il sistema reindirizza alla dashboard admin
3. Visualizzare la panoramica con:
   - Numero totale utenti
   - Numero venditori
   - Numero immobili
   - Numero valutazioni

### Gestire gli Utenti

1. Dalla panoramica, cliccare sulla card "Utenti Totali"
2. Visualizzare l'elenco completo degli utenti registrati
3. Ogni card utente mostra:
   - Nome e cognome
   - Email
   - Ruolo (Utente/Admin)
   - Numero di valutazioni associate
4. Cliccare su "Torna alla Panoramica" per tornare indietro

### Gestire i Venditori

1. Cliccare sulla card "Venditori"
2. Visualizzare tutti i proprietari verificati
3. Informazioni mostrate:
   - Dati anagrafici completi
   - Codice fiscale
   - Indirizzo
   - Contatti
   - Numero immobili in gestione

### Gestire gli Immobili

1. Cliccare sulla card "Immobili"
2. Visualizzare tutti gli immobili censiti nel sistema
3. Dettagli per ogni immobile:
   - Indirizzo completo
   - Caratteristiche (mq, camere, bagni)
   - Tipologia e stato
   - Prezzo richiesto
   - Proprietario associato
   - Stato della valutazione

### Gestire le Valutazioni

1. Cliccare sulla card "Valutazioni"
2. Visualizzare tutte le richieste di valutazione
3. Informazioni disponibili:
   - Stato (In Attesa, Completata, Rifiutata)
   - Data richiesta
   - Utente richiedente
   - Immobile associato
   - Valore stimato
   - Note aggiuntive

### Gestire i Contratti

#### Accedere all'Area Contratti

1. Dal menu laterale, cliccare su "Contratti"
2. Visualizzare l'area contrattuale principale
3. Due opzioni disponibili:
   - Lista Contratti (visualizzare contratti esistenti)
   - Nuovo Contratto (creare un nuovo contratto)

#### Visualizzare i Contratti Esistenti

1. Cliccare su "Lista Contratti"
2. Visualizzare tutti i contratti archiviati
3. Ogni contratto mostra:
   - Numero contratto
   - Data inizio e fine
   - Venditore
   - Immobile
   - Prezzo minimo accettato
   - Percentuale commissione
   - Stato (Attivo, Scaduto, Risolto)

#### Creare un Nuovo Contratto

1. Cliccare su "Nuovo Contratto"
2. Compilare i dati essenziali nel pannello di sinistra:

**Dati Obbligatori:**

- Immobile (selezionare da menu a tendina)
- Venditore (selezionare da menu a tendina)
- Data inizio contratto
- Data fine contratto
- Prezzo minimo accettato (in euro)
- Percentuale commissione (default 3%)

3. Cliccare su "Aggiorna Anteprima" per visualizzare il contratto
4. Il pannello di destra mostra il contratto in formato A4 con:
   - Intestazione ufficiale
   - Dati del venditore
   - Dati dell'agenzia
   - Oggetto (dettagli immobile)
   - Prezzo e condizioni
   - Durata del contratto
   - Provvigione
   - Spazi per le firme

#### Salvare un Contratto

1. Dopo aver verificato l'anteprima, cliccare su "Salva Definitivo"
2. Il contratto viene archiviato nel sistema
3. Conferma di salvataggio

#### Inviare un Contratto via Email

1. Dopo aver compilato tutti i campi, cliccare su "Salva e Invia Email"
2. Il sistema:
   - Salva il contratto nel database
   - Genera il documento PDF
   - Invia email al venditore con contratto allegato
3. Messaggio di conferma invio

### Menu di Navigazione Admin

Dal menu laterale:

- Dashboard: panoramica generale
- Utenti e Venditori: gestione anagrafiche
- Immobili: catalogo completo
- Valutazioni: richieste e stime
- Contratti: area contrattuale
- Torna al sito: ritorno alla homepage pubblica
- Logout: disconnessione

---

## Risoluzione Problemi Comuni

### Non Riesco ad Accedere

**Problema:** Credenziali non riconosciute

**Soluzione:**

- Verificare che email e password siano corrette
- Controllare che il CAPS LOCK non sia attivo
- Provare a resettare la password (se implementato)
- Verificare di essere registrati nel sistema

### La Valutazione Non Viene Salvata

**Problema:** Errore durante il salvataggio

**Soluzione:**

- Verificare di aver compilato tutti i campi obbligatori (marcati con *)
- Controllare che il CAP sia di 5 cifre
- Verificare che la Provincia sia di 2 lettere (es. TO, CN, AL)
- Assicurarsi che i valori numerici siano positivi
- Controllare la connessione al server

### Email Già Registrata

**Problema:** L'email inserita è già presente nel sistema

**Soluzione:**

- Utilizzare il pulsante "Sì" allo step iniziale per effettuare il login
- Andare direttamente alla pagina di login
- Utilizzare un indirizzo email diverso

### Non Vedo le Mie Valutazioni

**Problema:** Dashboard vuota dopo il login

**Soluzione:**

- Verificare di aver effettuato almeno una richiesta di valutazione
- Ricaricare la pagina (F5)
- Verificare la connessione al server
- Controllare che il token di autenticazione sia valido

### Il Contratto Non si Genera

**Problema:** Impossibile creare o visualizzare il contratto

**Soluzione:**

- Verificare di aver selezionato sia Immobile che Venditore
- Assicurarsi che le date siano valide (fine > inizio)
- Controllare che il prezzo minimo sia un valore positivo
- Cliccare su "Aggiorna Anteprima" prima di salvare

### Il Sistema è Lento

**Problema:** Caricamenti lenti o timeout

**Soluzione:**

- Verificare la connessione internet
- Controllare che il server Spring Boot sia avviato
- Consultare i log del server per eventuali errori
- Verificare l'utilizzo di risorse (CPU, RAM)

### Dati Persi Dopo Riavvio

**Problema:** I dati inseriti scompaiono dopo aver riavviato il server

**Soluzione:**

- Questo è il comportamento normale: il database H2 è in-memory
- I dati vengono ripristinati dal file `data-test.sql` ad ogni avvio
- Per persistenza permanente, configurare un database esterno

---

## Note Tecniche

### Requisiti Browser

Il sistema è compatibile con:

- Google Chrome (versione 90+)
- Mozilla Firefox (versione 88+)
- Microsoft Edge (versione 90+)
- Safari (versione 14+)

### Requisiti di Sistema

Per eseguire il server:

- Java 17 o superiore
- Maven 3.6 o superiore
- 2GB RAM disponibili
- Porta 8080 libera

### Sicurezza

- Le password vengono crittografate prima del salvataggio
- L'autenticazione utilizza token JWT
- I token scadono dopo un periodo prestabilito
- Effettuare sempre il logout su computer condivisi

### Supporto

Per assistenza tecnica o segnalazione bug:

- Consultare la documentazione tecnica in `DOCUMENTAZIONE_TECNICA.md`
- Verificare i log del server per messaggi di errore
- Contattare il team di sviluppo tramite repository GitHub
