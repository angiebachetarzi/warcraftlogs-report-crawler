const keys = require('../keys')
const axios = require('axios')
const filterTab = require('./helpers')
const parseArgs = require('./argsHandler')

const getBossId = async () => {
    const argv = parseArgs()

    try {
        const reportGeneralInfo = await axios.get(`https://www.warcraftlogs.com:443/v1/report/fights/${argv.reportId}?api_key=${keys.access_key}`);

        // Check if the necessary data exists in the response
        if (!reportGeneralInfo || !reportGeneralInfo.data || !reportGeneralInfo.data.fights) {
            throw new Error('Invalid data structure received from the API.');
        }

        // Filter the fights to find the boss id
        const bossId = filterTab(reportGeneralInfo.data.fights, 'name', 'boss', argv.bossId);

        // If no bossId is found, throw an error
        if (!bossId) {
            throw new Error(`Boss "${argv.bossId}" not found in the report.`);
        }

        return bossId;

    } catch (error) {
        // Handle specific errors
        if (error.response) {
            // This is an HTTP error (e.g., 404, 500)
            console.error(`HTTP error occurred: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
            // The request was made, but no response was received
            console.error('No response received from API:', error.request);
        } else {
            // Something else went wrong
            console.error('Error:', error.message);
        }

        //Throw the error again to propagate it
        throw new Error('Failed to fetch boss ID');
    }
}

module.exports = getBossId