function getOwnerRepos() {
  getStarRepos('owner', 'OwnerRepo');
}

function getMemberRepos() {
  getStarRepos('member', 'MemberRepo');
}

function getMembers() {
  let members = request('/orgs/' + ORGANIZATION + '/members');
  return members;
}

function getStarRepos(type="all", sheet_name='All') {
  members = getMembers();
  let info = [];
  members.forEach(function(m){
    Logger.log(m.login);
    let user_info = {'stars': 0, 'repos': 0};
    const repos = request('/users/' + m.login + '/repos?type=' + type);
    let star_repos = [];
    repos.forEach(function(r){
      user_info['repos'] += 1;
      if(r.stargazers_count == 0) return;
      user_info['stars'] += r.stargazers_count;
      star_repos.push({'url': r.html_url, 'full_name': r.full_name, 'language': r.language, 'stars': r.stargazers_count});
    });
    star_repos.sort(function(x, y){return y['stars'] - x['stars'];});
    user_info['star_repos'] = [];
    for(let i=0;i < N_REPOS;i++){
      if(i < star_repos.length){
        Array.prototype.push.apply(user_info['star_repos'],
                                   ['=HYPERLINK("' + star_repos[i]['url'] + '", "' + star_repos[i]['full_name'] + '")',
                                   star_repos[i]['language'], star_repos[i]['stars']]);
      }else{
        Array.prototype.push.apply(user_info['star_repos'], ["", "", ""]);
      }
    }
    info.push(['=HYPERLINK("' + m.url + '", "' + m.login + '")', user_info['stars'], user_info['repos']].concat(user_info['star_repos']));
  });
  info.sort(function(x, y){return y[1] - x[1];});
  const columns = ['User', 'Stars', 'Repos',
                   '1stRepo', '1stLang', '1stStars',
                   '2ndRepo', '2ndLang', '2ndStars',
                   '3rdRepo', '3rdLang', '3rdStars'];
  const col_widths = [100, 100, 100,
                      300, 100, 100,
                      300, 100, 100,
                      300, 100, 100];
  let sheet = getSheet(sheet_name, columns, col_widths);
  sheet.getRange(sheet.getLastRow() + 1, 1, info.length, columns.length).setValues(info);
  Logger.log('end');
}

function getPullRequests() {
  // search query has rate limits 30
  members = getMembers();
  let info = [];
  members.forEach(function(m){
    Logger.log(m.login);
    let user_info = {'pulls': 0, 'merged': 0};
    let queryString = 'q=' + encodeURIComponent('is:pr is:public author:' + m.login + ' -user:' + m.login);
    const pulls = request('/search/issues?' + queryString, 0);
    queryString = 'q=' + encodeURIComponent('is:pr is:merged is:public author:' + m.login + ' -user:' + m.login);
    const merged = request('/search/issues?' + queryString, 0);
    info.push(['=HYPERLINK("' + m.url + '", "' + m.login + '")', pulls['total_count'], merged['total_count']]);
  });
  info.sort(function(x, y){return y[1] - x[1];});
  const columns = ['User', 'Pulls', 'Merged'];
  let sheet = getSheet('PullRequests', columns);
  sheet.getRange(sheet.getLastRow() + 1, 1, info.length, columns.length).setValues(info);
  Logger.log('end');
}

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