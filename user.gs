function get_star_info(user, type='All', n_repos=3){
  let user_info = {'stars': 0, 'repos': 0};
  const repos = request('/users/' + user.login + '/repos?type=' + type);
  let star_repos = [];
  repos.forEach(function(r){
    user_info['repos'] += 1;
    if(r.stargazers_count == 0) return;
    user_info['stars'] += r.stargazers_count;
    star_repos.push({'url': r.html_url, 'full_name': r.full_name, 'language': r.language, 'stars': r.stargazers_count});
  });
  star_repos.sort(function(x, y){return y['stars'] - x['stars'];});
  user_info['star_repos'] = [];
  for(let i=0;i < n_repos;i++){
    if(i < star_repos.length){
      Array.prototype.push.apply(user_info['star_repos'],
                                 ['=HYPERLINK("' + star_repos[i]['url'] + '", "' + star_repos[i]['full_name'] + '")',
                                 star_repos[i]['language'], star_repos[i]['stars']]);
    }else{
      Array.prototype.push.apply(user_info['star_repos'], ["", "", ""]);
    }
  }
  return ['=HYPERLINK("' + user.url + '", "' + user.login + '")', user_info['stars'], user_info['repos']].concat(user_info['star_repos']);
}