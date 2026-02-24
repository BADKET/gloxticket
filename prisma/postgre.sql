/*
Copyright 2026 BADKET
*/



/*
this will be used for
* openTicketMessageId
* ticketCount
*/

CREATE TABLE IF NOT EXISTS config (
    key VARCHAR(256) PRIMARY KEY,
    value LONGTEXT
);

/*
this will be used for storing tickets
*/

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    channelid TEXT NOT NULL UNIQUE,
    messageid TEXT NOT NULL UNIQUE,
    category JSON NOT NULL,
    reason TEXT NOT NULL,
    creator TEXT NOT NULL,
    createdat TIMESTAMP NOT NULL DEFAULT NOW(),
    claimedby TEXT,
    claimedat TIMESTAMP,
    closedby TEXT,
    closedat TIMESTAMP,
    closereason TEXT,
    transcript TEXT
);

/*
this will be used to handle ticket invites
*/

CREATE TABLE IF NOT EXISTS invites (
    id SERIAL PRIMARY KEY,
    ticketid TEXT NOT NULL,
    userid TEXT NOT NULL,
	CONSTRAINT FK_ticketID FOREIGN KEY(ticketid) REFERENCES tickets(messageid) ON DELETE CASCADE
);
