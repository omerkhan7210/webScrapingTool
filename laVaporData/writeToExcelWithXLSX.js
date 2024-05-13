const XLSX = require('xlsx');
const fs = require('fs');

async function writeToExcelMatchingData(data, sheetname) {
    console.log(data)
      const filename = `${sheetname}.xlsx`;
        if (!fs.existsSync(filename)) {
            // Create a new workbook if the file doesn't exist
            const newWorkbook = XLSX.utils.book_new();
            const newWorksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetname);
            XLSX.writeFile(newWorkbook, filename, { compression: true });
        }

        // Read the existing workbook from the file
        const existingWorkbook = XLSX.readFile(filename);
        const existingSheetName = existingWorkbook.SheetNames[0]; // Assuming there's only one sheet in the workbook
        const existingWorksheet = existingWorkbook.Sheets[existingSheetName];

        // Convert the new data to a worksheet
        const newWorksheet = XLSX.utils.json_to_sheet(data);

        // Append the new data to the existing worksheet
        const appendedWorksheet = XLSX.utils.book_append_sheet(existingWorkbook, newWorksheet, existingSheetName);

        // Write the modified workbook back to the file
        XLSX.writeFile(appendedWorksheet, filename, { compression: true });

        console.log('Data appended to Excel file successfully.');
   
}

module.exports = writeToExcelMatchingData;
