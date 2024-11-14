
const parseArgs = require('./argsHandler')
const puppeteer = require('puppeteer')
const fs = require('fs');
const path = require('path');
//const getBossId = require('./apiCall')
const abilities2902 = [436217,439502,443842] //Dans l'ordre : Charge mastodonte, Toile de traqueur, Ténèbres angloutissantes

const argv = parseArgs()

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


    /*
    // Extraire le nom du fichier
    const fileName = path.basename(downloadPath);  // "document.txt"

    // Maintenant, ajoute un suffixe si nécessaire pour éviter d'écraser le fichier
    let filePath = path.join(__dirname, fileName);
    let counter = 1;
    while (fs.existsSync(filePath)) {
    const newFileName = `${path.parse(fileName).name}(${counter})${path.extname(fileName)}`;
    filePath = path.join(__dirname, newFileName);
    counter++;
    }

    console.log(`Le fichier sera téléchargé sous : ${filePath}`);
    */

    


    // Set the download behavior
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath
    });

    let abilityId = abilities2902[0];

    switch (argv.bossName) {
        case "2902":
          abilityId = abilities2902[0];
          break;
        case "0000":
          abilityId = abilities0000[0];
          break;
        default:
          console.log("bossName incorrect");
      }

    // Navigate to the URL
    for(let numberOfDl=0; numberOfDl<=(abilities2902.length-1); numberOfDl++){

        // Lister tous les fichiers dans le dossier
        fs.readdir(downloadPath, (err, files) => {
            if (err) {
            console.error('Erreur lors de la lecture du dossier :', err);
            return;
            }
        
            // Filtrer le fichier que tu veux renommer
            const fileToRename = files[0] // Choisi le premier fichier de la liste
        
            if (fileToRename) {
            // Définir l'ancien et le nouveau chemin du fichier
            const oldFilePath = path.join(downloadPath, fileToRename);
            const parsed = path.parse(oldFilePath);
            const newFileName = `${parsed.name}_${numberOfDl+1}${parsed.ext}`; // Par exemple, ajouter "_renamed"
            const newFilePath = path.join(downloadPath, newFileName);
        
            // Renommer le fichier
            fs.rename(oldFilePath, newFilePath, (err) => {
                if (err) {
                console.error('Erreur lors du renommage du fichier :', err);
                } else {
                console.log(`Le fichier a été renommé en : ${newFilePath}`);
                }
            });
            } else {
            console.log('Le fichier spécifié n\'a pas été trouvé.');
            }
        });
        





        const URL = `https://www.warcraftlogs.com/reports/${argv.reportId}#boss=${argv.bossName}&difficulty=5&type=damage-taken&ability=${abilities2902[numberOfDl]}`
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
    
        const dlBtn = '#main-table-0_wrapper > div > button'
    
        await page.waitForSelector(dlBtn, { visible: true });
        
        await page.click(dlBtn);
    
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('Partial download complete!');
    }

    // Wait until a file appears in the download directory
 /*    let fileDownloaded = false;
    while (!fileDownloaded) {
        const files = fs.readdirSync(downloadPath);
        if (files.length > 1) { //not counting the .DS_Store file
        fileDownloaded = true;
        } else {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 1 second before checking again
        }
    } */
    await browser.close();
    console.log('Full download complete!');
    // Close the browser after your task is done
};

downloadReport().catch(console.error);
