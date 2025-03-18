import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({ input, output });
  
async function GetName(): Promise<string> {
    const answer = await rl.question('Who are you? ');
    
    return answer;

}

async function main(): Promise<void> {

        const name = await GetName();

        if ( name.length != 0 ) {
            console.log(`Hey there, ${name}!`);
            rl.close();
        } else {
            console.log(`Please enter in a name!`);
            rl.close();
        }

}

(async () => {
    await main().catch(console.error);
})();
