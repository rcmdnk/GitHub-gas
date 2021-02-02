function aaa(){
  ss =SpreadsheetApp.getActive();
  sheet = ss.getSheetByName('OwnerRepo');
  range = sheet.getRange('B2:B');
  range.setHorizontalAlignment('right');
}

function getSheet(name, cols=[], col_widths=[], alignments={}) {
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
  Object.keys(alignments).forEach(function(key) {
    sheet.getRange(key).setHorizontalAlignment(alginments[key]); 
  });

  // Need additional row to froze the row
  sheet.insertRowsAfter(1, 1);
  sheet.setFrozenRows(1);
  return sheet;
}

function copySheets(){
  const ss = SpreadsheetApp.getActive();
  const sheets = [ss.getSheetByName('OwnerRepo'), ss.getSheetByName('MemberRepo')];
  const replica = SpreadsheetApp.openById(REPLICA);
  sheets.forEach(function(s){
    const name = s.getName();
    const s_dest = replica.getSheetByName(name);
    if(s_dest)replica.deleteSheet(s_dest);
    const new_s = s.copyTo(replica);
    new_s.setName(name);
  });
}