import {readConfig, setUser} from './config.js';

function main() {
    setUser('Umair');
    const config = readConfig();
    console.log(config);
    
}

main();