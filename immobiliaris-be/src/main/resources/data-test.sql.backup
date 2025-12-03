-- =============================
-- RUOLI
-- =============================
INSERT INTO ruolo (nome) VALUES
('utente'),
('admin');

-- =============================
-- UTENTI
-- =============================
-- Gli utenti vengono creati automaticamente dal DataLoader con password hashate

-- =============================
-- VENDITORI
-- =============================
-- Gli ID degli utenti corrispondono a quelli creati dal DataLoader
-- Utente 1: Luca Rossi (admin viene creato come ID 0, quindi Luca è ID 1)
-- Utente 2: Marta Bianchi
-- Utente 3: Giulia Verdi
-- Altri venditori non sono utenti registrati (id_utente = NULL)

INSERT INTO venditore (id_utente, nome, cognome, email, telefono, indirizzo, citta, provincia, codice_fiscale) VALUES
(1, 'Luca', 'Rossi', 'luca.rossi@vendite.it', '3456789012', 'Via Roma 10', 'Torino', 'TO', 'RSSLCU80A01L219Z'),
(NULL, 'Elena', 'Gallo', 'elena.gallo@vendite.it', '3475678901', 'Corso Francia 25', 'Torino', 'TO', 'GLLLNE85B41L219K'),
(2, 'Marta', 'Bianchi', 'marta.bianchi@vendite.it', '3478901234', 'Via Garibaldi 55', 'Alessandria', 'AL', 'BNCMRT90C22F205A'),
(NULL, 'Marco', 'Russo', 'marco.russo@vendite.it', '3495566778', 'Via Po 15', 'Torino', 'TO', 'RSSMRC82C01L219E'),
(3, 'Giulia', 'Verdi', 'giulia.verdi@vendite.it', '3491122334', 'Viale Italia 8', 'Asti', 'AT', 'VRDGLI91E15H501Y'),
(NULL, 'Carlo', 'Bianchi', 'carlo.bianchi@vendite.it', '3334455667', 'Corso Nizza 12', 'Cuneo', 'CN', 'BNCCRL80B22H501Z');

-- =============================
-- ZONE
-- =============================
-- Torino
INSERT INTO zona (cap, nome_zona, prezzo_medio_sqm) VALUES
('10121', 'Centro Storico', 4000.00),
('10122', 'Centro - Porta Palazzo', 3700.00),
('10123', 'Quadrilatero Romano', 4100.00),
('10124', 'Piazza Vittorio / Vanchiglia', 3900.00),
('10125', 'San Salvario', 3100.00),
('10126', 'Lingotto / Nizza Millefonti', 2400.00),
('10127', 'Filadelfia / Stadio', 2300.00),
('10128', 'Crocetta Est', 3500.00),
('10129', 'Crocetta Ovest', 3600.00),
('10131', 'Madonna del Pilone', 2700.00),
('10132', 'Sassi / Borgata Rosa', 2600.00),
('10133', 'Cavoretto / Gran Madre', 3200.00),
('10134', 'Santa Rita Sud', 2100.00),
('10135', 'Mirafiori Sud', 1800.00),
('10136', 'Mirafiori Nord', 1900.00),
('10137', 'Santa Rita Nord', 2100.00),
('10138', 'Cenisia', 2400.00),
('10139', 'Pozzo Strada', 2100.00),
('10141', 'Borgo San Paolo', 2200.00),
('10142', 'Borgo San Paolo Ovest', 2200.00),
('10143', 'Campidoglio', 2600.00),
('10144', 'San Donato', 2500.00),
('10145', 'Cit Turin', 3100.00),
('10146', 'Parella', 2300.00),
('10147', 'Madonna di Campagna', 1900.00),
('10148', 'Borgo Vittoria', 2000.00),
('10149', 'Lucento', 2000.00),
('10151', 'Vallette', 1700.00),
('10152', 'Aurora', 1700.00),
('10153', 'Vanchiglia / Regio Parco', 2800.00),
('10154', 'Barriera di Milano', 1600.00),
('10155', 'Barriera di Milano Nord', 1600.00),
('10156', 'Rebaudengo / Falchera', 1500.00);

-- Altre città
INSERT INTO zona (cap, nome_zona, prezzo_medio_sqm) VALUES
('14100', 'Asti Centro', 1900.00),
('15121', 'Alessandria Centro', 1700.00),
('12100', 'Cuneo Centro', 2200.00);

-- =============================
-- IMMOBILI
-- =============================
INSERT INTO immobile (id_venditore, tipo, indirizzo, citta, provincia, cap, metri_quadri, camere, bagni, prezzo, descrizione, stato) VALUES
(1, 'APPARTAMENTO', 'Via Genova 12', 'Torino', 'TO', '10137', 80, 3, 1, 160000, 'Appartamento luminoso con balcone e garage', 'ABITABILE'),
(2, 'VILLA', 'Via dei Fiori 5', 'Torino', 'TO', '10126', 180, 5, 3, 750000, 'Villa con giardino e piscina', 'NUOVA'),
(4, 'APPARTAMENTO', 'Via Chambery 45', 'Torino', 'TO', '10141', 65, 2, 1, 130000, 'Bilocale con riscaldamento autonomo', 'DA_RISTRUTTURARE'),
(5, 'VILLA', 'Viale Europa 33', 'Asti', 'AT', '14100', 200, 6, 3, 560000, 'Villa indipendente con ampio cortile', 'ABITABILE'),
(3, 'APPARTAMENTO', 'Corso Alessandria 10', 'Alessandria', 'AL', '15121', 90, 3, 2, 220000, 'Appartamento centrale vicino servizi', 'ABITABILE'),
(6, 'APPARTAMENTO', 'Via Cuneo 5', 'Cuneo', 'CN', '12100', 75, 2, 1, 140000, 'Bilocale in zona centrale', 'ABITABILE');

-- =============================
-- VALUTAZIONI
-- =============================
-- Tutte le valutazioni sono COMPLETATE automaticamente con algoritmo di valutazione
-- 
-- Calcoli:
-- 1. Via Genova 12 (10137 - Santa Rita Nord): 80m² × 2100€/m² = 168.000€ + garage(12k) = 180.000€ × 1.0 (abitabile) = 180.000€
-- 2. Via dei Fiori 5 (10126 - Lingotto): 180m² × 2400€/m² = 432.000€ + 2bagni(10k) + piscina/giardino(20k) + 2garage(24k) = 486.000€ × 1.15 (nuova) = 558.900€
-- 3. Via Chambery 45 (10141 - Borgo San Paolo): 65m² × 2200€/m² = 143.000€ × 0.75 (da ristrutturare) = 107.250€
-- 4. Viale Europa 33 (14100 - Asti): 200m² × 1900€/m² = 380.000€ + 2bagni(10k) + giardino(20k) = 410.000€ × 1.0 (abitabile) = 410.000€
-- 5. Corso Alessandria 10 (15121 - Alessandria): 90m² × 1700€/m² = 153.000€ + 1bagno(5k) = 158.000€ × 1.0 (abitabile) = 158.000€
-- 6. Via Cuneo 5 (12100 - Cuneo): 75m² × 2200€/m² = 165.000€ × 1.0 (abitabile) = 165.000€

INSERT INTO valutazione (id_immobile, id_utente, stato, valore_stimato, valore_calcolato_zona, data_richiesta, data_completamento, deadline, note) VALUES
(1, 2, 'COMPLETATA', 180000, 168000, '2024-05-28 10:30:00', '2024-05-28 10:30:05', '2024-05-31 10:30:00', 'Valutazione automatica completata istantaneamente'),
(2, 1, 'COMPLETATA', 558900, 432000, '2024-04-10 14:15:00', '2024-04-10 14:15:05', '2024-04-13 14:15:00', 'Valutazione automatica completata istantaneamente'),
(3, 5, 'COMPLETATA', 107300, 143000, '2024-05-15 09:00:00', '2024-05-15 09:00:05', '2024-05-18 09:00:00', 'Valutazione automatica completata istantaneamente'),
(4, 3, 'COMPLETATA', 410000, 380000, '2024-02-20 16:45:00', '2024-02-20 16:45:05', '2024-02-23 16:45:00', 'Valutazione automatica completata istantaneamente'),
(5, 4, 'COMPLETATA', 158000, 153000, '2024-05-25 11:20:00', '2024-05-25 11:20:05', '2024-05-28 11:20:00', 'Valutazione automatica completata istantaneamente'),
(6, 2, 'COMPLETATA', 165000, 165000, '2024-05-05 13:30:00', '2024-05-05 13:30:05', '2024-05-08 13:30:00', 'Valutazione automatica completata istantaneamente');

-- =============================
-- CONTRATTI
-- =============================
INSERT INTO contratto (id_immobile, id_venditore, tipo, esclusiva, data_inizio, data_fine, prezzo_finale_minimo, stato, note) VALUES
(1, 1, 'vendita', TRUE, '2024-05-01', '2024-11-01', 150000, 'ATTIVO', 'Contratto standard 6 mesi'),
(2, 2, 'vendita', TRUE, '2024-04-15', '2024-10-15', 720000, 'COMPLETATO', 'Venduto sopra prezzo minimo'),
(3, 4, 'vendita', TRUE, '2024-05-20', NULL, 120000, 'ANNULLATO', 'Cliente ha cambiato idea'),
(4, 5, 'vendita', TRUE, '2024-03-01', '2024-09-01', 550000, 'COMPLETATO', 'Venduto al prezzo di mercato'),
(5, 3, 'vendita', TRUE, '2024-06-01', NULL, 220000, 'ATTIVO', 'Contratto standard 6 mesi'),
(6, 6, 'vendita', TRUE, '2024-05-10', NULL, 140000, 'ATTIVO', 'Contratto in corso');
-- =============================