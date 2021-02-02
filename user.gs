function get_star_info(user, type='All', n_repos=3){
  let user_info = {'stars': 0, 'repos': 0};
  const repos = request('/users/' + user.login + '/repos?type=' + type);
  let star_repos = [];
  repos.forEach(function(r){
    user_info['repos'] += 1;
    if(r.stargazers_count == 0) return;
    user_info['stars'] += r.stargazers_count;
    star_repos.push({'url': r.html_url, 'full_name': r.full_name, 'language': r.language, 'stars': r.stargazers_count, 'star_track': '&r=' + r.owner.login + ',' + r.name});
  });
  star_repos.sort(function(x, y){return y['stars'] - x['stars'];});
  user_info['star_repos'] = [];
  let star_track = '';
  for(let i=0;i < n_repos;i++){
    if(i < star_repos.length){
      if(star_track == ''){
        star_track = 'https://seladb.github.io/StarTrack-js/#/preload?';
      }
      star_track += star_repos[i].star_track
      Array.prototype.push.apply(user_info['star_repos'],
                                 ['=HYPERLINK("' + star_repos[i]['url'] + '", "' + star_repos[i]['full_name'] + '")',
                                 star_repos[i]['language'], '=HYPERLINK("https://seladb.github.io/StarTrack-js/#/preload?' + star_repos[i].star_track + '", "' + star_repos[i]['stars'] + '")']);
    }else{
      Array.prototype.push.apply(user_info['star_repos'], ["", "", ""]);
    }
  }
  if(star_track != ''){
    star_track = '=HYPERLINK("' + star_track + '", "' + user_info['stars'] + '")';
  }else{
    star_track = user_info['stars'];
  }
  return [user_info['stars'], ['=HYPERLINK("https://github.com/' + user.login + '", "' + user.login + '")',
          star_track,
          user_info['repos'],
          '=HYPERLINK("https://github-readme-stats.vercel.app/api?username=' + user.login + '", "' + user.login + '")',
          '=HYPERLINK("https://github-readme-stats.vercel.app/api/top-langs/?langs_count=10&username=' + user.login + '", "' + user.login + '")',
         ].concat(user_info['star_repos'])];
}