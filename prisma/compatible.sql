/*
Copyright 2026 BADKET
*/


/*
this will be used for
* openTicketMessageId
* ticketCount
*/

CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT
);

/*
this will be used for storing tickets
*/

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    channelid TEXT NOT NULL UNIQUE,
    messageid TEXT NOT NULL UNIQUE,
    category LONGTEXT NOT NULL,
    invited TEXT NOT NULL DEFAULT '[]',
    reason TEXT NOT NULL,
    creator TEXT NOT NULL,
    createdat BIGINT NOT NULL,
    claimedby TEXT,
    claimedat BIGINT,
    closedby TEXT,
    closedat BIGINT,
    closereason TEXT,
    transcript TEXT
);
