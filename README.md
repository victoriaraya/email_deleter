# Autonomous Email Deleter

## Description

This is a node script I wrote utilizing node-imap to delete emails from specific senders through IMAP. This was inspired by the many spam emails I receive a day from questionable senders, emails that I did not want to open and click any links from. Setting up a cronjob to run this script once a day has freed me from the annoying task of manually deleting 20+ emails everyday.

In building this project I learnt alot about IMAP, properly managing async tasks, and setting up a cron job considering env variables and permissions successfully.

More information on node-imap [here](https://github.com/mscdex/node-imap)

## Installation

### Clone this repository

    git clone https://github.com/victoriaraya/email_deleter.git

### Install dependencies

    npm install

### Create .env file

You can name your variables based on your email provider, depending on your provider you may have to create a secure mail key specifically for your app instead of using your normal password, this can be done through your provider

    ATT_USERNAME='your-email-here'
    ATT_PASSWORD='your-password-here'

### Change addresses value

Adjust the addresses array to include the senders you wish to delete emails from. List senders in string format.

    const addresses = [ 'sender-1-here', 'sender-2-here', ]

### Run the app

    <path-to-app>/run_email_app.sh

### Set up cron job

To ensure proper permissions (for Mac), you may have to add Terminal and cron to Full Disk Access in System Preferences (through Security & Privacy). In this example, the script will be run everyday at 10 am and 2 pm.

    crontab -e
    0 10,14 * * * <path-to-app>/run_email_app.sh

## Contributing

If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.
