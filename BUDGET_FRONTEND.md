# Budget Frontend - Immobiliaris

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
| **Sviluppo Frontend** | €10.200 - €14.800 |
| **UI/UX Design** | €2.800 - €3.600 |
| **Testing & QA** | €1.800 - €2.400 |
| **Documentazione** | €800 - €1.200 |
| **Ottimizzazione & Deploy** | €600 - €1.000 |
| | |
| **TOTALE PROGETTO** | **€16.200 - €23.000** |
| **Prezzo Medio Consigliato** | **€19.500** |

### Range di Pricing per Cliente

- **Prezzo Minimo (Entry):** €16.200
- **Prezzo Standard:** €19.500  
- **Prezzo Premium:** €23.000

---

## Analisi Tecnica del Progetto

### Metriche del Codice

#### Struttura Frontend

| Componente | Quantità | Complessità |
|------------|----------|-------------|
| **Pagine HTML** | 4 | Alta |
| **File JavaScript** | 8 | Alta |
| **File CSS** | 3 | Media |
| **Asset Grafici** | 12+ | Bassa |
| **Form Multi-step** | 1 (6 step) | Molto Alta |
| **Dashboard Admin** | 1 | Alta |
| **Dashboard Utente** | 1 | Media |

**Totale File:** 27+ file frontend

#### Breakdown Pagine

| Pagina | Sezioni | Form | Complessità | LOC Stimate |
|--------|---------|------|-------------|-------------|
| index.html | 8 | 1 multi-step | Molto Alta | 800+ |
| admin.html | 6 | 3 complessi | Alta | 650+ |
| user.html | 4 | 0 | Media | 350+ |
| login.html | 2 | 1 | Bassa | 250+ |

#### JavaScript Modules

| File | Funzioni | Complessità | Scopo |
|------|----------|-------------|-------|
| valutazione.js | 12+ | Molto Alta | Form multi-step, calcolo automatico |
| admin.js | 15+ | Alta | Gestione dashboard, CRUD completo |
| user.js | 8+ | Media | Dashboard utente, fetch dati |
| auth-utils.js | 6+ | Media | Autenticazione JWT, protezione |
| validation-utils.js | 4 | Bassa | Validazione form generica |
| login.js | 3 | Media | Login flow |
| faq.js | 2 | Bassa | Accordion FAQ |
| swiper-config.js | 1 | Bassa | Carousel configurazione |

### Funzionalità Implementate

#### Core Features

1. **Homepage Completa**
   - Hero section con form valutazione
   - 6-step form wizard con validazione
   - Carousel immobili (Swiper.js)
   - Sezioni informative responsive
   - Sistema FAQ interattivo
   - Footer completo

2. **Sistema Valutazione Multi-step**
   - Step 0: Scelta registrazione/login
   - Step 1: Dati personali (5 campi + radio)
   - Step 2: Dati immobile (7 campi)
   - Step 3: Tipo immobile (3 scelte visuali)
   - Step 4: Stato immobile (4 scelte visuali)
   - Step 5: Pertinenze (checkbox + textarea)
   - Progress bar animata
   - Validazione real-time
   - Calcolo automatico prezzo frontend
   - Integrazione con backend per utenti loggati
   - Modalità ospite per non registrati

3. **Dashboard Admin**
   - Overview cards (4 metriche)
   - Gestione Utenti (CRUD completo)
   - Gestione Venditori (CRUD completo)
   - Gestione Immobili (CRUD completo)
   - Gestione Valutazioni (CRUD completo)
   - Sistema Contratti con template stampabile
   - Generazione PDF contratto (layout A4)
   - Form contratto interattivo
   - Anteprima real-time contratto
   - Navigazione sidebar dinamica

4. **Dashboard Utente**
   - Profilo personalizzato
   - Visualizzazione valutazioni
   - Visualizzazione immobili
   - Statistiche personali
   - Link rapido nuova valutazione

5. **Sistema Autenticazione**
   - Pagina login dedicata
   - Gestione JWT client-side
   - Protected routes
   - Auto-redirect dopo login
   - Logout con cleanup
   - Session persistence

6. **UI/UX Features**
   - Design system coerente (Tailwind CSS)
   - Responsive design completo
   - Animazioni e transizioni
   - Feedback visivo utente
   - Error handling completo
   - Loading states
   - Empty states
   - Mobile menu hamburger

7. **Interazioni Avanzate**
   - Card selection visuale (tipo/stato)
   - Toggle checkbox con UI
   - Validazione form real-time
   - Messaggi errore contestuali
   - Conferme azioni critiche
   - Aggiornamenti dinamici UI

8. **Integrazione Backend**
   - Fetch API completo
   - Authenticated requests (JWT)
   - Error handling robusto
   - Gestione CORS
   - Mapping DTO

9. **Ottimizzazioni**
   - Lazy loading immagini
   - CSS minificato (Tailwind)
   - Debounce validazioni
   - Local Storage per auth
   - Progressive enhancement

10. **Accessibilità**
    - Semantic HTML
    - ARIA labels
    - Focus management
    - Keyboard navigation
    - Screen reader friendly

### Tecnologie & Framework

| Categoria | Tecnologia | Versione | Scopo |
|-----------|------------|----------|-------|
| CSS Framework | Tailwind CSS | 3.x | Utility-first styling |
| Carousel | Swiper.js | 11.x | Slider immobili |
| Icons | Heroicons | SVG | Icone UI |
| Template | Thymeleaf | 3.5.6 | Server-side rendering |
| JavaScript | Vanilla ES6+ | - | Interattività |
| Build | Tailwind CLI | 3.x | CSS processing |

### Custom Design System

| Elemento | Valore | Uso |
|----------|--------|-----|
| **my-green-dark** | #1C2E2A | Brand primario, CTA |
| **my-orange** | #D17A3C | Accenti, hover states |
| **my-cream** | #F5F3ED | Background alternativo |
| **my-black** | #1A1A1A | Testo principale |
| **Font** | System fonts | Sans-serif stack |

---

## Calcolo Costi per Categoria

### Metodologia di Calcolo

**Tariffe Orarie di Riferimento:**

- **Senior Frontend Developer:** €55-75/ora
- **Mid-Level Frontend Developer:** €40-55/ora
- **Junior Frontend Developer:** €25-35/ora
- **UI/UX Designer:** €50-70/ora

**Complessità del Progetto:** Media-Alta

### 1. UI/UX Design (30-40 ore)

| Attività | Ore | Tariffa | Subtotale |
|----------|-----|---------|-----------|
| Analisi requisiti UX | 4 | €60/h | €240 |
| Wireframing (4 pagine) | 8 | €55/h | €440 |
| Design system (colori, tipografia) | 6 | €60/h | €360 |
| Mockup alta fedeltà homepage | 10 | €65/h | €650 |
| Mockup dashboard admin | 8 | €65/h | €520 |
| Mockup dashboard utente | 4 | €60/h | €240 |
| Design form multi-step | 6 | €60/h | €360 |
| Icone e asset grafici | 4 | €50/h | €200 |
| **TOTALE** | **50h** | | **€3.010** |

### 2. Sviluppo Frontend (110-140 ore)

| Componente | Ore | Tariffa | Subtotale |
|------------|-----|---------|-----------|
| **Setup & Configurazione** | | | |
| Setup Tailwind CSS | 3 | €50/h | €150 |
| Configurazione build pipeline | 2 | €55/h | €110 |
| Design system implementation | 4 | €55/h | €220 |
| **Homepage (index.html)** | | | |
| Header & Navigation | 4 | €50/h | €200 |
| Hero section | 3 | €50/h | €150 |
| Form multi-step HTML structure | 8 | €60/h | €480 |
| Sezioni informative (4) | 6 | €45/h | €270 |
| Carousel immobili | 4 | €55/h | €220 |
| FAQ section | 3 | €45/h | €135 |
| Footer completo | 2 | €45/h | €90 |
| **Login Page (login.html)** | | | |
| Struttura pagina login | 3 | €45/h | €135 |
| Form styling | 2 | €45/h | €90 |
| **Dashboard Admin (admin.html)** | | | |
| Layout sidebar + main | 6 | €55/h | €330 |
| Overview cards (4) | 4 | €50/h | €200 |
| Tabelle dati responsive | 6 | €55/h | €330 |
| Form contratti | 8 | €60/h | €480 |
| Template contratto A4 | 6 | €60/h | €360 |
| Modali e overlay | 4 | €50/h | €200 |
| **Dashboard Utente (user.html)** | | | |
| Struttura dashboard | 4 | €50/h | €200 |
| Cards valutazioni | 3 | €45/h | €135 |
| Cards immobili | 3 | €45/h | €135 |
| **JavaScript Development** | | | |
| valutazione.js (form wizard) | 12 | €65/h | €780 |
| admin.js (dashboard logic) | 10 | €65/h | €650 |
| user.js (user dashboard) | 5 | €55/h | €275 |
| auth-utils.js (JWT handling) | 6 | €60/h | €360 |
| validation-utils.js | 3 | €50/h | €150 |
| login.js | 3 | €50/h | €150 |
| faq.js | 2 | €45/h | €90 |
| swiper-config.js | 2 | €50/h | €100 |
| **Responsive Design** | | | |
| Mobile optimization (4 pagine) | 12 | €55/h | €660 |
| Tablet breakpoints | 6 | €50/h | €300 |
| Cross-browser testing | 4 | €50/h | €200 |
| **TOTALE** | **137h** | | **€7.565** |

### 3. Integrazione Backend (15-20 ore)

| Attività | Ore | Tariffa | Subtotale |
|----------|-----|---------|-----------|
| Setup API client | 2 | €55/h | €110 |
| Integrazione autenticazione JWT | 4 | €60/h | €240 |
| Fetch dati dashboard admin | 6 | €55/h | €330 |
| Fetch dati dashboard utente | 3 | €55/h | €165 |
| Form submission handling | 4 | €55/h | €220 |
| Error handling centralizzato | 3 | €55/h | €165 |
| **TOTALE** | **22h** | | **€1.230** |

### 4. Testing & Quality Assurance (25-30 ore)

| Attività | Ore | Tariffa | Subtotale |
|----------|-----|---------|-----------|
| Unit testing JavaScript | 8 | €50/h | €400 |
| Integration testing form flow | 6 | €55/h | €330 |
| UI testing responsive | 6 | €50/h | €300 |
| Cross-browser testing | 4 | €50/h | €200 |
| Accessibility testing | 4 | €55/h | €220 |
| Performance testing | 3 | €55/h | €165 |
| Bug fixing & refinement | 6 | €55/h | €330 |
| **TOTALE** | **37h** | | **€1.945** |

### 5. Documentazione (10-15 ore)

| Attività | Ore | Tariffa | Subtotale |
|----------|-----|---------|-----------|
| Documentazione componenti | 4 | €50/h | €200 |
| Guide utilizzo dashboard | 3 | €45/h | €135 |
| README tecnico | 2 | €45/h | €90 |
| Style guide | 3 | €50/h | €150 |
| Annotazioni codice | 2 | €45/h | €90 |
| **TOTALE** | **14h** | | **€665** |

### 6. Ottimizzazione & Deployment (8-12 ore)

| Attività | Ore | Tariffa | Subtotale |
|----------|-----|---------|-----------|
| Ottimizzazione immagini | 2 | €45/h | €90 |
| Minificazione CSS/JS | 2 | €50/h | €100 |
| Performance optimization | 3 | €55/h | €165 |
| SEO base (meta tag) | 2 | €45/h | €90 |
| Setup CDN assets | 2 | €50/h | €100 |
| Testing finale | 2 | €50/h | €100 |
| **TOTALE** | **13h** | | €645 |

### 7. Project Management & Comunicazione (12-15 ore)

| Attività | Ore | Tariffa | Subtotale |
|----------|-----|---------|-----------|
| Meeting design review | 4 | €60/h | €240 |
| Iterazioni feedback cliente | 6 | €55/h | €330 |
| Code review | 4 | €60/h | €240 |
| Documentazione progress | 2 | €50/h | €100 |
| **TOTALE** | **16h** | | **€910** |

---

## Breakdown Dettagliato

### Totale Ore di Lavoro

| Categoria | Ore | Costo |
|-----------|-----|-------|
| UI/UX Design | 50 | €3.010 |
| Sviluppo Frontend | 137 | €7.565 |
| Integrazione Backend | 22 | €1.230 |
| Testing & QA | 37 | €1.945 |
| Documentazione | 14 | €665 |
| Ottimizzazione | 13 | €645 |
| Project Management | 16 | €910 |
| **TOTALE** | **289 ore** | **€15.970** |

### Margini e Contingency

| Voce | % | Importo |
|------|---|---------|
| Subtotale Tecnico | - | €15.970 |
| Contingency (imprevisti) | 10% | €1.597 |
| Margine Business | 12% | €2.108 |
| **TOTALE CON MARGINI** | - | **€19.675** |

### Arrotondamento Commerciale

- **Base Calculation:** €19.675
- **Arrotondamento:** €19.500
- **Range Consigliato:** €16.200 - €23.000

---

## Confronto con Standard di Mercato

### Benchmark di Settore (Italia 2025)

| Tipo Progetto | Range Prezzo | Note |
|---------------|--------------|------|
| Landing page semplice | €2.000 - €5.000 | 1-2 pagine, form base |
| Sito corporate medio | €8.000 - €15.000 | 5-10 pagine, CMS |
| **Web App complessa** | **€15.000 - €30.000** | **Dashboard, form avanzati** |
| E-commerce custom | €25.000 - €50.000+ | Catalogo, checkout, admin |

**Il nostro progetto:** 4 pagine + 2 dashboard + form wizard + integrazione = **Fascia Alta-Media**

### Confronto con Alternative

| Opzione | Costo | Pro | Contro |
|---------|-------|-----|--------|
| **Sviluppo Custom (nostro)** | €19.500 | Design unico, funzionalità specifiche | Tempo sviluppo |
| Template Premium + Custom | €3.000 - €8.000 | Veloce | Limitazioni design |
| Page Builder (Webflow/Bubble) | €5.000 - €12.000 | No-code | Vendor lock-in |
| Agenzia Senior | €30.000+ | Esperienza | Costo elevato |
| Freelancer Low-Cost | €6.000 - €10.000 | Economico | Qualità variabile |

---

## Giustificazione del Prezzo

### Elementi di Valore Aggiunti

#### 1. **Complessità Tecnica Alta**

- Form wizard 6-step con validazione complessa
- 2 dashboard complete (admin + user)
- Sistema autenticazione JWT lato client
- Calcolo valutazione real-time
- Template contratto stampabile

#### 2. **Qualità UI/UX**

- Design system coerente
- Responsive design professionale
- Animazioni fluide
- Feedback utente immediato
- Accessibilità implementata

#### 3. **Architettura Scalabile**

- Codice modulare JavaScript
- Utility functions riutilizzabili
- Separazione concerns
- Facile manutenibilità
- Estensibilità

#### 4. **Developer Experience**

- Codice commentato
- Naming conventions chiare
- Error handling robusto
- Debugging facilitato
- Documentazione inclusa

#### 5. **Performance**

- CSS ottimizzato (Tailwind)
- Lazy loading implementato
- Minificazione assets
- Cache strategy
- Load time < 3s

#### 6. **Cross-Platform**

- Responsive mobile-first
- Tablet optimization
- Desktop enhanced
- Touch-friendly
- Browser compatibility (Chrome, Firefox, Safari, Edge)

### ROI per il Cliente

**Costi Evitati:**

- No abbonamenti mensili SaaS (€100-300/mese × 12 = €1.200-3.600/anno)
- No licenze template premium ricorrenti
- Proprietà completa del codice
- Customizzazioni future meno costose

**Benefici Operativi:**

- Automazione valutazione (risparmio 80% tempo)
- Dashboard admin centralizzata
- Riduzione carico customer service
- User experience ottimizzata = più conversioni
- Brand identity professionale

**Break-even:** 10-15 mesi

---

## Opzioni di Pricing

### Opzione 1: Package Base

**Prezzo: €16.200** (IVA esclusa)

**Incluso:**

- 4 pagine HTML complete
- Design responsive base
- Form valutazione funzionante
- Dashboard admin essenziale
- Dashboard utente base
- Integrazione backend
- 1 mese supporto email

**Ideale per:**

- Startup con budget limitato
- MVP testing
- Progetti pilota

---

### Opzione 2: Package Standard (CONSIGLIATO)

**Prezzo: €19.500** (IVA esclusa)

**Incluso:**

- Tutto il Package Base
- UI/UX design professionale completo
- Form wizard 6-step avanzato
- Dashboard admin completa
- Sistema contratti con template
- Testing completo
- Documentazione estesa
- Ottimizzazioni performance
- 3 mesi supporto tecnico
- 2 sessioni training (4 ore)

**Ideale per:**

- Aziende medio-piccole
- Progetti production-ready
- Clienti che cercano qualità/prezzo

---

### Opzione 3: Package Premium

**Prezzo: €23.000** (IVA esclusa)

**Incluso:**

- Tutto il Package Standard
- Design system completo custom
- Animazioni avanzate
- PWA implementation (offline mode)
- Analytics integration (Google Analytics)
- A/B testing setup
- SEO optimization completa
- Accessibility audit WCAG 2.1 AA
- 6 mesi supporto prioritario
- 4 sessioni training (8 ore totali)
- Customizzazioni post-rilascio (10 ore)

**Ideale per:**

- Aziende enterprise
- Progetti mission-critical
- Brand awareness elevato

---

### Opzione 4: Pricing Orario (Flessibile)

**Tariffa: €60/ora** (media)

**Ideale per:**

- Sviluppi incrementali
- Manutenzione continuativa
- Feature addizionali
- Progetti scope variabile

**Stima ore totali progetto:** 280-320 ore  
**Range totale:** €16.800 - €19.200

---

### Add-on Opzionali

| Servizio | Prezzo Stimato |
|----------|----------------|
| Logo design | €800 - €1.500 |
| Fotografie professionali immobili | €600 - €1.200 |
| Video promozionale | €1.500 - €3.000 |
| Copywriting professionale | €500 - €1.000 |
| Social media integration | €400 - €800 |
| Chat bot integration | €1.000 - €2.000 |
| Email marketing setup | €600 - €1.200 |

---

## Note Aggiuntive

### Cosa NON è Incluso nel Prezzo

- Hosting e dominio
- Certificato SSL
- Servizi terze parti (CDN, Analytics)
- Contenuti testuali (copywriting)
- Fotografie professionali
- Manutenzione oltre il periodo incluso
- Features addizionali non specificate

### Possibili Extra (su richiesta)

| Servizio | Prezzo Stimato |
|----------|----------------|
| PWA completa (offline) | €1.500 - €2.500 |
| Multi-lingua (i18n) | €1.200 - €2.000 |
| Chat live integration | €800 - €1.500 |
| Advanced analytics dashboard | €1.500 - €2.500 |
| Mobile app (React Native) | €8.000 - €15.000 |

### Garanzie

- 90 giorni garanzia bug fixing
- 6 mesi garanzia compatibilità browser
- Codice sorgente completo consegnato
- Licenza d'uso illimitata

---

## Conclusioni e Raccomandazione

### Sintesi Finale

Il frontend sviluppato rappresenta un **sistema completo e professionale** con:

- 4 pagine HTML responsive
- 2 dashboard complete (admin + user)
- Form wizard 6-step avanzato
- 8 moduli JavaScript ben strutturati
- Design system coerente Tailwind
- Integrazione backend seamless
- Testing e QA completi
- Performance ottimizzate

### Valore Aggiunto Tecnico

**Rispetto a un template:**

- Design unico su misura
- Funzionalità specifiche business
- Codice pulito e manutenibile
- Scalabilità garantita

**Rispetto a una soluzione low-code:**

- Pieno controllo codice
- Nessun vendor lock-in
- Performance superiori
- Customizzazione illimitata

### Raccomandazione

Consigliamo il **Package Standard a €19.500** che offre:

1. Miglior rapporto qualità/prezzo
2. Tutte le funzionalità core
3. Supporto adeguato (3 mesi)
4. Training incluso
5. Prodotto production-ready

Il progetto frontend è perfettamente integrato con il backend da €21.000, per un **investimento totale consigliato di €40.500** che garantisce una soluzione completa, professionale e scalabile.

### Tempistiche Stimate

| Fase | Durata |
|------|--------|
| Design UI/UX | 2-3 settimane |
| Sviluppo Frontend | 4-5 settimane |
| Integrazione Backend | 1 settimana |
| Testing & QA | 1-2 settimane |
| Deploy & Training | 1 settimana |
| **TOTALE** | **9-12 settimane** |

### Requisiti Cliente

- Materiali brand (logo, colori)
- Contenuti testuali
- Immagini/foto immobili
- Accesso backend API
- Ambiente staging per test

---
