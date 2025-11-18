# Immobiliaris - Portale Immobiliare

## 📋 Descrizione del Progetto

Il progetto è un portale web sviluppato per un'agenzia immobiliare piemontese del gruppo Immobiliaris, con l'obiettivo di modernizzare l'acquisizione di immobili in esclusiva e attrarre un target più giovane (35-55 anni).

Il progetto è stato realizzato come parte di un laboratorio integrando competenze di sviluppo software, web development e digital strategy.

## 🎯 Obiettivi

- Realizzazione di un portale web per l'acquisizione di immobili in esclusiva
- Sistema di valutazione automatica degli immobili entro 72 ore
- Gestione contratti di vendita in esclusiva
- Backoffice per amministratori
- Interfaccia responsive e ottimizzata SEO

## 🛠️ Tecnologie Utilizzate

### Backend

- **Java 17**
- **Spring Boot 3.5.6**
  - Spring Web
  - Spring Data JPA
  - Spring Security
  - Spring Validation
- **Database**: H2 (in-memory)
- **Autenticazione**: JWT (JSON Web Token)
- **Documentazione API**: Swagger/OpenAPI (SpringDoc)

### Frontend

- **HTML5/CSS3**
- **JavaScript**
- **Tailwind CSS**
- **Swiper.js** (per carousel)

### Tools & Versionamento

- **Maven** (gestione dipendenze e build)
- **GitHub** (versionamento)
- **GitHub Projects** (gestione progetto)

## 📁 Struttura del Progetto

```bash
immobiliaris-be/
├── src/
│   ├── main/
│   │   ├── java/com/immobiliaris/immobiliaris_be/
│   │   │   ├── config/          # Configurazioni (Security, JWT, Swagger)
│   │   │   ├── controller/      # REST Controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── enums/           # Enumerazioni
│   │   │   ├── model/           # Entità JPA
│   │   │   ├── repos/           # Repository
│   │   │   ├── services/        # Business Logic
│   │   │   └── util/            # Utility classes
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── data-test.sql    # Dati di test
│   │       └── static/          # File statici (HTML, CSS, JS)
│   └── test/                    # Test unitari
├── pom.xml                      # Configurazione Maven
└── README.md
```

## 🚀 Installazione e Avvio

### Prerequisiti

- Java 17 o superiore
- Maven 3.6+
- Git

### Installazione

1. **Clona il repository**

```bash
git clone https://github.com/marcologioco/laboratorio-integrato-group-4.git
cd laboratorio-integrato-group-4/immobiliaris-be
```

2. **Build del progetto**

```bash
mvn clean install
```

3. **Avvia l'applicazione**

```bash
mvn spring-boot:run
```

Oppure esegui il JAR compilato:

```bash
java -jar target/immobiliaris-be-0.0.1-SNAPSHOT.jar
```

L'applicazione sarà disponibile su: `http://localhost:8080`

## 📚 API Documentation

Una volta avviata l'applicazione, la documentazione Swagger è accessibile a:

- **Swagger UI**: <http://localhost:8080/swagger>
- **API Docs (JSON)**: <http://localhost:8080/api-docs>

## 🗄️ Database

Il progetto utilizza un database H2 in-memory per facilitare lo sviluppo e i test.

- **Console H2**: <http://localhost:8080/h2>
  - JDBC URL: `jdbc:h2:mem:ImmobiliarisDB`
  - Username: `sa`
  - Password: *(vuota)*

## 🔑 Autenticazione

Il sistema utilizza JWT (JSON Web Token) per l'autenticazione:

- Token valido per 24 ore
- Endpoint di login: `/api/auth/login`
- Endpoint di registrazione: `/api/auth/register`

## 📦 Funzionalità Principali

### Per gli Utenti-Venditori

- **Onboarding**: Form multi-step per inserimento dati immobile
- **Valutazione automatica**: Richiesta di valutazione entro 72 ore
- **Tracciamento**: Monitoraggio dello stato della propria richiesta

### Per gli Amministratori

- **Gestione immobili**: CRUD completo su immobili
- **Gestione valutazioni**: Approvazione e gestione richieste
- **Gestione contratti**: Creazione e monitoraggio contratti di vendita
- **Gestione utenti**: Amministrazione utenti e venditori
- **Zone geografiche**: Gestione aree operative (Torino, Cuneo, Alessandria, Asti)

## 🌍 Area Geografica Target

Il portale si concentra sulle principali città del Piemonte:

- Torino
- Cuneo
- Alessandria
- Asti

## 👥 Team

Progetto realizzato dal **Group 4** nell'ambito del corso di Laboratorio Integrato.

**Repository**: [laboratorio-integrato-group-4](https://github.com/marcologioco/laboratorio-integrato-group-4)

## 📝 Note di Sviluppo

- Il database H2 viene popolato automaticamente con dati di test all'avvio
- La configurazione JWT utilizza una secret key di esempio (da modificare in produzione)
- Il progetto include CORS configurato per lo sviluppo locale
- Sono implementati filtri di sicurezza con Spring Security

## 🔧 Comandi Utili

```bash
# Compilazione senza test
mvn clean package -DskipTests

# Esecuzione test
mvn test

# Pulizia progetto
mvn clean

# Verifica dipendenze
mvn dependency:tree
```

## 📞 Supporto

Per problemi o domande, aprire una issue nel repository GitHub del progetto.
