# warcraftlogs-report-crawler

This is a simple crawler to get a CSV file about an all encounters with a boss from a previously generated report using the Warcraftlogs client and addon.

This crawler uses the [REST API of Warcraftlogs]('https://www.warcraftlogs.com/v1/docs')

To set up this API, a Warcraftlogs account needs to be created, and linked to a Battle.net account that includes WoW characters.

The client key can be created on the settings page, after creating a client.

## Steps to run the crawler

1. Download [NodeJS]('https://nodejs.org/en/download/prebuilt-installer') and [Yarn]('https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable')

2. Clone the project
````
git clone <project_url>
````

3. Create an .env file following the .env.example file and add the access key of the client
4. Run the command to update the node modules
````
yarn
````
5. Run the application
````
yarn start -r <reportID> -b <bossId> -d <downloadPath>
````

## Notes

Details about the arguments can be listed with the following command
```
yarn start --help
````
The folder where the file is to be downloaded needs to be empty prior to the download
