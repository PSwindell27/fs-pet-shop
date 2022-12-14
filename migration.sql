DROP TABLE IF EXISTS pets;

CREATE TABLE pets(
    id SERIAL,
    age INTEGER,
    name TEXT,
    kind TEXT
);

INSERT INTO pets (name, age, kind) VALUES ('fido', 7, 'rainbow');
INSERT INTO pets (name, age, kind) VALUES ('Buttons', 5, 'snake');

SELECT name FROM pets;
