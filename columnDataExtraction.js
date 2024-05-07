const XLSX = require('xlsx');

const workbook = XLSX.readFile('extendedfls.xlsx');
const sheetName = 'EXTENDED FLS'; // Change the sheet name as per your Excel file
const columnToExtract = 'A'; // Change the column letter as per your requirement

const worksheet = workbook.Sheets[sheetName];
const range = XLSX.utils.decode_range(worksheet['!ref']);
const columnData = [];

for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
    const cellAddress = { c: XLSX.utils.decode_col(columnToExtract), r: rowNum };
    const cellRef = XLSX.utils.encode_cell(cellAddress);
    const cell = worksheet[cellRef];
    if (cell && cell.v) {
        columnData.push(cell.v);
    }
}
module.exports = columnData