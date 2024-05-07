const puppeteer = require('puppeteer');
const  getListings = require('./getAllListings');
const getListingContent = require('./getAllListingsData');
const columnData = require('./columnDataExtraction');

const main = async () => {
    const browser = await puppeteer.connect(
        {
            browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/9fd65832-9d14-47b7-92d2-1f865c1eba1c'
        }
    );
    const page = await browser.newPage();

   
    
    //here goes the url for the page
    //const url = 'https://fbamembers.com/franlink-system/'

    //for (let index = 273; index < columnData.length; index++) {
        await page.goto(columnData[index], {
            waitUntil: 'networkidle0'
        });
        
        await page.waitForSelector('.entry-content');
        await getListingContent(page)
    //}
      

        //await getListings(page)
        
  
   
}

main()


