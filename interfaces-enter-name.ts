
/* Program to try to understand interfaces */

interface PersonInfo {

    // First name and last name are optional

    // Since sometimes you give your name which isn't always your first or last name.
    FirstName?: string;
    LastName?: string;

    // Name is also optional since you give first and last name above sometimes.
    name?: string;

    age: number;

    // If you give your firstname or name that you go by, you obviously don't need to give your full name.
    FullName?(FirstName: string, LastName: string): string;
}

// The class that implents the interface above and function.
class Person implements PersonInfo {

    FirstName?: string;
    LastName?: string;

    name?: string;

    age: number;

    // Function is defined as optional since you don't give your first or last name.
    FullName?(FirstName: string | undefined , LastName: string | undefined): string {
        let FinalName = "";

        // Check if undefined and return accordingly.
        if( FirstName != undefined && LastName != undefined ) {
            FinalName = FirstName + ' ' + LastName; // Concat first and last name.
            return FinalName;
        } else {
            return FinalName;
        }
    
    }


    // This is now documentation. I'm not deleting it.
    /*constructor(age: number, name?: string, FirstName?: string, LastName?: string) {
        this.name = name;
        this.age = age; 

        this.FirstName = FirstName;
        this.LastName = LastName;

        this.FullName?.(FirstName, LastName);
    }*/

        // The constructor takes the interface PersonInfo as input.
        constructor(data: PersonInfo) {

            // variable name is assigned either name, full name, or first name depending on the data passed.
            this.name = data.name || this.FullName?.(data.FirstName, data.LastName) || data.FirstName;
            this.age = data.age;
    
            // Assign first and last name.
            this.FirstName = data.FirstName;
            this.LastName = data.LastName;
    
        }
}

// Function to print info according to the data returned.
// This was created to avoid having to copy the same code more than once.
function PrintInfo(person: Person): void {

    // Check if person's name is defined or not and check the length as well.
    if ( person.name != undefined && person.name.length != 0 && person.name != " " ) {
        console.log(`Hey there, ${person.name}`);
    } else {
        console.log(`Name invalid. Please enter name`);
    }

    // Check the age of person to make sure it is greater than 0.
    if ( person.age > 0 ) {

        if ( person.name != undefined && person.name.length != 0 && person.name != " " ) {
            // Outputs blank for variable 'person.name' if no person name is given
            console.log(`${person.name} is ${person.age}\n`);
        } else {
            console.log(`They're ${person.age}\n`);
        }

    } else {
        console.log(`Please enter an age greater than 0\n`);
    }
}

function main(): void {
    const objects1: PersonInfo = {
        age: 30, 
        name: "Alex",
    };

    const person1 = new Person(objects1);

    PrintInfo(person1);

    const objects2: PersonInfo = {
        age: 30, 
        FirstName: "Jack",
        LastName: "Smith",
    };

    const person2 = new Person(objects2);

    PrintInfo(person2);

    const objects3: PersonInfo = {
        age: 30, 
        FirstName: "Sam",
    };

    const person3 = new Person(objects3);

    PrintInfo(person3);

    const objects4: PersonInfo = {
        age: -1, // Throws error that is handled in PrintInfo()
        FirstName: "Sam",
    };

    const person4 = new Person(objects4);

    PrintInfo(person4);

    const objects5: PersonInfo = {
        age: 15, 
        FirstName: "", // Throws error that is handled in PrintInfo()
    };

    const person5 = new Person(objects5);

    PrintInfo(person5);

    const objects6: PersonInfo = {
        age: 15, 
        name: "Alex",
    };

    const person6 = new Person(objects6);

    PrintInfo(person6);

    const objects7: PersonInfo = {
        age: -1, 
        name: "Alex",
    };

    const person7 = new Person(objects7);

    PrintInfo(person7);

    const objects8: PersonInfo = {
        age: 0, 
        name: " ",
    };

    const person8 = new Person(objects8);

    PrintInfo(person8);

    const objects9: PersonInfo = {
        age: 0, 
        name: "Max",
    };

    const person9 = new Person(objects9);

    PrintInfo(person9);

    const objects10: PersonInfo = {
        age: 21, 
        LastName: "Smith",
    };

    const person10 = new Person(objects10);

    PrintInfo(person10);

}

try {
    main();
} catch(err) {
    console.log(err);
}