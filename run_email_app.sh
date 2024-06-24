#!/bin/bash

export $(grep -v '^#' /Users/victoriaraya/desktop/coding/personal_projects/email_deleter_imap/.env | xargs)

/usr/local/bin/node /Users/victoriaraya/desktop/coding/personal_projects/email_deleter_imap/index.js
