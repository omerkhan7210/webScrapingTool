
const ExcelJS = require('exceljs');
async function writeToExcel(data) {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('EXCTENDED FLS');

    // Iterate over the array of objects and add them to the worksheet
    data.forEach((obj) => {
        const rowData = [obj.url, obj.listingName, obj.listingFee, obj.listingInvestment, obj.listingUnits];
        worksheet.addRow(rowData);
    });

    // Save the workbook to a file
    await workbook.xlsx.writeFile('extendedfls.xlsx');
    console.log('Excel file created successfully.');
}
module.exports = writeToExcel