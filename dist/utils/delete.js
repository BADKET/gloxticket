"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicket = void 0;
const discord_js_1 = require("discord.js");
const logs_1 = require("./logs");
const deleteTicket = async (interaction, client) => {
    if (!interaction.channel || interaction.channel.type !== discord_js_1.ChannelType.GuildText)
        return await interaction.reply({
            content: "This command can only be used in a ticket channel.",
            ephemeral: true
        });
    const ticket = await client.prisma.tickets.findUnique({
        where: {
            channelid: interaction.channel.id
        }
    });
    if (!ticket)
        return await interaction.reply({ content: "Ticket not found", ephemeral: true });
    (0, logs_1.log)({
        LogType: "ticketDelete",
        user: interaction.user,
        ticketId: ticket.id,
        ticketCreatedAt: ticket.createdat,
        transcriptURL: ticket.transcript ?? undefined,
    }, client);
    await interaction.deferUpdate();
    await interaction.channel.delete();
};
exports.deleteTicket = deleteTicket;
/*
Copyright 2026 BADKET
*/
//# sourceMappingURL=delete.js.map