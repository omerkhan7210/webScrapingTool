const puppeteer = require('puppeteer');

const extractHTMLContent = async (page) => {

    
    const browser = await puppeteer.connect(
        { 
        browserWSEndpoint:'ws://127.0.0.1:9222/devtools/browser/143ea9e0-743f-4141-b0b0-9411d27b865b'
        }
    );
    const page = await browser.newPage();


   
    await page.goto('https://fbamembers.com/franlink-system/',{
        waitUntil: 'networkidle0'
    });
    await page.waitForSelector('.bg-light-gold');


    const htmlContent = await page.evaluate(() => {
        // let accordianData = {};
        // let text = [];
        // let lis = [];
        // const extractTextFromDivs = (div,currentHeading ) => {
        //     // Iterate over child nodes of the div
        //     div.childNodes.forEach(node => {
        //          // Check if the child node is a text node
        //         if (node.tagName === 'H3' || node.tagName === 'H2') {
        //             if (currentHeading) {
        //                 accordianData[currentHeading] = text;
        //             }
        //             currentHeading = node.textContent.trim();
        //             text = [];
        //             lis = []
        //         }
        //         if (node.tagName === 'P') {
        //             text.push(node.textContent.trim());
        //         }
        //         else if(node.tagName === 'OL'){
        //             node.childNodes.forEach((li)=>{
        //                 lis.push(li.textContent.trim())
        //             })
        //             text.push(lis)
        //         } 
        //         else if (node.tagName === 'DIV') {
        //             // Recursively extract text content from nested divs
        //             extractTextFromDivs(node );
        //         }
        //     });

        //     if (currentHeading) {
                
        //         accordianData[currentHeading] = text;
        //     }

        //     return accordianData
        // };

        // const getTabsContent = (contentDiv) => {
        //     const tabsContent = {};
        //     let currentHeading = '';
        //     let currentParagraphs = [];

        //     contentDiv.childNodes.forEach(node => {
        //         if (node.tagName === 'H2') {
        //             if (currentHeading) {
        //                 tabsContent[currentHeading] = currentParagraphs;
        //             }
        //             currentHeading = node.textContent.trim();
        //             currentParagraphs = [];
        //         } else if (node.tagName === 'P') {
        //             currentParagraphs.push(node.textContent.trim());
        //         } else if (node.tagName === 'UL') {
        //             const listItems = Array.from(node.querySelectorAll('li')).map(li => li.textContent.trim());
        //             currentParagraphs.push(listItems);
        //         }
        //     });

        //     if (currentHeading) {
        //         tabsContent[currentHeading] = currentParagraphs;
        //     }

        //     return tabsContent;
        // };

        // const getAccordianData = (accordianDiv)=>{
        //     let accordianDataFinal = {};
        //     let currentHeading = ''
        //     accordianDiv.childNodes.forEach(async (node) => {

        //         if (node.tagName === 'DIV') {
        //             accordianDataFinal =  extractTextFromDivs(node,currentHeading);
        //         }
        //         });


        //     return accordianDataFinal

        // }

        const contentDiv = document.querySelector('.entry-content .mb-6');
        const tabs = document.querySelectorAll('.entry-content > div > ul > li');
        const links = document.querySelectorAll('.bg-light-gold');
        
        // const data = {};

        // // Extract tabs content
        // const tabsContent = Array.from(tabs).map(tab => tab.textContent);
        // data.tabsContent = tabsContent;

        // // Extract tabs content
        // const mainContent = getTabsContent(contentDiv);
        // data.mainContent = mainContent;

        // const accordianDataContent =  Array.from(accordianDivs).map(accordianDiv =>  getAccordianData(accordianDiv))
        // data.accordianData = accordianDataContent;
        links.forEach(link=> {
           const url = link.getAttribute('href')
           await page.goto('https://fbamembers.com/franlink-system/',{
                waitUntil: 'networkidle0'
            });
            await page.waitForSelector('.bg-light-gold');
        })
        //return data;
    });

    return htmlContent;
};


const htmlContent = await extractHTMLContent(page);


