-- RUOLI
INSERT INTO ruolo (nome) VALUES
('utente'),
('admin');

-- UTENTI
INSERT INTO utente (nome, cognome, email, password, telefono, id_ruolo) VALUES
('Luca', 'Rossi', 'luca.rossi@example.com', 'pwd123', '3456789012', 1),
('Marta', 'Bianchi', 'marta.bianchi@example.com', 'pwd456', '3478901234', 2),
('Giulia', 'Verdi', 'giulia.verdi@example.com', 'pwd789', '3491122334', 1),
('Paolo', 'Ferrari', 'paolo.ferrari@example.com', 'pwd101', '3332233445', 1),
('Sara', 'Conti', 'sara.conti@example.com', 'pwd202', '3489988776', 1);

-- VENDITORI
INSERT INTO venditore (id_utente, nome, cognome, email, telefono, indirizzo, citta, provincia, codice_fiscale) VALUES
(1, 'Luca', 'Rossi', 'luca.rossi@vendite.it', '3456789012', 'Via Roma 10', 'Torino', 'TO', 'RSSLCU80A01L219Z'),
(NULL, 'Elena', 'Gallo', 'elena.gallo@vendite.it', '3475678901', 'Corso Francia 25', 'Torino', 'TO', 'GLLLNE85B41L219K'),
(2, 'Marta', 'Bianchi', 'marta.bianchi@vendite.it', '3478901234', 'Via Garibaldi 55', 'Milano', 'MI', 'BNCMRT90C22F205A'),
(NULL, 'Marco', 'Russo', 'marco.russo@vendite.it', '3495566778', 'Via Po 15', 'Torino', 'TO', 'RSSMRC82C01L219E'),
(3, 'Giulia', 'Verdi', 'giulia.verdi@vendite.it', '3491122334', 'Viale Italia 8', 'Roma', 'RM', 'VRDGLI91E15H501Y');

-- ZONE
INSERT INTO zona (cap, nome_zona, prezzo_medio_sqm) VALUES
('10137', 'Mirafiori Sud', 1900.00),
('10126', 'Lingotto', 2200.00),
('20121', 'Centro Milano', 7200.00),
('00144', 'Eur Roma', 4500.00),
('10141', 'Pozzo Strada', 2400.00);

-- IMMOBILI
INSERT INTO immobile (id_venditore, tipo, indirizzo, citta, provincia, cap, metri_quadri, camere, bagni, prezzo, descrizione, stato) VALUES
(1, 'appartamento', 'Via Genova 12', 'Torino', 'TO', '10137', 80, 3, 1, 160000, 'Appartamento luminoso con balcone e garage', 'abitabile'),
(2, 'villa', 'Via dei Fiori 5', 'Roma', 'RM', '00144', 180, 5, 3, 750000, 'Villa con giardino e piscina', 'nuova'),
(3, 'ufficio', 'Corso Buenos Aires 99', 'Milano', 'MI', '20121', 120, 4, 2, 890000, 'Ufficio moderno in zona centrale', 'ristrutturata'),
(4, 'appartamento', 'Via Chambery 45', 'Torino', 'TO', '10141', 65, 2, 1, 130000, 'Bilocale con riscaldamento autonomo', 'da_ristrutturare'),
(5, 'villa', 'Viale Europa 33', 'Torino', 'TO', '10126', 200, 6, 3, 560000, 'Villa indipendente con ampio cortile', 'abitabile');

-- VALUTAZIONI
INSERT INTO valutazione (id_immobile, id_utente, stato, valore_stimato, valore_calcolato_zona, deadline, note) VALUES
(1, 2, 'completata', 165000, 152000, '2024-06-01 00:00:00', 'Valore in linea con il mercato'),
(2, 3, 'in_corso', NULL, 810000, '2024-06-15 00:00:00', 'In attesa di sopralluogo'),
(3, 1, 'completata', 900000, 880000, '2024-07-01 00:00:00', 'Valutazione confermata'),
(4, 5, 'annullata', NULL, NULL, '2024-06-10 00:00:00', 'Richiesta ritirata dal venditore'),
(5, 4, 'in_corso', NULL, 540000, '2024-06-20 00:00:00', 'In verifica dati catastali');

-- CONTRATTI
INSERT INTO contratto (id_immobile, id_venditore, tipo, esclusiva, data_inizio, data_fine, prezzo_finale_minimo, stato, note) VALUES
(1, 1, 'vendita', TRUE, '2024-05-01', '2024-11-01', 150000, 'attivo', 'Contratto standard 6 mesi'),
(2, 2, 'vendita', TRUE, '2024-04-15', '2024-10-15', 720000, 'completato', 'Venduto sopra prezzo minimo'),
(3, 3, 'affitto', FALSE, '2024-06-01', NULL, 3000, 'attivo', 'Locazione mensile'),
(4, 4, 'vendita', TRUE, '2024-05-20', NULL, 120000, 'annullato', 'Cliente ha cambiato idea'),
(5, 5, 'vendita', TRUE, '2024-03-01', '2024-09-01', 550000, 'completato', 'Venduto al prezzo di mercato');
