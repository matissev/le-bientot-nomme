
# Problems found

## Setup the server

I used this great youtube tutorial and modified it to generate ssh keys directly from the terminal with :

[link](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)

[link](https://www.youtube.com/watch?v=RE2PLyFqCzE&t=1234s)

## Add the local project to github

Here is to migrate the repo from local to distant.

[link](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/)

Also, I used Vi to copy the server's ssh key for github access

    vi myfile.txt

To save the file and quit vi, you would press ESC, ESC the colon key ':' then wq (write, quit)

## Enable Swap

I stumbled across a problem when I npm installed : pug install crashed.
After a research here is what I did :

https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-16-04

## Install MongoDB

I followed this link's instructions

(link)[https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04]

## Stop the droplet

    sudo poweroff

## Install sendmail for mail transport (just like php mail)

This will enable nodemailer to send mail trough sendmail

    If sendmail isn't installed, install it: sudo apt-get install sendmail
    Configure /etc/hosts file: nano /etc/hosts
    Make sure the line looks like this: 127.0.0.1 localhost yourhostname
    Run Sendmail's config and answer 'Y' to everything: sudo sendmailconfig
    Restart apache sudo service apache2 restart

## Change mongoDB path

I followed (this link)[https://tecadmin.net/change-mongodb-default-data-path/#]