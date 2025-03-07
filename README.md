# telegram-mentoring-bot

Profile builder to match with mantors/mentees

 - [Installation](#installation)
 - [Usage](#usage)


## Installation

1. Clone the repository
```bash	
git clone https://github.com/mohnate/telegram-mentoring-bot
```

2. Move to the project directory
```bash	
cd telegram-mentoring-bot
```

3. Install the dependencies
```bash
  npm install
```

4. Copy the `.env.local.example` file to `.env.local` and fill the values
```bash
cp .env.local.example .env.local
```

5. Create a new bot on Telegram and get the token
https://telegram.me/BotFather

6. Update the `.env.local` file with the token

7. Optional: customize the [config files](config/README.md)


8. Start the server
```bash
npm start
```

## Usage
Start a new chat with the bot. The bot will ask you to fill your profile. Once you have filled your profile, you can start matching with mentors/mentees.
```bash
/start
```

Mentors will receive a notification when they have a match. They can accept or refuse the match.
Mentees will receive a notification when a mentor has accepted a match, and other pending matches will be canceled.

As an admin, you can use the following commands:
```bash
/whitelist_mentor telegram_username
/whitelist_mentor remove_mentor_from_whitelist
```
The whistelist guarantees that only the users in the whitelist can be mentors.
