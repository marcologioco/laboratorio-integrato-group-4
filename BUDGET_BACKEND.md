# Budget Backend - Immobiliaris

**Progetto:** Immobiliaris - Portale Immobiliare  
**Data Preventivo:** Novembre 2025  
**Versione:** 1.0  
**Team:** InnovaRe - Group 4

---

## Indice

1. [Riepilogo Esecutivo](#riepilogo-esecutivo)
2. [Analisi Tecnica del Progetto](#analisi-tecnica-del-progetto)
3. [Calcolo Costi per Categoria](#calcolo-costi-per-categoria)
4. [Breakdown Dettagliato](#breakdown-dettagliato)
5. [Confronto con Standard di Mercato](#confronto-con-standard-di-mercato)
6. [Giustificazione del Prezzo](#giustificazione-del-prezzo)
7. [Opzioni di Pricing](#opzioni-di-pricing)

---

## Riepilogo Esecutivo

### Proposta Raccomandata

| Voce | Importo |
|------|---------|
| **Sviluppo Backend** | €12.800 - €18.500 |
| **Testing & QA** | €2.400 - €3.200 |
| **Documentazione** | €1.600 - €2.100 |
| **Deployment & Setup** | €800 - €1.200 |
| | |
| **TOTALE PROGETTO** | **€17.600 - €25.000** |
| **Prezzo Medio Consigliato** | **€21.000** |

### Range di Pricing per Cliente

- **Prezzo Minimo (Entry):** €17.600
- **Prezzo Standard:** €21.000  
- **Prezzo Premium:** €25.000

---

## Analisi Tecnica del Progetto

### Metriche del Codice

#### Struttura Backend

| Componente | Quantità | Complessità |
|------------|----------|-------------|
| **Controller** | 8 | Alta |
| **Endpoints REST** | 64 | Alta |
| **Entity JPA** | 7 | Media |
| **Service (Interface)** | 7 | Media |
| **Service (Implementation)** | 7 | Alta |
| **Repository** | 7 | Bassa |
| **DTO** | 4 | Bassa |
| **Enum** | 4 | Bassa |
| **Config Classes** | 4 | Alta |
| **Utility Classes** | 1 | Media |

**Totale Classi:** 53 classi Java

#### Breakdown Endpoints per Controller

| Controller | GET | POST | PUT | DELETE | Totale |
|------------|-----|------|-----|--------|--------|
| AuthController | 2 | 1 | 0 | 0 | 3 |
| UtenteController | 4 | 1 | 1 | 1 | 7 |
| VenditoreController | 10 | 1 | 1 | 1 | 13 |
| ImmobileController | 8 | 1 | 1 | 1 | 11 |
| ValutazioneController | 5 | 1 | 1 | 1 | 8 |
| ValutazioneAutomaticaController | 0 | 1 | 0 | 0 | 1 |
| ContrattiController | 11 | 1 | 1 | 1 | 14 |
| ZoneController | 4 | 1 | 1 | 1 | 7 |
| **TOTALE** | **44** | **8** | **6** | **6** | **64** |

### Funzionalità Implementate

#### Core Features

1. **Sistema di Autenticazione JWT**
   - Login con email/password
   - Generazione e validazione token
   - Protezione endpoints con Spring Security
   - Gestione ruoli (Admin/Utente)
   - Hashing password BCrypt

2. **Gestione Utenti**
   - CRUD completo utenti
   - Ricerca per email, ruolo
   - Gestione profili
   - Sistema autorizzazioni

3. **Gestione Venditori**
   - CRUD completo venditori
   - Collegamento con account utente
   - Ricerca avanzata (nome, email, telefono, CF)
   - Gestione dati fiscali

4. **Gestione Immobili**
   - CRUD completo immobili
   - Filtri avanzati (tipo, stato, città, prezzo, mq)
   - Collegamento con zona geografica
   - Timestamping automatico

5. **Sistema Valutazione Automatica**
   - Algoritmo calcolo valore basato su zona
   - 36 zone geografiche con prezzi medi
   - Valutazione istantanea senza registrazione
   - Fattori correttivi (stato, camere, bagni)

6. **Gestione Valutazioni Manuali**
   - CRUD valutazioni
   - Stati workflow (in corso, completata, annullata)
   - Assegnazione a esperti
   - Tracking temporale (deadline, date)

7. **Gestione Contratti**
   - CRUD contratti vendita
   - Gestione esclusività
   - Tracking date (inizio/fine)
   - Prezzo minimo accettabile
   - Stati contratto

8. **Database & Persistence**
   - 7 entità JPA
   - Relazioni complesse (1:N, N:1, 0:1)
   - Data loader con dati di test
   - Schema SQL ottimizzato

9. **Documentazione API**
   - Swagger UI integrato
   - OpenAPI 3.0 compliant
   - Descrizioni dettagliate endpoint
   - Esempi request/response

10. **Security & Validation**
    - Spring Security configuration
    - JWT authentication filter
    - Input validation
    - CORS configuration
    - Role-based access control

### Tecnologie & Framework

| Categoria | Tecnologia | Versione |
|-----------|------------|----------|
| Runtime | Java | 17 |
| Framework | Spring Boot | 3.5.6 |
| Security | Spring Security | 3.5.6 |
| Persistence | Spring Data JPA | 3.5.6 |
| Database | H2 (sviluppo) | latest |
| JWT | JJWT | 0.12.3 |
| Documentation | SpringDoc OpenAPI | 2.2.0 |
| Build Tool | Maven | 3.x |
| Template Engine | Thymeleaf | 3.5.6 |

---

## Calcolo Costi per Categoria

### Metodologia di Calcolo

**Tariffe Orarie di Riferimento:**

- **Senior Backend Developer:** €60-80/ora
- **Mid-Level Backend Developer:** €45-60/ora
- **Junior Backend Developer:** €30-40/ora
- **Tech Lead/Architect:** €80-100/ora

**Complessità del Progetto:** Media-Alta

### 1. Analisi e Design (15-20 ore)

| Attività | Ore | Tariffa | Subtotale |
|----------|-----|---------|-----------|
| Analisi requisiti | 4 | €70/h | €280 |
| Design architettura | 6 | €80/h | €480 |
| Design database (7 tabelle + relazioni) | 5 | €70/h | €350 |
| Design API (64 endpoints) | 5 | €70/h | €350 |
| **TOTALE** | **20h** | | **€1.460** |

### 2. Sviluppo Backend (120-150 ore)

| Componente | Ore | Tariffa | Subtotale |
|------------|-----|---------|-----------|
| **Setup Progetto & Config** | | | |
| Setup Spring Boot + Maven | 2 | €60/h | €120 |
| Configurazione Security | 4 | €70/h | €280 |
| Configurazione JWT | 4 | €70/h | €280 |
| Configurazione Swagger | 2 | €60/h | €120 |
| **Entities & Database (7 entità)** | | | |
| Model classes (7 × 2h) | 14 | €60/h | €840 |
| Enum classes (4 × 0.5h) | 2 | €50/h | €100 |
| Repository interfaces (7 × 0.5h) | 4 | €50/h | €200 |
| Data Loader + Test Data | 4 | €60/h | €240 |
| **Services (14 classes)** | | | |
| Service interfaces (7 × 1h) | 7 | €60/h | €420 |
| Service implementations (7 × 4h) | 28 | €65/h | €1.820 |
| Business logic complessa | 8 | €70/h | €560 |
| **Controllers (8 controllers, 64 endpoints)** | | | |
| AuthController (3 endpoints) | 4 | €65/h | €260 |
| UtenteController (7 endpoints) | 5 | €65/h | €325 |
| VenditoreController (13 endpoints) | 8 | €65/h | €520 |
| ImmobileController (11 endpoints) | 7 | €65/h | €455 |
| ValutazioneController (8 endpoints) | 6 | €65/h | €390 |
| ValutazioneAutomaticaController | 3 | €70/h | €210 |
| ContrattiController (14 endpoints) | 8 | €65/h | €520 |
| ZoneController (7 endpoints) | 4 | €65/h | €260 |
| **DTO & Utilities** | | | |
| DTO classes (4 × 1h) | 4 | €55/h | €220 |
| JwtUtil class | 3 | €70/h | €210 |
| **TOTALE** | **135h** | | **€8.330** |

### 3. Testing & Quality Assurance (30-40 ore)

| Attività | Ore | Tariffa | Subtotale |
|----------|-----|---------|-----------|
| Unit testing (service layer) | 12 | €55/h | €660 |
| Integration testing (controllers) | 10 | €60/h | €600 |
| API testing (Swagger/Postman) | 6 | €55/h | €330 |
| Security testing | 4 | €70/h | €280 |
| Bug fixing & refinement | 8 | €60/h | €480 |
| **TOTALE** | **40h** | | **€2.350** |

### 4. Documentazione (20-25 ore)

| Attività | Ore | Tariffa | Subtotale |
|----------|-----|---------|-----------|
| Documentazione tecnica completa | 10 | €60/h | €600 |
| README e guide | 4 | €50/h | €200 |
| Swagger annotations & descriptions | 6 | €55/h | €330 |
| Diagrammi ER e architettura | 4 | €60/h | €240 |
| API reference manual | 3 | €55/h | €165 |
| **TOTALE** | **27h** | | **€1.535** |

### 5. Deployment & DevOps (8-12 ore)

| Attività | Ore | Tariffa | Subtotale |
|----------|-----|---------|-----------|
| Setup ambiente sviluppo | 2 | €60/h | €120 |
| Configurazione database H2 | 1 | €50/h | €50 |
| Build & package (Maven) | 2 | €55/h | €110 |
| Scripts di avvio | 1 | €50/h | €50 |
| Testing deployment | 2 | €55/h | €110 |
| Troubleshooting | 2 | €60/h | €120 |
| **TOTALE** | **10h** | | **€560** |

### 6. Project Management & Comunicazione (15-20 ore)

| Attività | Ore | Tariffa | Subtotale |
|----------|-----|---------|-----------|
| Meeting e allineamenti | 8 | €65/h | €520 |
| Code review | 6 | €70/h | €420 |
| Gestione versioning (Git) | 3 | €55/h | €165 |
| Reporting e aggiornamenti | 3 | €60/h | €180 |
| **TOTALE** | **20h** | | **€1.285** |

---

## Breakdown Dettagliato

### Totale Ore di Lavoro

| Categoria | Ore | Costo |
|-----------|-----|-------|
| Analisi e Design | 20 | €1.460 |
| Sviluppo Backend | 135 | €8.330 |
| Testing & QA | 40 | €2.350 |
| Documentazione | 27 | €1.535 |
| Deployment | 10 | €560 |
| Project Management | 20 | €1.285 |
| **TOTALE** | **252 ore** | **€15.520** |

### Margini e Contingency

| Voce | % | Importo |
|------|---|---------|
| Subtotale Tecnico | - | €15.520 |
| Contingency (imprevisti) | 10% | €1.550 |
| Margine Business | 15% | €2.560 |
| **TOTALE CON MARGINI** | - | **€19.630** |

### Arrotondamento Commerciale

- **Base Calculation:** €19.630
- **Arrotondamento:** €21.000
- **Range Consigliato:** €17.600 - €25.000

---

## Confronto con Standard di Mercato

### Benchmark di Settore (Italia 2025)

| Tipo Progetto | Range Prezzo | Note |
|---------------|--------------|------|
| API REST semplice (10-20 endpoint) | €3.000 - €8.000 | CRUD basilare |
| API REST media (30-50 endpoint) | €10.000 - €18.000 | Business logic moderata |
| **API REST complessa (60+ endpoint)** | **€15.000 - €30.000** | **Security, auth, algoritmi** |
| Sistema enterprise | €30.000+ | Multi-tenant, scalabilità |

**Il nostro progetto:** 64 endpoints + JWT + algoritmo valutazione = **Fascia Alta-Media**

### Confronto con Alternative

| Opzione | Costo | Pro | Contro |
|---------|-------|-----|--------|
| **Sviluppo Custom (nostro)** | €21.000 | Personalizzato, proprietà IP | Tempo sviluppo |
| Template/Starter Kit | €5.000 - €10.000 | Veloce | Non personalizzato |
| SaaS Real Estate Platform | €3.000/anno | No dev | Lock-in, costi ricorrenti |
| Agenzia Esterna Senior | €35.000+ | Esperienza | Costo elevato |
| Freelancer Low-Cost | €8.000 - €12.000 | Economico | Qualità variabile, rischio |

---

## Giustificazione del Prezzo

### Elementi di Valore Aggiunti

#### 1. **Complessità Tecnica Alta**

- 64 endpoint REST ben strutturati
- Sistema autenticazione JWT completo
- Algoritmo valutazione automatica proprietario
- 7 entità con relazioni complesse
- Spring Security configurato correttamente

#### 2. **Qualità del Codice**

- Architettura three-tier pulita
- Separazione responsibilities (Service/Controller/Repo)
- Pattern DTO per sicurezza
- Enum per type-safety
- Nomenclatura consistente

#### 3. **Sicurezza Enterprise-Grade**

- JWT con validazione completa
- BCrypt password hashing
- Role-based access control
- Input validation
- CORS configuration

#### 4. **Developer Experience**

- Swagger UI integrato e completo
- Documentazione tecnica dettagliata
- Data loader per testing
- Scripts di avvio
- H2 console per debugging

#### 5. **Scalabilità & Manutenibilità**

- Codice modulare
- Interface-based services
- Facile estensione
- Migrabile a DB production
- Logging strutturato

#### 6. **Time-to-Market**

- Sistema pronto per produzione
- Test data inclusi
- Deployment semplificato
- Zero configurazione client

### ROI per il Cliente

**Costi Evitati:**

- No licenze SaaS ricorrenti (€3.000/anno × 5 anni = €15.000)
- No costi integrazione terze parti
- Proprietà completa del codice
- Personalizzazioni future più economiche

**Benefici Operativi:**

- Automazione valutazioni (risparmio 70% tempo)
- Dashboard admin centralizzata
- Riduzione errori umani
- Tracciabilità completa

**Break-even:** 12-18 mesi

---

## Opzioni di Pricing

### Opzione 1: Package Base ⭐

**Prezzo: €17.600** (IVA esclusa)

**Incluso:**

- Codice sorgente completo (53 classi)
- 64 endpoint REST funzionanti
- Autenticazione JWT
- Database H2 configurato
- Documentazione tecnica base
- 1 mese supporto email

**Ideale per:**

- Startup con budget limitato
- Progetti pilota
- Clienti con team tecnico interno

---

### Opzione 2: Package Standard ⭐⭐ (CONSIGLIATO)

**Prezzo: €21.000** (IVA esclusa)

**Incluso:**

- Tutto il Package Base
- Testing completo (unit + integration)
- Documentazione estesa (README, guide, diagrammi)
- Swagger UI completamente annotato
- 3 mesi supporto tecnico
- 2 sessioni di training (4 ore)
- Assistenza deployment iniziale

**Ideale per:**

- Aziende medio-piccole
- Progetti con timeline definite
- Clienti che cercano rapporto qualità/prezzo

---

### Opzione 3: Package Premium ⭐⭐⭐

**Prezzo: €25.000** (IVA esclusa)

**Incluso:**

- Tutto il Package Standard
- Migrazione a database production (PostgreSQL/MySQL)
- Setup CI/CD pipeline
- Configurazione server production
- Security audit completo
- 6 mesi supporto prioritario
- 4 sessioni training (8 ore totali)
- Customizzazioni post-rilascio (8 ore)

**Ideale per:**

- Aziende enterprise
- Progetti critici
- Clienti che necessitano supporto esteso

---

### Opzione 4: Pricing Orario (Flessibile)

**Tariffa: €65/ora** (media)

**Ideale per:**

- Sviluppi incrementali
- Manutenzione continuativa
- Customizzazioni future
- Progetti con scope variabile

**Stima ore totali progetto:** 250-280 ore  
**Range totale:** €16.250 - €18.200

---

### Garanzie

- 90 giorni garanzia bug fixing
- 6 mesi garanzia difetti di progettazione
- Disponibilità codice sorgente completo

---

## Note Aggiuntive

### Cosa NON è Incluso nel Prezzo

- Server hosting e infrastruttura cloud
- Licenze database production
- Dominio e certificati SSL
- Manutenzione oltre il periodo incluso
- Features addizionali non specificate

### Possibili Extra (su richiesta)

| Servizio | Prezzo Stimato |
|----------|----------------|
| Migrazione DB production | €800 - €1.500 |
| Setup Docker containerization | €600 - €1.000 |
| Performance optimization | €1.000 - €2.000 |
| Mobile API optimization | €800 - €1.200 |

---

## Conclusioni e Raccomandazione

### Sintesi Finale

Il backend sviluppato rappresenta un **sistema completo e professionale** con:

- ✅ 53 classi Java ben strutturate
- ✅ 64 endpoint REST documentati
- ✅ Sistema autenticazione enterprise-grade
- ✅ Algoritmo valutazione immobile automatico
- ✅ Architettura scalabile e manutenibile
- ✅ Documentazione tecnica completa
