"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = close;
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const ticket_bot_transcript_uploader_1 = require("ticket-bot-transcript-uploader");
const zlib_1 = __importDefault(require("zlib"));
const logs_1 = require("./logs");
async function close(interaction, client, reason, deleteTicket = false) {
    let domain = "https://m.ticket.pm/";
    if (!interaction.channel || interaction.channel.type !== discord_js_1.ChannelType.GuildText)
        return await interaction.reply({
            content: "This command can only be used in a ticket channel.",
            ephemeral: true
        });
    if (!client.config.closeOption.createTranscript)
        domain = client.locales.getSubValue("other", "unavailable");
    const ticket = await client.prisma.tickets.findUnique({
        where: {
            channelid: interaction.channel.id
        }
    });
    const ticketClosed = ticket?.closedat && ticket.closedby;
    if (!ticket)
        return interaction.editReply({ content: "Ticket not found" }).catch((e) => console.log(e));
    // @TODO: Breaking change refactor happens here as well..
    const ticketType = ticket ? JSON.parse(ticket.category) : undefined;
    if (client.config.closeOption.whoCanCloseTicket === "STAFFONLY" &&
        !interaction.member?.roles.cache.some((r) => client.config.rolesWhoHaveAccessToTheTickets.includes(r.id) || ticketType?.staffRoles?.includes(r.id)))
        return interaction
            .editReply({
            content: client.locales.getValue("ticketOnlyClosableByStaff")
        })
            .catch((e) => console.log(e));
    if (ticketClosed)
        return interaction
            .editReply({
            content: client.locales.getValue("ticketAlreadyClosed")
        })
            .catch((e) => console.log(e));
    (0, logs_1.log)({
        LogType: "ticketClose",
        user: interaction.user,
        ticketId: ticket.id,
        ticketChannelId: interaction.channel.id,
        ticketCreatedAt: ticket.createdat,
        reason: reason
    }, client);
    // Normally the user that closes the ticket will get posted here, but we'll do it when the ticket finalizes
    const creator = ticket.creator;
    const invited = JSON.parse(ticket.invited);
    interaction.channel.permissionOverwrites
        .edit(creator, {
        ViewChannel: false
    })
        .catch((e) => console.log(e));
    invited.forEach(async (user) => {
        interaction.channel?.permissionOverwrites
            .edit(user, {
            ViewChannel: false
        });
    });
    interaction
        .editReply({
        content: client.locales.getValue("ticketCreatingTranscript")
    })
        .catch((e) => console.log(e));
    async function _close(id, ticket) {
        if (client.config.closeOption.closeTicketCategoryId)
            interaction.channel?.setParent(client.config.closeOption.closeTicketCategoryId).catch((e) => console.log(e));
        const msg = await interaction.channel?.messages.fetch(ticket.messageid);
        const embed = new discord_js_1.EmbedBuilder(msg?.embeds[0].data);
        const rowAction = new discord_js_1.ActionRowBuilder();
        msg?.components[0]?.components?.map((x) => {
            if (x.type !== discord_js_1.ComponentType.Button)
                return;
            const builder = new discord_js_1.ButtonBuilder(x.data);
            if (x.customId === "close")
                builder.setDisabled(true);
            if (x.customId === "close_askReason")
                builder.setDisabled(true);
            rowAction.addComponents(builder);
        });
        msg
            ?.edit({
            content: msg.content,
            embeds: [embed],
            components: [rowAction]
        })
            .catch((e) => console.log(e));
        // Workaround for type handling, rewrite should not follow this.
        if (interaction.channel && interaction.channel.type !== discord_js_1.ChannelType.GuildText)
            throw Error("Close util used in a non-text channel");
        if (client.config.closeOption.createTranscript) {
            interaction.channel
                ?.send({
                content: client.locales
                    .getValue("ticketTranscriptCreated")
                    .replace("TRANSCRIPTURL", domain === client.locales.getSubValue("other", "unavailable") ? client.locales.getSubValue("other", "unavailable") : `<${domain}${id}>`)
            })
                .catch((e) => console.log(e));
        }
        ticket = await client.prisma.tickets.update({
            data: {
                closedby: interaction.user.id,
                closedat: Date.now(),
                closereason: reason,
                transcript: domain === client.locales.getSubValue("other", "unavailable") ? client.locales.getSubValue("other", "unavailable") : `${domain}${id}`
            },
            where: {
                channelid: interaction.channel?.id
            }
        });
        const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId("deleteTicket")
            .setLabel(client.locales.getSubValue("other", "deleteTicketButtonMSG"))
            .setStyle(discord_js_1.ButtonStyle.Danger)
            .setDisabled(deleteTicket));
        const locale = client.locales;
        interaction.channel
            ?.send({
            embeds: [
                JSON.parse(JSON.stringify(locale.getSubRawValue("embeds", "ticketClosed"))
                    .replace("TICKETCOUNT", ticket.id.toString())
                    .replace("REASON", (ticket.closereason ?? client.locales.getSubValue("other", "noReasonGiven")).replace(/[\n\r]/g, "\\n"))
                    .replace("CLOSERNAME", interaction.user.tag))
            ],
            components: client.config.closeOption.closeTicketCategoryId ? [] : [row]
        })
            .catch((e) => console.log(e));
        if (deleteTicket) {
            (0, logs_1.log)({
                LogType: "ticketDelete",
                user: interaction.user,
                ticketId: ticket.id,
                ticketCreatedAt: ticket.createdat,
                transcriptURL: ticket.transcript ?? undefined
            }, client);
            interaction.channel?.send({
                content: client.locales.getSubValue("embeds", "ticketClosed", "deleteTicketInfo")
            });
            setTimeout(() => interaction.channel?.delete().catch((e) => console.log(e)), 15000); // ticket will be deleted within 15 seconds
        }
        if (!client.config.closeOption.dmUser)
            return;
        const footer = locale.getSubValue("embeds", "ticketClosedDM", "footer", "text");
        const ticketClosedDMEmbed = new discord_js_1.EmbedBuilder({
            color: 0
        })
            .setColor(locale.getNoErrorSubValue("embeds", "ticketClosedDM", "color") ?? client.config.mainColor)
            .setDescription(client.locales
            .getSubValue("embeds", "ticketClosedDM", "description")
            .replace("TICKETCOUNT", ticket.id.toString())
            .replace("TRANSCRIPTURL", `${domain}${id}`)
            .replace("REASON", ticket.closereason ?? client.locales.getSubValue("other", "noReasonGiven"))
            .replace("CLOSERNAME", interaction.user.tag))
            .setFooter({
            text: footer,
            iconURL: locale.getNoErrorSubValue("embeds", "ticketClosedDM", "footer", "iconUrl")
        });
        client.users.fetch(creator).then((user) => {
            user
                .send({
                embeds: [ticketClosedDMEmbed]
            })
                .catch((e) => console.log(e));
        });
    }
    if (!client.config.closeOption.createTranscript) {
        _close("", ticket);
        return;
    }
    async function fetchAll() {
        const collArray = [];
        let lastID = interaction.channel?.lastMessageId;
        if (!lastID)
            return new discord_js_1.Collection();
        // Fetch the last message first to include it
        const lastMsg = await interaction.channel?.messages.fetch(lastID).catch(() => null);
        if (lastMsg) {
            const initialColl = new discord_js_1.Collection();
            initialColl.set(lastMsg.id, lastMsg);
            collArray.push(initialColl);
        }
        while (true) {
            const fetched = await interaction.channel?.messages.fetch({ limit: 100, before: lastID });
            if (!fetched || fetched.size === 0)
                break;
            collArray.push(fetched);
            lastID = fetched.last()?.id;
            if (fetched.size < 100)
                break;
        }
        if (collArray.length === 0)
            return new discord_js_1.Collection();
        return collArray[0].concat(...collArray.slice(1));
    }
    const messages = await fetchAll().catch(() => new discord_js_1.Collection());
    const premiumKey = "";
    try {
        const messagesJSON = await (0, ticket_bot_transcript_uploader_1.generateMessages)(messages, premiumKey, "https://m.ticket.pm");
        zlib_1.default.gzip(JSON.stringify(messagesJSON), async (err, compressed) => {
            if (err) {
                console.error("Zlib Error:", err);
                _close("", ticket);
            }
            else {
                const ts = await axios_1.default
                    .post(`${domain}upload?key=${premiumKey}&uuid=${client.config.uuidType}`, JSON.stringify(compressed), {
                    headers: { "Content-Type": "application/json" },
                    timeout: 5000 // 5 seconds timeout
                })
                    .catch((e) => {
                    console.error("Transcript Upload Error:", e.message);
                    return null;
                });
                _close(ts?.data ?? "", ticket);
            }
        });
    }
    catch (e) {
        console.error("Transcript Generation Error:", e);
        _close("", ticket);
    }
}
/*
Copyright 2026 BADKET
*/
//# sourceMappingURL=close.js.map