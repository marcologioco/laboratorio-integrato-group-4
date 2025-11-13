-- =============================
-- RUOLI
-- =============================
INSERT INTO ruolo (nome) VALUES
('utente'),
('admin');

-- =============================
-- UTENTI
-- =============================
INSERT INTO utente (nome, cognome, email, password, telefono, id_ruolo) VALUES
('Admin', 'Default', 'admin@example.com', 'admin123', '0000000000', 2),
('Luca', 'Rossi', 'luca.rossi@example.com', 'pwd123', '3456789012', 1),
('Giulia', 'Verdi', 'giulia.verdi@example.com', 'pwd789', '3491122334', 1),
('Paolo', 'Ferrari', 'paolo.ferrari@example.com', 'pwd101', '3332233445', 1),
('Sara', 'Conti', 'sara.conti@example.com', 'pwd202', '3489988776', 1);

-- =============================
-- VENDITORI
-- =============================
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
INSERT INTO valutazione (id_immobile, id_utente, stato, valore_stimato, valore_calcolato_zona, deadline, note) VALUES
(1, 2, 'COMPLETATA', 165000, 152000, '2024-06-01 00:00:00', 'Valore in linea con il mercato'),
(2, 1, 'IN_CORSO', NULL, 540000, '2024-06-20 00:00:00', 'In verifica dati catastali'),
(3, 5, 'ANNULLATA', NULL, NULL, '2024-06-10 00:00:00', 'Richiesta ritirata dal venditore'),
(4, 3, 'IN_CORSO', NULL, 560000, '2024-06-15 00:00:00', 'In attesa di sopralluogo'),
(5, 4, 'COMPLETATA', 225000, 220000, '2024-07-01 00:00:00', 'Valutazione confermata'),
(6, 2, 'IN_CORSO', NULL, 145000, '2024-06-18 00:00:00', 'Controllo dati catastali');

-- =============================
-- CONTRATTI
-- =============================
INSERT INTO contratto (id_immobile, id_venditore, tipo, esclusiva, data_inizio, data_fine, prezzo_finale_minimo, stato, note) VALUES
(1, 1, 'vendita', TRUE, '2024-05-01', '2024-11-01', 150000, 'ATTIVO', 'Contratto standard 6 mesi'),
(2, 2, 'vendita', TRUE, '2024-04-15', '2024-10-15', 720000, 'COMPLETATO', 'Venduto sopra prezzo minimo'),
(3, 4, 'vendita', TRUE, '2024-05-20', NULL, 120000, 'ANNULLATO', 'Cliente ha cambiato idea'),
(4, 5, 'vendita', TRUE, '2024-03-01', '2024-09-01', 550000, 'COMPLETATO', 'Venduto al prezzo di mercato'),
(5, 3, 'vendita', TRUE, '2024-06-01', NULL, 220000, 'ATTIVO', 'Contratto standard 6 mesi'),
(6, 6, 'vendita', TRUE, '2024-05-10', NULL, 140000, 'IN_CORSO', 'Contratto in corso');
-- =============================