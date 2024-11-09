const keys = require('../keys')
const axios = require('axios')
const parseArgs = require('./argsHandler')
const filterTab = require('./helpers')
const puppeteer = require('puppeteer')


const argv = parseArgs()

const getBossId = async () => {
    const reportGeneralInfo = await axios.get(`https://www.warcraftlogs.com:443/v1/report/fights/${argv.reportId}?api_key=${keys.access_key}`);
    return filterTab(reportGeneralInfo.data.fights, 'name', 'boss', argv.bossName)
}

//TODO: assert bossId is not null else throw error
const bossId = getBossId()

// Launch the browser and open a new blank page
const browser = await puppeteer.launch();
const page = await browser.newPage();

// Navigate the page to a URL.
await page.goto(`https://www.warcraftlogs.com/reports/${argv.reportId}#boss=${bossId}&difficulty=5&type=${argv.reportType}`);