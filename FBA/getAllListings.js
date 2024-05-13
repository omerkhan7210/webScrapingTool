const writeToExcel = require("./writeToExcel");
 const getListings = async (page)=>{
    await page.click('xpath=//*[@id="vs5__combobox"]/div[1]/input');

    const htmlContent = await page.evaluate(async () => {
        
         // Modify this XPath expression to match the third list item based on your HTML structure
        const xpath = '(//ul[@id="vs5__listbox"]/li)[3]';
        const thirdListItem =  document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if(thirdListItem){
            await thirdListItem.click()
        }
         await new Promise(resolve => setTimeout(resolve, 15000));

        try {
            const getAllListings = async () => {
                const linkObjects = [];
                const links = document.querySelectorAll('#pagination-header a.p-4');
                links.forEach((link) => {
                    const url = link.getAttribute('href');
                    const listingName = link.children[0].textContent;
                    const listingSubDetails = link.children[1].children;
                    const listingFee = listingSubDetails[0].textContent;
                    const listingInvestment = listingSubDetails[1].textContent;
                    const listingUnits = listingSubDetails[2] ? listingSubDetails[2].textContent : 'NULL';
    
                    if (url) {
                        linkObjects.push({
                            url: url,
                            listingName: listingName,
                            listingFee: listingFee,
                            listingInvestment: listingInvestment,
                            listingUnits: listingUnits,
                        });
                    }
                });
                return linkObjects;
            };
    
            const isNextPageButtonDisabled = () => {
                const nextPageButton = document.querySelectorAll('#pagination-header button')[1];
                return nextPageButton.disabled;
            };
    
            const data = []; // Create a Set to store unique objects
            const listings = await getAllListings(); // Extract listings from the current page
            data.push(...listings);
    
            while (!isNextPageButtonDisabled()) {
                const nextPageButton = document.querySelectorAll('#pagination-header button')[1];
                nextPageButton.click(); // Click on the next page button
                await new Promise(resolve => setTimeout(resolve, 6000)); // Wait for a moment
                const listings = await getAllListings(); // Extract listings from the next page
                data.push(...listings);
            }
            const listings2 = await getAllListings(); // Extract listings from the current page
            data.push(...listings2);
            return data;
        } catch (error) {
            console.error('Error in page evaluation:', error);
            throw error;
        }
    });
    writeToExcel(htmlContent)
 }
 
module.exports = getListings;
