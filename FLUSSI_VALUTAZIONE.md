# 🔄 Flussi di Valutazione Immobiliare

Questo documento descrive i due flussi disponibili per richiedere una valutazione immobiliare nel sistema Immobiliaris.

---

## 📊 Flusso 1: Utente NON Registrato

### 🎯 Scenario
L'utente non ha ancora un account e vuole registrarsi + richiedere una valutazione in un unico flusso.

### 📍 Percorso Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PAGINA INIZIALE                                          │
│    URL: http://localhost:8080/index.html                    │
│                                                              │
│    ┌────────────────────────────────────────┐              │
│    │  Step 0: Sei già registrato?           │              │
│    │  ┌──────────┐      ┌──────────┐       │              │
│    │  │   SÌ     │      │   NO ✓   │       │              │
│    │  └──────────┘      └──────────┘       │              │
│    └────────────────────────────────────────┘              │
│                              │                              │
│                              ▼                              │
│    L'utente clicca "NO"                                     │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. COMPILAZIONE FORM COMPLETO                               │
│                                                              │
│    Step 1 - Dati Personali:                                 │
│    ┌────────────────────────────────────────┐              │
│    │ • Nome: Mario                           │              │
│    │ • Cognome: Rossi                        │              │
│    │ • Email: mario.rossi@email.com          │              │
│    │ • Telefono: 3331234567                  │              │
│    │ • Password: ********                    │              │
│    │ • Sei proprietario? ○ Sì  ○ No         │              │
│    └────────────────────────────────────────┘              │
│                              │                              │
│                              ▼                              │
│    Step 2 - Dati Immobile (Posizione):                      │
│    ┌────────────────────────────────────────┐              │
│    │ • Indirizzo: Via Roma 15                │              │
│    │ • Città: Torino                         │              │
│    │ • Provincia: TO                         │              │
│    │ • CAP: 10121                            │              │
│    │ • Metri quadri: 85                      │              │
│    │ • Camere: 3                             │              │
│    │ • Bagni: 2                              │              │
│    └────────────────────────────────────────┘              │
│                              │                              │
│                              ▼                              │
│    Step 3 - Tipo Immobile:                                  │
│    ┌────────────────────────────────────────┐              │
│    │  [APPARTAMENTO ✓]  [VILLA]  [UFFICIO]  │              │
│    └────────────────────────────────────────┘              │
│                              │                              │
│                              ▼                              │
│    Step 4 - Stato Immobile:                                 │
│    ┌────────────────────────────────────────┐              │
│    │ [NUOVA] [RISTRUTTURATA ✓]              │              │
│    │ [ABITABILE] [DA_RISTRUTTURARE]          │              │
│    └────────────────────────────────────────┘              │
│                              │                              │
│                              ▼                              │
│    Step 5 - Pertinenze:                                     │
│    ┌────────────────────────────────────────┐              │
│    │ • Balconi: 1                            │              │
│    │ • Terrazzo: ☑                           │              │
│    │ • Giardino: ☐                           │              │
│    │ • Garage: ☑                             │              │
│    │ • Descrizione: Appartamento luminoso... │              │
│    └────────────────────────────────────────┘              │
│                              │                              │
│                              ▼                              │
│              [Calcola Valutazione]                          │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. ELABORAZIONE BACKEND                                     │
│    Endpoint: POST /api/valutazioni/automatica               │
│                                                              │
│    Request Body (RichiestaValutazioneDTO):                  │
│    {                                                         │
│      "nome": "Mario",                                        │
│      "cognome": "Rossi",                                     │
│      "email": "mario.rossi@email.com",                       │
│      "telefono": "3331234567",                               │
│      "password": "password123",                              │
│      "isProprietario": true,                                 │
│      "indirizzo": "Via Roma 15",                             │
│      "citta": "Torino",                                      │
│      "provincia": "TO",                                      │
│      "cap": "10121",                                         │
│      "metriQuadri": 85.0,                                    │
│      "camere": 3,                                            │
│      "bagni": 2,                                             │
│      "balconi": 1,                                           │
│      "terrazzo": true,                                       │
│      "giardino": false,                                      │
│      "garage": true,                                         │
│      "tipo": "APPARTAMENTO",                                 │
│      "stato": "RISTRUTTURATA",                               │
│      "descrizione": "Appartamento luminoso..."               │
│    }                                                         │
│                                                              │
│    Operazioni del Backend:                                  │
│    1. ✓ Crea nuovo Utente (password hashata)                │
│    2. ✓ Crea Venditore (se isProprietario = true)           │
│    3. ✓ Crea Immobile (associato al venditore)              │
│    4. ✓ Calcola valutazione automatica                      │
│       • Valore base zona: 85 m² × 4000€/m² = 340.000€       │
│       • Aggiunte: +1 bagno (5k) +1 balcone (3k)             │
│                  +terrazzo (15k) +garage (12k) = 35.000€    │
│       • Totale: 375.000€ × 1.0 (ristrutturata) = 375.000€   │
│    5. ✓ Crea record Valutazione (COMPLETATA)                │
│    6. ✓ Invia risposta al frontend                          │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. RISULTATO                                                │
│                                                              │
│    ┌────────────────────────────────────────┐              │
│    │  ✅ Valutazione Completata!             │              │
│    │                                         │              │
│    │  Valore Stimato: € 375.000              │              │
│    │  Valore Base Zona: € 340.000            │              │
│    │                                         │              │
│    │  Riceverai una valutazione più          │              │
│    │  dettagliata entro 72 ore.              │              │
│    │                                         │              │
│    │  [Nuova Valutazione]                    │              │
│    └────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

### 📝 Dati Creati nel Database

```sql
-- Tabella: utente
INSERT INTO utente (nome, cognome, email, password, telefono, id_ruolo)
VALUES ('Mario', 'Rossi', 'mario.rossi@email.com', '$2a$10$...', '3331234567', 1);
-- ID generato: 6

-- Tabella: venditore (solo se isProprietario = true)
INSERT INTO venditore (id_utente, nome, cognome, email, telefono, citta, provincia)
VALUES (6, 'Mario', 'Rossi', 'mario.rossi@email.com', '3331234567', 'Torino', 'TO');
-- ID generato: 7

-- Tabella: immobile
INSERT INTO immobile (id_venditore, tipo, indirizzo, citta, provincia, cap, 
                      metri_quadri, camere, bagni, prezzo, stato)
VALUES (7, 'APPARTAMENTO', 'Via Roma 15', 'Torino', 'TO', '10121', 
        85, 3, 2, 0, 'RISTRUTTURATA');
-- ID generato: 7

-- Tabella: valutazione
INSERT INTO valutazione (id_immobile, id_utente, stato, valore_stimato, 
                         valore_calcolato_zona, data_richiesta, data_completamento)
VALUES (7, 6, 'COMPLETATA', 375000, 340000, NOW(), NOW());
-- ID generato: 7
```

---

## 📊 Flusso 2: Utente GIÀ Registrato

### 🎯 Scenario
L'utente ha già un account e vuole richiedere una valutazione per un nuovo immobile.

### 📍 Percorso Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PAGINA INIZIALE                                          │
│    URL: http://localhost:8080/index.html                    │
│                                                              │
│    ┌────────────────────────────────────────┐              │
│    │  Step 0: Sei già registrato?           │              │
│    │  ┌──────────┐      ┌──────────┐       │              │
│    │  │  SÌ ✓    │      │   NO     │       │              │
│    │  └──────────┘      └──────────┘       │              │
│    └────────────────────────────────────────┘              │
│                              │                              │
│                              ▼                              │
│    L'utente clicca "SÌ"                                     │
│    ➜ REDIRECT AUTOMATICO a login.html                      │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. PAGINA DI LOGIN                                          │
│    URL: http://localhost:8080/login.html                    │
│                                                              │
│    ┌────────────────────────────────────────┐              │
│    │  Email: luca.rossi@example.com         │              │
│    │  Password: ******                      │              │
│    │  [Accedi]                              │              │
│    └────────────────────────────────────────┘              │
│                              │                              │
│                              ▼                              │
│    Backend: POST /api/auth/login                            │
│    ✓ Verifica credenziali                                   │
│    ✓ Genera token JWT                                       │
│    ✓ Salva token in localStorage                            │
│    ➜ REDIRECT AUTOMATICO a user.html                       │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. DASHBOARD UTENTE                                         │
│    URL: http://localhost:8080/user.html                     │
│                                                              │
│    ┌────────────────────────────────────────┐              │
│    │  Benvenuto, Luca Rossi                 │              │
│    │                                         │              │
│    │  [➕ Richiedi Nuova Valutazione]       │ ← CLICK QUI  │
│    │                                         │              │
│    │  Le mie Valutazioni:                   │              │
│    │  • Valutazione #1 - Via Genova 12      │              │
│    │  • Valutazione #2 - Corso Italia 5     │              │
│    └────────────────────────────────────────┘              │
│                              │                              │
│                              ▼                              │
│    ➜ REDIRECT AUTOMATICO a index.html?mode=logged          │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. FORM SEMPLIFICATO (SOLO IMMOBILE)                        │
│    URL: http://localhost:8080/index.html?mode=logged        │
│                                                              │
│    JavaScript rileva: mode=logged                           │
│    ✓ Verifica token JWT in localStorage                     │
│    ✓ Salta Step 0 (scelta registrazione)                    │
│    ✓ Salta Step 1 (dati personali)                          │
│    ✓ Inizia da Step 2                                       │
│                                                              │
│    Step 2 - Dati Immobile (Posizione):                      │
│    ┌────────────────────────────────────────┐              │
│    │ • Indirizzo: Corso Vittorio 88         │              │
│    │ • Città: Torino                         │              │
│    │ • Provincia: TO                         │              │
│    │ • CAP: 10138                            │              │
│    │ • Metri quadri: 120                     │              │
│    │ • Camere: 4                             │              │
│    │ • Bagni: 2                              │              │
│    └────────────────────────────────────────┘              │
│                              │                              │
│                              ▼                              │
│    Step 3 - Tipo Immobile:                                  │
│    ┌────────────────────────────────────────┐              │
│    │  [APPARTAMENTO]  [VILLA ✓]  [UFFICIO]  │              │
│    └────────────────────────────────────────┘              │
│                              │                              │
│                              ▼                              │
│    Step 4 - Stato Immobile:                                 │
│    ┌────────────────────────────────────────┐              │
│    │ [NUOVA ✓] [RISTRUTTURATA]              │              │
│    │ [ABITABILE] [DA_RISTRUTTURARE]          │              │
│    └────────────────────────────────────────┘              │
│                              │                              │
│                              ▼                              │
│    Step 5 - Pertinenze:                                     │
│    ┌────────────────────────────────────────┐              │
│    │ • Balconi: 2                            │              │
│    │ • Terrazzo: ☐                           │              │
│    │ • Giardino: ☑                           │              │
│    │ • Garage: ☑                             │              │
│    │ • Descrizione: Villa moderna...         │              │
│    └────────────────────────────────────────┘              │
│                              │                              │
│                              ▼                              │
│              [Calcola Valutazione]                          │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. ELABORAZIONE BACKEND                                     │
│    Endpoint: POST /api/valutazioni/logged                   │
│    Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...    │
│                                                              │
│    Request Body (RichiestaValutazioneImmobileDTO):          │
│    {                                                         │
│      "indirizzo": "Corso Vittorio 88",                       │
│      "citta": "Torino",                                      │
│      "provincia": "TO",                                      │
│      "cap": "10138",                                         │
│      "metriQuadri": 120.0,                                   │
│      "camere": 4,                                            │
│      "bagni": 2,                                             │
│      "balconi": 2,                                           │
│      "terrazzo": false,                                      │
│      "giardino": true,                                       │
│      "garage": true,                                         │
│      "tipo": "VILLA",                                        │
│      "stato": "NUOVA",                                       │
│      "descrizione": "Villa moderna..."                       │
│    }                                                         │
│                                                              │
│    Operazioni del Backend:                                  │
│    1. ✓ Estrae email dal token JWT                          │
│       → authentication.getName() = "luca.rossi@example.com" │
│    2. ✓ Recupera Utente dal database (ID: 1)                │
│    3. ✓ Recupera/Crea Venditore per quell'utente (ID: 1)    │
│    4. ✓ Crea Immobile (associato al venditore)              │
│    5. ✓ Calcola valutazione automatica                      │
│       • Valore base zona: 120 m² × 2400€/m² = 288.000€      │
│       • Aggiunte: +1 bagno (5k) +2 balconi (6k)             │
│                  +giardino (20k) +garage (12k) = 43.000€    │
│       • Totale: 331.000€ × 1.15 (nuova) = 380.650€          │
│    6. ✓ Crea record Valutazione (COMPLETATA)                │
│    7. ✓ Invia risposta al frontend                          │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. RISULTATO                                                │
│                                                              │
│    ┌────────────────────────────────────────┐              │
│    │  ✅ Nuova Valutazione Completata!       │              │
│    │                                         │              │
│    │  Valore Stimato: € 380.650              │              │
│    │  Valore Base Zona: € 288.000            │              │
│    │                                         │              │
│    │  Riceverai una valutazione più          │              │
│    │  dettagliata entro 72 ore.              │              │
│    │                                         │              │
│    │  [Torna alla Dashboard]                 │              │
│    └────────────────────────────────────────┘              │
│                              │                              │
│                              ▼                              │
│    ➜ REDIRECT a user.html (dashboard)                      │
└─────────────────────────────────────────────────────────────┘
```

### 📝 Dati Creati nel Database

```sql
-- Utente già esistente (creato durante il login iniziale)
-- ID utente: 1 (Luca Rossi)

-- Venditore già esistente (recuperato o creato al primo utilizzo)
-- ID venditore: 1

-- Tabella: immobile (NUOVO)
INSERT INTO immobile (id_venditore, tipo, indirizzo, citta, provincia, cap, 
                      metri_quadri, camere, bagni, prezzo, stato)
VALUES (1, 'VILLA', 'Corso Vittorio 88', 'Torino', 'TO', '10138', 
        120, 4, 2, 0, 'NUOVA');
-- ID generato: 8

-- Tabella: valutazione (NUOVA)
INSERT INTO valutazione (id_immobile, id_utente, stato, valore_stimato, 
                         valore_calcolato_zona, data_richiesta, data_completamento)
VALUES (8, 1, 'COMPLETATA', 380650, 288000, NOW(), NOW());
-- ID generato: 8
```

---

## 📊 Confronto tra i Due Flussi

| Caratteristica | Flusso 1 (Nuovo Utente) | Flusso 2 (Utente Loggato) |
|----------------|------------------------|---------------------------|
| **Punto di partenza** | `index.html` | `index.html` → Login → Dashboard |
| **Autenticazione** | ❌ Nessuna | ✅ Token JWT richiesto |
| **Step da compilare** | 0 → 1 → 2 → 3 → 4 → 5 | 2 → 3 → 4 → 5 |
| **Dati richiesti** | Utente + Immobile | Solo Immobile |
| **Endpoint backend** | `/api/valutazioni/automatica` | `/api/valutazioni/logged` |
| **DTO utilizzato** | `RichiestaValutazioneDTO` | `RichiestaValutazioneImmobileDTO` |
| **Crea nuovo utente** | ✅ Sì | ❌ No (già esistente) |
| **Crea nuovo venditore** | ✅ Se proprietario | ⚠️ Solo se non esiste |
| **Bottone finale** | "Nuova Valutazione" | "Torna alla Dashboard" |
| **Tempo compilazione** | ~3-5 minuti | ~2 minuti |

---

## 🧪 Come Testare

### Test Flusso 1 (Nuovo Utente)

1. Avvia backend: `mvn spring-boot:run`
2. Vai su: `http://localhost:8080/index.html`
3. Clicca "NO" su "Sei già registrato?"
4. Compila tutti i 5 step
5. Invia valutazione
6. Verifica nel database che siano stati creati: utente, venditore, immobile, valutazione

### Test Flusso 2 (Utente Loggato)

**Credenziali di test:**
- Email: `luca.rossi@example.com`
- Password: `pwd123`

**Passi:**
1. Avvia backend: `mvn spring-boot:run`
2. Vai su: `http://localhost:8080/index.html`
3. Clicca "SÌ" su "Sei già registrato?"
4. Fai login con le credenziali sopra
5. Nella dashboard, clicca "Richiedi Nuova Valutazione"
6. Compila solo i dati dell'immobile (4 step)
7. Invia valutazione
8. Verifica nel database che siano stati creati solo: immobile (nuovo) e valutazione (nuova)

---

## 🔐 Note di Sicurezza

### Token JWT
- **Generato**: Al login in `/api/auth/login`
- **Salvato**: In `localStorage` con chiave `jwtToken`
- **Validità**: Configurabile (default: diverse ore)
- **Formato**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Endpoint Protetti
- ✅ `/api/valutazioni/logged` - Richiede autenticazione
- ❌ `/api/valutazioni/automatica` - Pubblico (per nuovi utenti)

### Verifica Token
Il backend verifica automaticamente il token JWT nell'header `Authorization` prima di processare la richiesta. Se il token non è valido o mancante, restituisce `401 Unauthorized`.

---

## 📈 Vantaggi del Sistema

### Per l'Utente Nuovo
- ✅ Registrazione + valutazione in un unico flusso
- ✅ Non serve accedere separatamente
- ✅ Esperienza guidata passo-passo

### Per l'Utente Esistente
- ✅ Non re-inserisce dati personali
- ✅ Processo più veloce (4 step invece di 6)
- ✅ Tutte le valutazioni raccolte nella dashboard
- ✅ Storico completo immobili e valutazioni

### Per il Sistema
- ✅ Un utente può avere N immobili
- ✅ Un immobile può avere N valutazioni nel tempo
- ✅ Tracciabilità completa
- ✅ Separazione chiara tra utenti e venditori

---

## 🐛 Risoluzione Problemi

### Problema: Token non valido
**Sintomo**: Errore 401 quando si invia la valutazione  
**Soluzione**: Rifare il login per ottenere un nuovo token

### Problema: Redirect al login anche se loggato
**Sintomo**: Viene reindirizzato a login.html  
**Soluzione**: Il token è scaduto o non esiste in localStorage

### Problema: Database ricreato, token non funziona
**Sintomo**: Dopo `mvn spring-boot:run` il token salvato non funziona  
**Soluzione**: Rifare il login (il database è stato ricreato con nuovi utenti)

### Problema: Form inizia da Step 1 invece di Step 2
**Sintomo**: Utente loggato ma vede dati personali  
**Soluzione**: Verificare che l'URL contenga `?mode=logged`

---

**Data creazione**: 1 Dicembre 2025  
**Versione**: 1.0  
**Branch**: Ferrero-IMPL-validazione
