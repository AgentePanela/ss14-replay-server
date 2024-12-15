import fs from 'fs';
import path from 'path';

interface SSLConfig {
    active: boolean
    private: string;
    certificate: string;
}

//todo: make a info interface

interface Config {
    port: number;
    serverName: string;
    serverIp: string,
    discord: string,
    githubLink: string,
    replayDir: string;
    ssl: SSLConfig;
}

const configPath = path.join(__dirname, '../config.json');

const defaultConfig: Config = {
    port: 1414,
    serverName: "myServer",
    serverIp: "ss14://<ip>:1212",
    replayDir: '<your-server-dir>/replays',
    discord: "<your-discord-invite-link>",
    githubLink: "<your-github-link>",
    ssl: {
        active: false,
        private: '/etc/letsencrypt/live/<your-domain>/privkey.pem',
        certificate: '/etc/letsencrypt/live/<your-domain>/fullchain.pem'
    }
};

class ConfigManager {
    private config: Config;

    constructor() {
        this.config = this.setupConfig(); // verify if exist or no
    }

    private setupConfig(): Config {
        if (fs.existsSync(configPath)) {
            const configData = fs.readFileSync(configPath, 'utf8');
            return JSON.parse(configData);
        } else {
            console.log('Cannot found config file...');
            this.createConfig();
            return defaultConfig;
        }
    }

    // create a new config file
    private createConfig(): void {
        fs.mkdirSync(path.dirname(configPath), { recursive: true }); // Cria a pasta 'config' se não existir
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
        console.log('Generating new config file, please setup before running the server again!');
    }

    public getConfig(): Config {
        return this.config;
    }


    public updateConfig(newConfig: Config): void {
        this.config = newConfig;
        fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2), 'utf8');
    }
}

export const configManager = new ConfigManager();