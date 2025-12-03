# Guida Deployment e Configurazione Produzione

---

## Indice

1. [Prerequisiti](#prerequisiti)
2. [Configurazione Ambiente](#configurazione-ambiente)
3. [Database Produzione](#database-produzione)
4. [Configurazione Sicurezza](#configurazione-sicurezza)
5. [Build e Package](#build-e-package)
6. [Deployment](#deployment)
7. [Monitoraggio e Manutenzione](#monitoraggio-e-manutenzione)

---

## Prerequisiti

### Requisiti Sistema

**Server:**

- Sistema Operativo: Linux (Ubuntu 20.04+ o CentOS 8+) o Windows Server
- CPU: Minimo 2 core, raccomandato 4 core
- RAM: Minimo 4GB, raccomandato 8GB
- Storage: Minimo 20GB disponibili
- Network: Connessione stabile, porta 80 e 443 aperte

**Software:**

- Java Development Kit (JDK) 17 o superiore
- Maven 3.6 o superiore
- Database: PostgreSQL 13+ o MySQL 8+
- Nginx o Apache (per reverse proxy)
- Certbot (per certificati SSL)

### Account e Servizi

- Dominio registrato e configurato
- Certificato SSL (Let's Encrypt gratuito)
- Account email SMTP per notifiche
- Backup storage (cloud o locale)

---

## Configurazione Ambiente

### 1. Installazione Java

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install openjdk-17-jdk
java -version
```

**Linux (CentOS/RHEL):**

```bash
sudo yum install java-17-openjdk-devel
java -version
```

**Windows Server:**

1. Scaricare JDK 17 da Oracle o Adoptium
2. Installare seguendo wizard
3. Configurare variabile JAVA_HOME
4. Aggiungere %JAVA_HOME%\bin al PATH

### 2. Installazione Maven

**Linux:**

```bash
sudo apt install maven
mvn -version
```

**Windows:**

1. Scaricare Maven da apache.org
2. Estrarre in C:\Program Files\Maven
3. Aggiungere al PATH
4. Verificare: `mvn -version`

### 3. Creazione Utente Applicazione

**Linux:**

```bash
sudo useradd -r -m -U -d /opt/immobiliaris -s /bin/bash immobiliaris
sudo passwd immobiliaris
```

### 4. Variabili Ambiente

Creare file `/etc/environment.d/immobiliaris.conf` (Linux) o configurare in Windows:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=immobiliaris_prod
DB_USER=immobiliaris_user
DB_PASSWORD=your_secure_password_here

# JWT
JWT_SECRET=your_very_long_and_secure_secret_key_minimum_256_bits
JWT_EXPIRATION=86400000

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your_smtp_password

# Application
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=production
```

---

## Database Produzione

### PostgreSQL (Raccomandato)

**1. Installazione:**

**Linux:**

```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**2. Creazione Database:**

```bash
sudo -u postgres psql

CREATE DATABASE immobiliaris_prod;
CREATE USER immobiliaris_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE immobiliaris_prod TO immobiliaris_user;
\q
```

**3. Configurazione Connessione:**

Modificare `application-production.properties`:

```properties
# DataSource Configuration
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:immobiliaris_prod}
spring.datasource.username=${DB_USER:immobiliaris_user}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
```

**4. Inizializzazione Schema:**

```bash
cd immobiliaris-be
psql -U immobiliaris_user -d immobiliaris_prod -f src/main/resources/schema.sql
psql -U immobiliaris_user -d immobiliaris_prod -f src/main/resources/data-production.sql
```

### MySQL (Alternativa)

**1. Installazione:**

```bash
sudo apt install mysql-server
sudo mysql_secure_installation
```

**2. Creazione Database:**

```bash
sudo mysql

CREATE DATABASE immobiliaris_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'immobiliaris_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON immobiliaris_prod.* TO 'immobiliaris_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**3. Configurazione:**

```properties
spring.datasource.url=jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:immobiliaris_prod}?useSSL=true&serverTimezone=UTC
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```

### Backup Database

**Script Backup Automatico:**

Creare `/opt/immobiliaris/scripts/backup-db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/opt/immobiliaris/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="immobiliaris_prod"

mkdir -p $BACKUP_DIR

# PostgreSQL
pg_dump -U immobiliaris_user $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Mantieni solo ultimi 30 giorni
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completato: db_backup_$DATE.sql.gz"
```

**Crontab (esecuzione quotidiana alle 2:00 AM):**

```bash
sudo crontab -e
0 2 * * * /opt/immobiliaris/scripts/backup-db.sh >> /var/log/immobiliaris/backup.log 2>&1
```

---

## Configurazione Sicurezza

### 1. JWT Secret

**Generazione Secret Sicura:**

```bash
openssl rand -base64 64
```

Output esempio:

```
Kx7vN9mP2wQ8jR5tY6uZ3aB4cD1eF0gH8iJ9kL2mN5oP7qR9sT0uV3wX6yZ8aB1cD4eF7gH0iJ3kL6mN9oP2qR5sT8uV1wX4yZ7aB0cD3eF6gH9iJ2kL5mN8oP1qR4sT7uV0wX3yZ6
```

Configurare in variabile ambiente:

```bash
export JWT_SECRET="Kx7vN9mP2wQ8jR5tY6uZ3aB4cD1eF0gH8iJ9kL2mN5oP7qR9sT0uV3wX6yZ8aB1cD4eF7gH0iJ3kL6mN9oP2qR5sT8uV1wX4yZ7aB0cD3eF6gH9iJ2kL5mN8oP1qR4sT7uV0wX3yZ6"
```

### 2. HTTPS/SSL

**Installazione Certbot:**

```bash
sudo apt install certbot python3-certbot-nginx
```

**Ottenimento Certificato:**

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Auto-Rinnovo:**

```bash
sudo certbot renew --dry-run
```

### 3. CORS

Modificare `SecurityConfig.java`:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("https://yourdomain.com"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### 4. Firewall

**UFW (Ubuntu):**

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

**Firewalld (CentOS):**

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 5. Rate Limiting

Configurare Nginx per limitare richieste:

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

server {
    location /api/auth/login {
        limit_req zone=api_limit burst=5 nodelay;
        proxy_pass http://localhost:8080;
    }
}
```

---

## Build e Package

### 1. Preparazione Codice

**Rimuovere configurazioni sviluppo:**

```properties
# Disabilitare H2 Console
spring.h2.console.enabled=false

# Logging produzione
logging.level.root=WARN
logging.level.com.immobiliaris=INFO

# Swagger (opzionale, disabilitare se non necessario)
springdoc.api-docs.enabled=false
springdoc.swagger-ui.enabled=false
```

### 2. Build Maven

```bash
cd immobiliaris-be

# Clean e test
mvn clean test

# Package (salta test se già eseguiti)
mvn clean package -DskipTests

# Verifica JAR creato
ls -lh target/immobiliaris-be-*.jar
```

### 3. Ottimizzazione JAR

**pom.xml - Configurazione Build:**

```xml
<build>
    <finalName>immobiliaris-be</finalName>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <executable>true</executable>
            </configuration>
        </plugin>
    </plugins>
</build>
```

---

## Deployment

### Opzione 1: Systemd Service (Linux - Raccomandato)

**1. Copiare JAR:**

```bash
sudo mkdir -p /opt/immobiliaris/app
sudo cp target/immobiliaris-be.jar /opt/immobiliaris/app/
sudo chown -R immobiliaris:immobiliaris /opt/immobiliaris
```

**2. Creare Service File:**

`/etc/systemd/system/immobiliaris.service`:

```ini
[Unit]
Description=Immobiliaris Backend Service
After=syslog.target network.target postgresql.service

[Service]
User=immobiliaris
Group=immobiliaris
Type=simple
WorkingDirectory=/opt/immobiliaris/app
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=production /opt/immobiliaris/app/immobiliaris-be.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=immobiliaris

# Environment
Environment="JAVA_OPTS=-Xms512m -Xmx2048m"
EnvironmentFile=/etc/environment.d/immobiliaris.conf

[Install]
WantedBy=multi-user.target
```

**3. Avvio Service:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable immobiliaris
sudo systemctl start immobiliaris
sudo systemctl status immobiliaris
```

**4. Comandi Gestione:**

```bash
# Stop
sudo systemctl stop immobiliaris

# Restart
sudo systemctl restart immobiliaris

# Log in tempo reale
sudo journalctl -u immobiliaris -f

# Log completo
sudo journalctl -u immobiliaris --no-pager
```

### Opzione 2: Docker (Multipiattaforma)

**1. Creare Dockerfile:**

`Dockerfile`:

```dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/immobiliaris-be.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=production", "app.jar"]
```

**2. Build Immagine:**

```bash
docker build -t immobiliaris-be:1.0 .
```

**3. Docker Compose:**

`docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: immobiliaris_prod
      POSTGRES_USER: immobiliaris_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  app:
    image: immobiliaris-be:1.0
    environment:
      SPRING_PROFILES_ACTIVE: production
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: immobiliaris_prod
      DB_USER: immobiliaris_user
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "8080:8080"
    depends_on:
      - db
    restart: unless-stopped

volumes:
  postgres_data:
```

**4. Avvio:**

```bash
docker-compose up -d
docker-compose logs -f
```

### Opzione 3: Windows Service

**1. Installare WinSW:**

Scaricare da: <https://github.com/winsw/winsw/releases>

**2. Creare XML Configurazione:**

`immobiliaris-service.xml`:

```xml
<service>
    <id>immobiliaris</id>
    <name>Immobiliaris Backend</name>
    <description>Servizio backend Immobiliaris</description>
    <executable>java</executable>
    <arguments>-jar -Dspring.profiles.active=production "C:\immobiliaris\immobiliaris-be.jar"</arguments>
    <logpath>C:\immobiliaris\logs</logpath>
    <log mode="roll-by-size">
        <sizeThreshold>10240</sizeThreshold>
        <keepFiles>8</keepFiles>
    </log>
</service>
```

**3. Installazione Service:**

```cmd
winsw install immobiliaris-service.xml
winsw start immobiliaris
```

### Nginx Reverse Proxy

**Configurazione:**

`/etc/nginx/sites-available/immobiliaris`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    client_max_body_size 10M;

    # API Backend
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend Static Files
    location / {
        root /var/www/immobiliaris;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Attivazione:**

```bash
sudo ln -s /etc/nginx/sites-available/immobiliaris /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Monitoraggio e Manutenzione

### 1. Logging

**Configurazione Logging:**

`application-production.properties`:

```properties
# File Logging
logging.file.name=/var/log/immobiliaris/application.log
logging.file.max-size=10MB
logging.file.max-history=30

# Log Levels
logging.level.root=WARN
logging.level.com.immobiliaris=INFO
logging.level.org.springframework.security=WARN
logging.level.org.hibernate.SQL=WARN

# Pattern
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

**Rotazione Log (Logrotate):**

`/etc/logrotate.d/immobiliaris`:

```
/var/log/immobiliaris/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 immobiliaris immobiliaris
    sharedscripts
    postrotate
        systemctl reload immobiliaris > /dev/null 2>&1 || true
    endscript
}
```

### 2. Monitoring

**Health Check Endpoint:**

Spring Boot Actuator già configurato:

```
GET /actuator/health
```

**Script Monitoring:**

`/opt/immobiliaris/scripts/health-check.sh`:

```bash
#!/bin/bash
HEALTH_URL="http://localhost:8080/actuator/health"
ALERT_EMAIL="admin@yourdomain.com"

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -ne 200 ]; then
    echo "Immobiliaris HEALTH CHECK FAILED - HTTP $RESPONSE" | mail -s "ALERT: Immobiliaris Down" $ALERT_EMAIL
    sudo systemctl restart immobiliaris
fi
```

**Crontab (ogni 5 minuti):**

```bash
*/5 * * * * /opt/immobiliaris/scripts/health-check.sh
```

### 3. Aggiornamento Applicazione

**Script Update:**

`/opt/immobiliaris/scripts/update.sh`:

```bash
#!/bin/bash
APP_DIR="/opt/immobiliaris/app"
BACKUP_DIR="/opt/immobiliaris/backups/app"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup versione corrente
mkdir -p $BACKUP_DIR
cp $APP_DIR/immobiliaris-be.jar $BACKUP_DIR/immobiliaris-be_$DATE.jar

# Stop service
sudo systemctl stop immobiliaris

# Copia nuova versione
cp /tmp/immobiliaris-be-new.jar $APP_DIR/immobiliaris-be.jar
chown immobiliaris:immobiliaris $APP_DIR/immobiliaris-be.jar

# Start service
sudo systemctl start immobiliaris

# Verifica
sleep 10
if systemctl is-active --quiet immobiliaris; then
    echo "Aggiornamento completato con successo"
else
    echo "ERRORE: Rollback in corso"
    cp $BACKUP_DIR/immobiliaris-be_$DATE.jar $APP_DIR/immobiliaris-be.jar
    sudo systemctl start immobiliaris
fi
```

### 4. Performance Tuning

**JVM Options:**

```bash
JAVA_OPTS="-Xms512m -Xmx2048m -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/log/immobiliaris/heap_dump.hprof"
```

**PostgreSQL Tuning:**

`/etc/postgresql/13/main/postgresql.conf`:

```conf
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 2621kB
min_wal_size = 1GB
max_wal_size = 4GB
```

### 5. Backup Completo

**Script Backup Sistema:**

```bash
#!/bin/bash
BACKUP_ROOT="/backup/immobiliaris"
DATE=$(date +%Y%m%d_%H%M%S)

# Database
pg_dump -U immobiliaris_user immobiliaris_prod | gzip > $BACKUP_ROOT/db_$DATE.sql.gz

# Application Files
tar -czf $BACKUP_ROOT/app_$DATE.tar.gz /opt/immobiliaris/app

# Logs
tar -czf $BACKUP_ROOT/logs_$DATE.tar.gz /var/log/immobiliaris

# Cleanup old backups (>30 giorni)
find $BACKUP_ROOT -name "*.gz" -mtime +30 -delete
find $BACKUP_ROOT -name "*.tar.gz" -mtime +30 -delete
```

---

## Checklist Pre-Produzione

- [ ] Java 17+ installato e configurato
- [ ] Database PostgreSQL/MySQL installato e inizializzato
- [ ] Schema database creato e testato
- [ ] Variabili ambiente configurate correttamente
- [ ] JWT secret generato e sicuro (256+ bit)
- [ ] HTTPS/SSL certificato ottenuto e configurato
- [ ] CORS configurato con domini specifici
- [ ] Firewall configurato (solo porte necessarie)
- [ ] H2 Console disabilitata
- [ ] Logging configurato per produzione
- [ ] Backup database automatizzato
- [ ] Monitoring e health checks attivi
- [ ] Nginx reverse proxy configurato
- [ ] Rate limiting implementato
- [ ] Script deployment testati
- [ ] Rollback plan definito
- [ ] Documentazione aggiornata

---

## Contatti e Supporto

Per assistenza con il deployment:

- Repository GitHub: <https://github.com/marcologioco/laboratorio-integrato-group-4>
- Email: <support@yourdomain.com>
- Documentazione: /Documentazione/
