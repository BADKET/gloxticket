"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeAskReason = void 0;
const discord_js_1 = require("discord.js");
/*
Copyright 2026 BADKET
*/
const closeAskReason = async (interaction, client, deleteTicket = false) => {
    // @TODO: Breaking change refactor happens here as well..
    const ticket = await client.prisma.tickets.findUnique({
        where: {
            channelid: interaction.channel?.id,
        },
    });
    const ticketType = ticket ? JSON.parse(ticket.category) : undefined;
    if (client.config.closeOption.whoCanCloseTicket === "STAFFONLY" &&
        !interaction.member?.roles.cache.some((r) => client.config.rolesWhoHaveAccessToTheTickets.includes(r.id) || ticketType?.staffRoles?.includes(r.id)))
        return interaction
            .reply({
            content: client.locales.getValue("ticketOnlyClosableByStaff"),
            ephemeral: true,
        })
            .catch((e) => console.log(e));
    const modal = new discord_js_1.ModalBuilder().setCustomId(!deleteTicket ? "askReasonClose" : "askReasonDelete").setTitle(client.locales.getSubValue("modals", "reasonTicketClose", "title"));
    const input = new discord_js_1.TextInputBuilder()
        .setCustomId("reason")
        .setLabel(client.locales.getSubValue("modals", "reasonTicketClose", "label"))
        .setStyle(discord_js_1.TextInputStyle.Paragraph)
        .setPlaceholder(client.locales.getSubValue("modals", "reasonTicketClose", "placeholder"))
        .setMaxLength(256);
    const firstActionRow = new discord_js_1.ActionRowBuilder().addComponents(input);
    modal.addComponents(firstActionRow);
    await interaction.showModal(modal).catch((e) => console.log(e));
};
exports.closeAskReason = closeAskReason;
/*
Copyright 2026 BADKET
*/
//# sourceMappingURL=close_askReason.js.map