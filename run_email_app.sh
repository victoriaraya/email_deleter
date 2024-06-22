#!/bin/bash

export PATH='/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin' #check if i need this line or not

export $(grep -v '^#' /Users/victoriaraya/desktop/coding/personal_projects/email_deleter_imap/.env | xargs)

/usr/local/bin/node /Users/victoriaraya/desktop/coding/personal_projects/email_deleter_imap/index.js
