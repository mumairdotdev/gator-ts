import fs from 'fs';
import os from 'os';
import path from 'path';

const repopath = 'workspace/boot.dev/blog-aggregator-ts';
const fileName = '.gatorconfig.json'

export type Config = {
    dbUrl: string
    currentUserName: string
}

export function setUser(userName: string) {
    const config = readConfig();
    config.currentUserName = userName;
    writeConfig(config);
}

export function readConfig(): Config {
    const configFilePath = getConfigFilePath();
    if (!fs.existsSync(configFilePath)) {
        throw new Error(`Config file not found at ${configFilePath}`);
    }

    const configContent = fs.readFileSync(configFilePath, 'utf-8');
    
    const rawConfig = JSON.parse(configContent);
    
    return validateConfig(rawConfig);
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), repopath, fileName);
}

function writeConfig(config: Config): void {
    const configFilePath = getConfigFilePath();
    
    const rawConfig = {
        db_url: config.dbUrl,
        current_user_name: config.currentUserName
    };
    
    fs.writeFileSync(configFilePath, JSON.stringify(rawConfig, null, 2), 'utf-8');
}
    
function validateConfig(rawConfig: any): Config {
    if (!rawConfig.db_url || typeof rawConfig.db_url !== 'string') {
        throw new Error('Invalid config: dbUrl is required');
    }
    const config: Config = {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name ?? ''
    };
    return config;
}