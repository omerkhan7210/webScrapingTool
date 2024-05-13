const ExcelJS = require('exceljs');

// Define a function to add brands to the Excel sheet for matching products
async function addBrandsToExcel() {
   
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    // Load the existing workbook from the file
    await workbook.xlsx.readFile('products_export_lavapor link fix 041924.xlsx');

    // Get the specified worksheet
    const worksheet = workbook.getWorksheet('products_export_lavapor link fi');

    // Iterate over the products array
    products.forEach((product, rowIndex) => {
        // Check if the product exists in productsWithBrandsArray
        const index = productsWithBrands.findIndex((item) => item === product);
        // If a match is found, add the corresponding brand to the Excel sheet
        if (index !== -1) {
            const brand = brands[index];
            // Write the brand to the next column in the corresponding row
            worksheet.getCell(`C${rowIndex + 1}`).value = brand;
        }
    });

    // Save the workbook back to the file
    await workbook.xlsx.writeFile('products_export_lavapor link fix 041924.xlsx');
    console.log('Brands added to Excel sheet for matching products successfully.');
}

// Call the function to add brands to the Excel sheet for matching products
addBrandsToExcel();
