/* One of the program to practice working with an API */

import * as fs from 'fs';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

import { Dropbox, DropboxResponseError, Error, files } from 'dropbox';

const dbx = new Dropbox({ 
    clientId: 'APP_KEY',
    clientSecret: 'APP_SECRET',
    refreshToken: 'REFRESH_TOKEN'
});

const rl = readline.createInterface({ input, output });
  
async function ListFiles(): Promise<any> {

    try {
        let response = await dbx.filesListFolder({ path: '' });
        let entries = response.result.entries;

        return entries;
    } catch(err) {
        throw new Error(err);
    }
}


async function GetFile(): Promise<string> {

    const answer = await rl.question('File to download? ');

    return answer;

}

async function main(dbx: Dropbox): Promise<any> {

        try {
            let entries = await ListFiles()

            console.log("Listing the files currently in the dropbox:");
            
            for ( let i = 0; i < entries.length; i++ ) {
                console.log(entries[i].name);
            }

            let file = await GetFile();

            if ( file.length != 0 ) {
                await DownloadFile(dbx, file);
                rl.close();
            } else {
                console.log('Please enter a file!');
                rl.close();
            }
        } catch(err) {
            console.log(err.message);
            rl.close();
        }

}

async function DownloadFile(dbx: Dropbox, file: string): Promise<void> {

        // This downloads the file to your local storage
        await dbx.filesDownload({ path: '/' + file })
            .then((response: any) => {
                console.log("Response returned:\n", response);
        
                //var FileName = response.result.name;
                console.log("Writing file on disk to file:", response.result.name);

                fs.writeFile(response.result.name, response.result.fileBinary, { encoding: 'binary' }, (err) => {
                    if (err) {
                        console.log("Error in writing to file:\n", err);
                    } else {
                        console.log("File written successfully\n");
                    }
                });

            })
            .catch((DownloadError: Error<files.DownloadError>) => {
                console.log(DownloadError);
            });
}

(async() => {
    await main(dbx).catch(console.error);
})();
