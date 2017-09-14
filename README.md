
# Problems found

This [LINK](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04#step-six-—-test-log-in) sums up the steps to launch a server, and explains also how to set up a firewall. Protecting mongo is explained on the mongodb install tutorial.

## Setup the server

I used this great youtube tutorial and modified it to generate ssh keys directly from the terminal with :

[link](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)

[link](https://www.youtube.com/watch?v=RE2PLyFqCzE&t=1234s)

## Add the local project to github

Here is to migrate the repo from local to distant.

[link](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/)

Also, I used Vi to copy the server's ssh key for github access

    vi myfile.txt

To save the file and quit vi, you would press ESC, ESC the colon key ':' then wq (write, quit) or :x to just quit

## Enable Swap

I stumbled across a problem when I npm installed : pug install crashed.
After a research here is what I did :

[link](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-16-04)

## Install MongoDB

I followed this link's instructions

[link](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04)

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

I followed [this link](https://tecadmin.net/change-mongodb-default-data-path/#)

## Troubles with mongo?

Just modify `session store` in keystone, because nobody likes these types of warnings :

    Warning: connect.session() MemoryStore is not
    designed for a production environment, as it will leak
    memory, and will not scale past a single process.

[Keystone link](http://keystonejs.com/docs/configuration/#options-database)

# Kill a process by name

To kill a process by name, first list it :

    ps aux

And then kill (for node) :

    pkill -9 node

# Give the safe user permission to listen on port 80 (can launch `pm2 start` but it is not available outside)

    sudo apt-get install libcap2-bin
    sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``

# Simple ufw (firewall) setup commands (use **80/tcp** for nodejs ap access)

    ufw status
    ufw reload
    ufw enable
    ufw disable
    ufw allow 80/tcp
    sudo ufw delete allow 8080

