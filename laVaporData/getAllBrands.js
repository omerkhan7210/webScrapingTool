const getAllBrands = async (page) => {

    const htmlContent = await page.evaluate(async () => {

        const productTitles = document.querySelectorAll('.product-title>a');
        const productTitlesArray = Array.from(productTitles).map(title => title.textContent.trim());

        return productTitlesArray
        

    })

    return htmlContent

}

module.exports = getAllBrands;
