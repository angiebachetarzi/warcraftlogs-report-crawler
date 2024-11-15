const {getAbilitiesByBossId} = require('./helpers');
const parseArgs = require('./argsHandler')
const puppeteer = require('puppeteer')
const fs = require('fs');
const path = require('path');

const argv = parseArgs()

const abilities = getAbilitiesByBossId(argv.bossId)

const downloadReport = async () => {

    // Specify a download path
    const downloadPath = path.resolve(argv.downloadLocation);
    
    // Ensure download directory exists
    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath)
    }

    //const bossId = await getBossId()

    const browser = await puppeteer.launch({
        headless: false, //no need to have chromium open
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()

    const client = await page.createCDPSession()


    // Set the download behavior
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath
    });

    //dl damage taken by ability


    const dlBtn = '#main-table-0_wrapper > div > button';
    //loop over number of boss' abilities
    for(let numberOfDl=0; numberOfDl<=(abilities.length-1); numberOfDl++){

        //This is to rename the files that already exist
        //This is done because the downloaded file from the URL for one ability has always the same name

        // list all files in the folder
        fs.readdir(downloadPath, (err, files) => {
            if (err) {
            console.error('Error on opening of file :', err);
            return;
            }
        
            var fileToRename = files[0] //Choose the first file from the list
            
            if (fileToRename == '.DS_Store') {fileToRename=files[1]}
            if (fileToRename) {
            //get old file and prepare the new name
            //format: oldFileName_number.csv
            const oldFilePath = path.join(downloadPath, fileToRename);
            const parsed = path.parse(oldFilePath);
            const newFileName = `${parsed.name}_${numberOfDl}${parsed.ext}`; // Par exemple, ajouter "_renamed"
            const newFilePath = path.join(downloadPath, newFileName);
        
            //Rename the file
            fs.rename(oldFilePath, newFilePath, (err) => {
                if (err) {
                console.error('Error on renaming the file :', err);
                } else {
                console.log(`New file name is : ${newFilePath}`);
                }
            });
            } else {
            console.log('Files not found in folder!');
            }
        });

        //Parse download URL
        const URL = `https://www.warcraftlogs.com/reports/${argv.reportId}#boss=${argv.bossId}&difficulty=5&type=damage-taken&ability=${abilities[numberOfDl]}`
        await page.goto(URL, {
            waitUntil: 'domcontentloaded', // Ensure the page loads the DOM fully before continuing
            timeout: 0 // Optional: sets an unlimited timeout (adjust if necessary)
        });
    
        // in case of consent window opens too fast
        if (numberOfDl==0){
            const consentBtn = 'body > div.fc-consent-root > div.fc-dialog-container > div.fc-dialog.fc-choice-dialog > div.fc-footer-buttons-container > div.fc-footer-buttons > button.fc-button.fc-cta-consent.fc-primary-button'
            await page.waitForSelector(consentBtn, { visible: true });
            await page.click(consentBtn);
        }
    
        await page.waitForSelector(dlBtn, { visible: true });
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        await page.click(dlBtn);

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Partial taken damage download complete!');
    }

    //dl damage done
    const URL = `https://www.warcraftlogs.com/reports/${argv.reportId}#boss=${argv.bossId}&difficulty=5&type=damage-done`
    await page.goto(URL, {
        waitUntil: 'domcontentloaded', // Ensure the page loads the DOM fully before continuing
        timeout: 0 // Optional: sets an unlimited timeout (adjust if necessary)
    });
    
    await page.waitForSelector(dlBtn, { visible: true });
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    await page.click(dlBtn);

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Done damage download complete!');

    await browser.close();
    console.log('Full download complete!');
    // Close the browser after your task is done
};

downloadReport().catch(console.error);
