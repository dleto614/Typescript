/* One of the programs to practice working with an API */

import * as fs from 'fs';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

import { Dropbox, Error, files } from 'dropbox';

const dbx = new Dropbox({ 
    clientId: 'APP_KEY',
    clientSecret: 'APP_SECRET',
    refreshToken: 'REFRESH_TOKEN'
});

const rl = readline.createInterface({ input, output });
  
async function GetFile(): Promise<string> {
    const answer = await rl.question('File to upload? ');

    return answer;

}

async function main(dbx: Dropbox): Promise<void> {

        let file = await GetFile();

        if ( file.length != 0 ) {
            UploadFile(dbx, file);

            rl.close();
        } else {
            console.log("Please enter a file!");
            rl.close();
        }
}

function UploadFile(dbx: Dropbox, file: string): void {
    fs.readFile(file, (err, contents) => {
        if (err) {
            console.log('Error: ', err);
            return;
        }
        
        // This uploads the file to the root of your dropbox
        dbx.filesUpload({ path: '/' + file, contents })
            .then((response: any) => {
                console.log(response);
                
                dbx.filesListFolder({ path: '' })
                    .then((response: any) => {
                        //console.log(response);

                        // Get all the files
                        let entries = response.result.entries;

                        console.log(entries);
                    })
                    .catch((err: any) => {
                    console.log(err);
                });

            })
            .catch((UploadError: Error<files.UploadError>) => {
                console.log(UploadError);
                return;
            });
        });

}

(async() => {
    await main(dbx).catch(console.error);

    console.log("Listing folder");
})();
