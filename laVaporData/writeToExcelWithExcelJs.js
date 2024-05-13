const ExcelJS = require('exceljs');

async function writeToExcelWithExcelJs(data) {
    // Load the existing workbook from the file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('product_data.xlsx');
    const worksheet = workbook.getWorksheet('Products');

    // Iterate over the data and add them to the worksheet
    data.forEach((item) => {
        const brand = item.brand;
        const productNames = item.productNames;
        productNames.forEach((productName) => {
            worksheet.addRow([brand, productName]);
        });
    });

    // Save the workbook back to the file
    await workbook.xlsx.writeFile('product_data.xlsx');
    console.log('Data appended to Excel file successfully.');
}

module.exports = writeToExcelWithExcelJs;
