const puppeteer = require('puppeteer');
//const getListings = require('./getAllListings');
//const getListingContent = require('./getAllListingsData');
//const columnData = require('./columnDataExtraction');
const getAllBrands = require('./laVaporData/getAllBrands');
const columnDataExtraction = require('./columnDataExtraction');
const fs = require('fs');
const writeToExcelWithExcelJs = require('./laVaporData/writeToExcelWithExcelJs');
const writeToExcelMatchingData = require('./laVaporData/writeToExcelWithXLSX');


const getLaVaporData = async (page)=>{
    
    const listItems = await page.evaluate(() => {
        const allListItems = document.querySelectorAll(".facets__disclosure")[2].querySelectorAll("li");
        const listItemsText = Array.from(allListItems).map(item => item.textContent.trim());
        return listItemsText;
    });

    for (let index = 0; index < listItems.length; index++) {
        const brand = listItems[index];
        await page.goto(`https://lavaporwholesale.com/collections/nicotine-freebase?filter.v.price.gte=&filter.v.price.lte=&filter.p.m.custom.brand_name=${brand}&sort_by=created-descending`, {
            waitUntil: 'networkidle0'
        });

        const productNames = await getAllBrands(page)
        writeToExcelWithExcelJs([{
            brand,
            productNames
        }])

    }
}

const matchLaVaporData = async (page)=>{
    const collectionName = await page.evaluate(() => {
        return document.querySelectorAll(".heading span")[1].textContent.toLowerCase().replace(/\s/g, '');
    })
    const productsWithBrands = await columnDataExtraction('product_data.xlsx', 'Products', 'B');
    const brands =await  columnDataExtraction('product_data.xlsx', 'Products', 'A');
    // Create an array to store products with brands
    const productsWithBrandsArray = [];

    // Iterate over the productsWithBrands array
    productsWithBrands.forEach((product, index) => {
        // Create an object to store the product and its corresponding brand
        const productWithBrand = {
            productName: product,
            brand: brands[index]
        };
        // Push the object to the productsWithBrandsArray
        productsWithBrandsArray.push(productWithBrand);
    });

    
// Read the content of the JSON file synchronously
const jsonData = fs.readFileSync('filtered_products_with_brands.json', 'utf-8');

// Parse the JSON data to JavaScript objects
const products = JSON.parse(jsonData);
const matchedProducts = []

// Iterate over each product in the products JSON
products.forEach((product) => {

    // Find the matching product in productsWithBrandsArray
    const matchingProduct = productsWithBrandsArray.find((item) => item.productName === product.Title);
    // If a matching product is found, add the brand information to the product JSON
    
    if (matchingProduct) {
        product.Tags = matchingProduct.brand;
        matchedProducts.push(product)
    }
});
writeToExcelMatchingData(matchedProducts,collectionName)
}



const main = async () => {
    const browser = await puppeteer.connect(
        {
            browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/45126e46-f8e0-4a03-af66-743f80274601',
            
        }
    );
    
    const page = await browser.newPage();

    await page.setViewport({
        width: 1920,
        height: 1080,
      });
    //here goes the url for the page
    //const url = 'https://fbamembers.com/franlink-system/'

    //for (let index = 273; index < columnData.length; index++) {
    // await page.goto(columnData[index], {
    //     waitUntil: 'networkidle0'
    // });

    await page.goto(`https://lavaporwholesale.com/collections/nicotine-freebase`, {
        waitUntil: 'networkidle0'
    });
    await page.waitForSelector('.dropdown-menu .dropdown-item');

   
    //await getListingContent(page)
    //}

    //await getListings(page)



    // LAVAPOR
    await getLaVaporData(page)
    await matchLaVaporData(page)
   

}

main()


