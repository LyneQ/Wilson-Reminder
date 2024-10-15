# Discord Reminder Bot

A Discord bot that sends check-in and check-out reminders to a specified channel using cron jobs.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/LyneQ/Wilson-Reminder
    cd discord-reminder-bot
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

## Configuration

1. Create a `.env` file in the root directory of the project and add your Discord bot token, guild ID, channel ID, and checking URL:
    ```dotenv
    BOT_TOKEN=your_bot_token
    BOT_ID=your_bot_id
    GUILD_ID=your_guild_id
    CHECKING_CHANNEL_ID=your_channel_id
    CHECKING_URL=your_checking_url
    MENTION_ROLE_ID=
    ```

2. Alternatively, you can use the provided `.env.example` file as a template:
    ```sh
    cp .env.example .env
    ```

## Usage

1. Start the bot:
    ```sh
    npm start
    ```

2. The bot will log in and start sending reminders based on the configured cron jobs.

## Features

- **Automated Reminders**: Sends check-in and check-out reminders at specified times.
- **Cron Job Scheduling**: Uses `node-cron` to schedule reminders.
- **Dynamic Messages**: Sends and edits messages to indicate the start and end of check-in/check-out periods.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
