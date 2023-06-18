DROP TABLE IF EXISTS logs;
CREATE TABLE logs (
	id INT PRIMARY KEY IDENTITY,
	creation_date DATETIME,
	type VARCHAR(20),
	message VARCHAR(2000)
);

DROP TABLE IF EXISTS appointments
CREATE TABLE appointments (
	id INT PRIMARY KEY IDENTITY,
	name VARCHAR(100) NOT NULL,
	date DATETIME NOT NULL,
	time TIME NOT NULL,
	notification_type VARCHAR(5) NOT NULL,
	description VARCHAR(3000),
	whatsapp BIT DEFAULT 0,
	email BIT DEFAULT 0,
	sms BIT DEFAULT 0,
	sent BIT DEFAULT 0,
	creation_date DATETIME NOT NULL,
	deleted BIT DEFAULT 0,
	deleted_date DATETIME
);