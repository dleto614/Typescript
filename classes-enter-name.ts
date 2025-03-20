import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({ input, output });

class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

async function GetAge(): Promise<number> {
    const age: number = parseInt(await rl.question('What is your age? '));

    return age;
}

async function GetName(): Promise<string> {
    const name: string = await rl.question('What is your name? ');

    return name;
}

async function main(): Promise<void> {

    const name = await GetName();
    const age = await GetAge();

    rl.close();

    const person = new Person(name, age);

    if ( person.name.length != 0 ) {
        console.log(`Hey there, ${person.name}`);
    } else {
        console.log(`Name invalid. Please enter name`);
    }

    if ( person.age > 0 ) {
        // Outputs blank for variable 'person.name' if no person name is given
        console.log(`${person.name} is ${person.age}`);
    } else {
        console.log(`Please enter an age greater than 0`);
    }
}

(async () => {
    await main().catch(console.error);
})();
