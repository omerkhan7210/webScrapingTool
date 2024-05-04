const puppeteer = require('puppeteer');
const ExcelJS = require('exceljs');
const fs = require('fs');
const https = require('https');
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Sheet1');
const XLSX = require('xlsx');

const extractHTMLContent = async (page) => {

    const htmlContent = await page.evaluate(async () => {
        const div = document.querySelectorAll('.border-b.border-gray-200.mb-8.pb-8')[1];
        const nameElement = div.querySelector('h3');
        const updatedInfoElement = div.querySelector('p:nth-of-type(1)');
        const fddYearInfoElement = div.querySelector('p:nth-of-type(2)');
        const usernameElement = div.querySelector('ul > li:nth-of-type(1)');
        const phoneElement = div.querySelector('ul > li:nth-of-type(2)');
        const emailElement = div.querySelector('ul > li:nth-of-type(3) > button');
        const websiteElement = div.querySelector('ul > li:nth-of-type(4) > a');
        const addressElement = div.querySelector('ul > li:nth-of-type(5)');

        // Check if elements are not undefined before accessing text content
        const name = nameElement?.textContent?.trim() || '';
        const updatedInfo = updatedInfoElement?.textContent?.trim() || '';
        const fddYearInfo = fddYearInfoElement?.textContent?.trim() || '';
        const username = usernameElement?.textContent?.trim() || '';
        const phone = phoneElement?.textContent?.trim() || '';
        const email = emailElement?.textContent?.trim() || '';
        const website = websiteElement?.textContent?.trim() || '';
        const address = addressElement?.textContent?.trim() || '';

        const avgresponsetimeText = document.querySelector('.border-b.border-gray-200.mb-8.pb-8>span')

        const smallDescText = document.querySelector('.items-center.justify-between.py-4>div>p')

        let SmallContentArray = document.querySelectorAll('.entry-content>div')

        let smallDesc = smallDescText ? smallDescText.textContent : ''
        let avgresponsetime = avgresponsetimeText ? avgresponsetimeText.textContent : ''
        let category = ''
        let franchisedUnits = ''
        let OwnedUnits = ''
        let ProjectedNewUnits = ''
        let YearEstablished = ''
        let TypeofBusiness = ''
        let NumberofEmployees = ''
        let Territories = ''
        let Liquidity = ''
        let InvestmentRange = ''
        let MinimumNetWorth = ''
        let MonthCash = ''
        let FranchiseFee = ''
        let Royalty = ''
        let RoyaltyDescription = ''
        let Advertising = ''
        let NationalAdvertising = ''
        let RampUp = ''
        let PassiveOwnership = ''
        let Item19 = ''
        let Single = ''
        let Multiple = ''
        let AreaRepresentativeMasterDeveloper = ''
        let AvailableDiscount = ''

        SmallContentArray.forEach((franchisedUnitsText) => {

            if(franchisedUnitsText.children.length>0){
                category = franchisedUnitsText.children[1].children[0].textContent
            
            const textArray = franchisedUnitsText.children[2].querySelectorAll('p')
            textArray.forEach((text) => {
                const value = text.textContent
                if (value.includes('Franchised Units')) {
                    franchisedUnits = value
                } else if (value.includes('Owned Units')) {
                    OwnedUnits = value
                } else if (value.includes('Projected New Units')) {
                    ProjectedNewUnits = value
                } else if (value.includes('Year Established')) {
                    YearEstablished = value
                } else if (value.includes('Type of Business')) {
                    TypeofBusiness = value
                } else if (value.includes('Number of Employees')) {
                    NumberofEmployees = value
                }
            })

            //territories
            const territoriestextArray = franchisedUnitsText.children[3].querySelectorAll('p')
            territoriestextArray.forEach((text) => {
                const value = text.textContent
                if (value.includes('Territories')) {
                    Territories = value
                }
            })

            //financials
            const financialstextArray = franchisedUnitsText.children[4].querySelectorAll('p')
            financialstextArray.forEach((text) => {
                const value = text.textContent
                if (value.includes('Liquidity')) {
                    Liquidity = value
                } else if (value.includes('Investment Range')) {
                    InvestmentRange = value
                } else if (value.includes('Minimum Net Worth')) {
                    MinimumNetWorth = value
                } else if (value.includes('6 Month Cash')) {
                    MonthCash = value
                } else if (value.includes('Franchise Fee')) {
                    FranchiseFee = value
                } else if (value.includes('Royalty') && !value.includes('Description')) {
                    Royalty = value
                } else if (value.includes('Royalty Description')) {
                    RoyaltyDescription = value
                } else if (value.includes('Advertising') && !value.includes('National')) {
                    Advertising = value
                } else if (value.includes('National Advertising')) {
                    NationalAdvertising = value
                } else if (value.includes('Ramp-Up')) {
                    RampUp = value
                } else if (value.includes('Passive Ownership')) {
                    PassiveOwnership = value
                } else if (value.includes('Item 19')) {
                    Item19 = value
                } else if (value.includes('Single')) {
                    Single = value
                } else if (value.includes('Multiple')) {
                    Multiple = value
                } else if (value.includes('Area Representative/Master Developer')) {
                    AreaRepresentativeMasterDeveloper = value
                }
            })

            const financialsulArray = franchisedUnitsText.children[4].querySelectorAll('ul')
            financialsulArray.forEach((ul) => {
                if (ul.previousElementSibling && ul.previousElementSibling.tagName === 'H2') {
                    if (ul.previousElementSibling.textContent === 'Available Discounts') {
                        AvailableDiscount = ul.querySelector('li').textContent
                    }

                }

            })

        }
        })



        const flattenedObject = {
            name,
            smallDesc,
            updatedInfo,
            fddYearInfo,
            category,
            username,
            phone,
            email,
            website,
            address,
            imgUrl: `images/${name.replace(/[^\w-]/g, '')}.png`,
            avgresponsetime,
            franchisedUnits,
            OwnedUnits,
            ProjectedNewUnits,
            YearEstablished,
            TypeofBusiness,
            NumberofEmployees,
            Territories,
            Liquidity,
            InvestmentRange,
            MinimumNetWorth,
            MonthCash,
            FranchiseFee,
            Royalty,
            RoyaltyDescription,
            Advertising,
            NationalAdvertising,
            RampUp,
            PassiveOwnership,
            Item19,
            Single,
            Multiple,
            AreaRepresentativeMasterDeveloper,
            AvailableDiscount,
            //entryContentHtml
        };


        // Return the extracted data
        return flattenedObject;
    });


    return htmlContent;
};

const getListingContent = async (page) => {
    const htmlContent = await extractHTMLContent(page);

// Load the existing workbook
workbook.xlsx.readFile('allListingsDetails.xlsx')
    .then(() => {
        // Select the first worksheet
        const worksheet = workbook.getWorksheet(1);

        const keys = Object.keys(htmlContent);

        // Create an array of values from the htmlContent object
        const values = keys.map(key => htmlContent[key]);

        // Add a row with data to the worksheet
        worksheet.addRow(values);

        // Save the workbook to the file
        return workbook.xlsx.writeFile('allListingsDetails.xlsx');
    })
    .then(() => {
        console.log('Rows appended to Excel file successfully.');
    })
    .catch(err => {
        console.error('Error appending rows to Excel file:', err);
    });
}


const main = async () => {
    const browser = await puppeteer.connect(
        {
            browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/48ce12d4-ed37-4944-92e1-560815865d1c'
        }
    );
    const page = await browser.newPage();


    //here goes the url for the page
    const url = 'https://fbamembers.com/profile/your-choice-senior-care/'
        await page.goto(url, {
            waitUntil: 'networkidle0'
        });

        await page.waitForSelector('.entry-content');
        await getListingContent(page)

   
}

main()


