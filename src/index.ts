/*
Copyright 2026 BADKET (github.com/BADKET)
*/

import fs from "fs-extra";
import path from "node:path";
import http from "http";
import { GatewayIntentBits } from "discord.js";
import { jsonc } from "jsonc";
import { config as envconf } from "dotenv";
import { ConfigType, ExtendedClient } from "./structure";

// Initalize .env file as environment
try { envconf(); }
catch { console.log(".env failed to load"); }

// Although invalid type, it should be good enough for now until more stuff needs to be handled here
process.on("unhandledRejection", (reason: string, promise: string, a: string) => {
	console.error(reason, promise, a);
});

process.on("uncaughtException", (err: string) => {
	console.error(err);
});

process.stdout.write(`
\x1b[38;2;143;110;250m████████╗██╗ ██████╗██╗  ██╗███████╗████████╗    ██████╗  ██████╗ ████████╗
\x1b[38;2;157;101;254m╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝    ██╔══██╗██╔═══██╗╚══██╔══╝
\x1b[38;2;172;90;255m   ██║   ██║██║     █████╔╝ █████╗     ██║       ██████╔╝██║   ██║   ██║   
\x1b[38;2;188;76;255m   ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║       ██╔══██╗██║   ██║   ██║   
\x1b[38;2;205;54;255m   ██║   ██║╚██████╗██║  ██╗███████╗   ██║       ██████╔╝╚██████╔╝   ██║   
\x1b[38;2;222;0;255m   ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝       ╚═════╝  ╚═════╝    ╚═╝\x1b[0m
                 https://discord.gg/fQUYJ4JXck
Connecting to Discord...
`);

const config: ConfigType = jsonc.parse(fs.readFileSync(path.join(__dirname, "/../config/config.jsonc"), "utf8"));

const client = new ExtendedClient({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
	presence: {
		status: config.status?.status ?? "online"
	}
}, config);

// HTTP server for UptimeRobot keep-alive pings (must bind port for Render)
const PORT = parseInt(process.env["PORT"] ?? "3000");
http.createServer((req, res) => {
	res.writeHead(200);
	res.end("Glox Ticket Bot is running!");
}).listen(PORT, "0.0.0.0", () => {
	console.log(`✅ Keep-alive server running on port ${PORT}`);
});

// Login the bot
const token = process.env["TOKEN"];
if (!token || token.trim() === "")
	throw new Error("TOKEN Environment Not Found");
client.login(process.env["TOKEN"]).then(null);

/*
Copyright 2026 BADKET (github.com/BADKET)
*/
