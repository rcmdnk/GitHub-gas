function getSheet(name, cols=[], col_widths=[], formatA='0') {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  let max_rows = sheet.getMaxRows();
  if(max_rows > 1){
    sheet.deleteRows(1, max_rows-1);
  }
  let max_columns = sheet.getMaxColumns();
  if(max_columns > 1){
    sheet.deleteColumns(1, max_columns-1);
  }
  if(col_widths){
  }
  cols.forEach(function(c, i) {
    sheet.getRange(1, i+1).setValue(c);
    if(i < col_widths.length){
      sheet.setColumnWidth(i+1, col_widths[i]);
    }
  });
  sheet.getRange('A:A').setNumberFormat(formatA);
  // Need additional row to froze the row
  sheet.insertRowsAfter(1, 1);
  sheet.setFrozenRows(1);
  return sheet;
}