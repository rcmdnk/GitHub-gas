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
    info.push(get_star_info(m, type, 3));
  });
  info.sort(function(x, y){return y[0] - x[0];});
  values = [];
  info.forEach(function(i){
    values.push(i[1]);
  });
  const columns = ['User', 'Stars', 'Repos',
                   'Stats', 'Languages',
                   '1stRepo', '1stLang', '1stStars',
                   '2ndRepo', '2ndLang', '2ndStars',
                   '3rdRepo', '3rdLang', '3rdStars'];
  const col_widths = [100, 100, 100,
                      100, 100,
                      300, 100, 100,
                      300, 100, 100,
                      300, 100, 100];
  const alignments = {'B2:B' : 'right', 'H2:H': 'right', 'K2:K': 'right', 'N2:N': 'right'};
  let sheet = getSheet(sheet_name, columns, col_widths, alignments);
  sheet.getRange(sheet.getLastRow() + 1, 1, values.length, columns.length).setValues(values);
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

