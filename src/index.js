
const parseArgs = require('./argsHandler')
const puppeteer = require('puppeteer')
const fs = require('fs');
const path = require('path');
const getBossId = require('./apiCall')


const argv = parseArgs()

const downloadReport = async () => {

    // Specify a download path
    const downloadPath = path.resolve(argv.downloadLocation);
    
    // Ensure download directory exists
    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath)
    }

    const bossId = await getBossId()

    const browser = await puppeteer.launch({
        headless: true, //no need to have chromium open
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()

    const client = await page.createCDPSession()

    // Set the download behavior
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath
    });

    // Navigate to the URL
    const URL = `https://www.warcraftlogs.com/reports/${argv.reportId}#boss=${bossId}&difficulty=5&type=${argv.reportType}`
    await page.goto(URL, {
        waitUntil: 'domcontentloaded', // Ensure the page loads the DOM fully before continuing
        timeout: 0 // Optional: sets an unlimited timeout (adjust if necessary)
    });

    // Wait for the button to be available in the DOM
    await page.waitForSelector('#main-table-0_wrapper > div > button', { visible: true });
    await page.click('#main-table-0_wrapper > div > button');

    // Wait until a file appears in the download directory
    let fileDownloaded = false;
    while (!fileDownloaded) {
        const files = fs.readdirSync(downloadPath);
        if (files.length > 1) { //not counting the .DS_Store file
        fileDownloaded = true;
        } else {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 1 second before checking again
        }
    }

    console.log('Download complete!');

    // Close the browser after your task is done
    await browser.close();
};

downloadReport().catch(console.error);
