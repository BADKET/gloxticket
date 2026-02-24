# Ticket Bot

![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16.9.0-green.svg)
![License](https://img.shields.io/badge/License-Apache--2.0-yellow.svg)

An advanced ticket system for Discord servers, built with Discord.js v14 and TypeScript.

## 📝 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Docker Setup](#-docker-setup)
- [Commands](#-commands)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)

## 📖 About

This bot provides a comprehensive ticket system for Discord servers. It allows users to create support requests through a simple interface, and enables staff members to manage these tickets efficiently. The bot is highly customizable and supports multiple languages.

## ✨ Features

- **🎟️ Customizable Ticket Categories:** Create multiple ticket types for different topics (e.g., technical support, partner applications, user reports).
- **🙋‍♂️ Ticket Claiming:** Staff members can claim a ticket to notify users and other staff that the ticket is being handled.
- **🔒 Secure Ticket Closing:** Tickets can be closed by staff or the ticket creator.
- **📜 Transcript Generation:** Automatically generates an HTML transcript for each closed ticket, which is sent to a log channel for archival.
- **👥 Collaborative Support:** Add or remove other server members from a ticket for collaborative problem-solving.
- **✏️ Ticket Renaming:** Easily rename ticket channels for better organization.
- **🌐 Multi-Language Support:** The bot can be configured to use different languages.
- **⚙️ Flexible Configuration:** All settings are managed through a clear and detailed `config.jsonc` file.
- **🪵 Detailed Logging:** All ticket-related actions are recorded in a designated log channel.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/en/) (v16.9.0 or higher)
- npm (included with Node.js)
- [Docker](https://www.docker.com/) (optional, for Docker-based setup)

## 🚀 Installation

1.  **Download Project Files:** Clone the repository to your local machine:
    ```bash
    git clone https://github.com/BADKET/Ticket-Bot.git
    cd Ticket-Bot
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Create `.env` File:** Create a `.env` file in the root directory and add your Discord bot token:
    ```
    TOKEN=YOUR_DISCORD_BOT_TOKEN
    ```

4.  **Configure the Bot:**
    - In the `config` directory, rename `config.example.jsonc` to `config.jsonc`.
    - Open `config.jsonc` and customize the settings according to your server's needs (e.g., `guildId`, channel IDs, roles).

5.  **Set Up Database:** The project uses Prisma for database management. The following command will set up the database schema:
    ```bash
    npx prisma db push
    ```

6.  **Build the Project:** Compile the TypeScript code to JavaScript:
    ```bash
    npm run build
    ```

7.  **Start the Bot:**
    ```bash
    npm start
    ```
The bot should now be online and ready to use!

## 🐳 Docker Setup

You can also run the bot using Docker and Docker Compose for a more isolated and manageable setup.

1.  **Prerequisites:** Make sure you have Docker and Docker Compose installed.

2.  **Configuration:**
    - Complete steps 3 and 4 from the standard installation to set up your `.env` and `config.jsonc` files.
    - The `docker-compose.yml` is pre-configured to use a PostgreSQL database. You can customize the database credentials in the `docker-compose.yml` file.

3.  **Build and Run:**
    ```bash
    docker-compose up --build -d
    ```
This will build the Docker image and start the bot and the database in the background.

## 🤖 Commands

The bot uses Discord's slash commands. Here are the available commands:

| Command     | Description                             |
|-------------|-----------------------------------------|
| `/add`      | Add a user to the current ticket.       |
| `/claim`    | Claim the current ticket.               |
| `/close`    | Close the current ticket.               |
| `/remove`   | Remove a user from the current ticket.  |
| `/rename`   | Rename the current ticket.              |
| `/massadd`  | Add multiple users to a ticket.         |
| `/cleardm`  | Clear the bot's DM history with you.    |

## ⚙️ Configuration

The `config/config.jsonc` file contains all the settings for the bot. Here's a brief overview of the main options:

- `guildId`: Your Discord server's ID.
- `openTicketChannelId`: The ID of the channel where users can create new tickets.
- `logChannelId`: The channel where ticket logs (transcripts, actions) will be sent.
- `rolesWhoHaveAccessToTheTickets`: An array of role IDs that have access to all tickets.
- `ticketCategories`: An array of objects, where each object defines a ticket category with its own settings (e.g., name, emoji, staff roles).
- `closeOption`: Settings related to closing tickets (e.g., `whoCanCloseTicket`, `askReason`).

Make sure to review the comments in the `config.example.jsonc` file for a detailed explanation of each option.

## 🙌 Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug fixes, feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/BADKET/Ticket-Bot).

## 📄 License

This project is licensed under the Apache-2.0 License. See the `LICENSE.md` file for more details.
