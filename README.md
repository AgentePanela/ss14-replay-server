# SS14 Replay Server
A simple Node JS server to list replays files
![image](https://github.com/user-attachments/assets/f5e60b50-b437-4260-8db5-539599e847ac)

## How setup?

> [!TIP]
> You must have Node JS installed.

1. Clone the repository
`git clone https://github.com/AgentePanela/ss14-replay-server.git`

2. Install dependencies
`npm i` or `npm install` 

3. Run the server and be happy
`npm start` 

> [!WARNING]
> Remember to configurate the cofig.json after running the server for the first time.

### For Nginx users
For who want have mental health, i made the config file for the website:
> For ssl useers:
```
server {
    listen 443 ssl;

    ssl_certificate <certificate path>;
    ssl_certificate_key <private key path>;

    server_name <sub-domain>.<domain>;

    location / {
        proxy_pass https://<sub-domain>.<domain>:<port - the default is 1414>/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
