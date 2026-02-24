"use strict";
/*
Copyright 2026 BADKET (github.com/BADKET)
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const node_path_1 = __importDefault(require("node:path"));
const discord_js_1 = require("discord.js");
const jsonc_1 = require("jsonc");
const dotenv_1 = require("dotenv");
const structure_1 = require("./structure");
// Initalize .env file as environment
try {
    (0, dotenv_1.config)();
}
catch {
    console.log(".env failed to load");
}
// Although invalid type, it should be good enough for now until more stuff needs to be handled here
process.on("unhandledRejection", (reason, promise, a) => {
    console.error(reason, promise, a);
});
process.on("uncaughtException", (err) => {
    console.error(err);
});
process.stdout.write(`
\x1b[38;2;143;110;250m████████╗██╗ ██████╗██╗  ██╗███████╗████████╗    ██████╗  ██████╗ ████████╗
\x1b[38;2;157;101;254m╚══██╔══╝██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝    ██╔══██╗██╔═══██╗╚══██╔══╝
\x1b[38;2;172;90;255m   ██║   ██║██║     █████╔╝ █████╗     ██║       ██████╔╝██║   ██║   ██║   
\x1b[38;2;188;76;255m   ██║   ██║██║     ██╔═██╗ ██╔══╝     ██║       ██╔══██╗██║   ██║   ██║   
\x1b[38;2;205;54;255m   ██║   ██║╚██████╗██║  ██╗███████╗   ██║       ██████╔╝╚██████╔╝   ██║   
\x1b[38;2;222;0;255m   ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝       ╚═════╝  ╚═════╝    ╚═╝\x1b[0m
                 https://github.com/BADKET

Connecting to Discord...
`);
const config = jsonc_1.jsonc.parse(fs_extra_1.default.readFileSync(node_path_1.default.join(__dirname, "/../config/config.jsonc"), "utf8"));
const client = new structure_1.ExtendedClient({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent, discord_js_1.GatewayIntentBits.GuildMembers],
    presence: {
        status: config.status?.status ?? "online"
    }
}, config);
// Login the bot
const token = process.env["TOKEN"];
if (!token || token.trim() === "")
    throw new Error("TOKEN Environment Not Found");
client.login(process.env["TOKEN"]).then(null);
// HTTP server for UptimeRobot keep-alive pings
const http_1 = __importDefault(require("http"));
const PORT = process.env["PORT"] ?? 3000;
http_1.default.createServer((req, res) => {
    res.writeHead(200);
    res.end("Glox Ticket Bot is running!");
}).listen(PORT, () => {
    console.log(`✅ Keep-alive server running on port ${PORT}`);
});
/*
Copyright 2026 BADKET (github.com/BADKET)
*/
//# sourceMappingURL=index.js.map