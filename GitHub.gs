/**
 * Authorizes and makes a request to the GitHub API.
 * Ref: https://github.com/googleworkspace/apps-script-oauth2/blob/master/samples/GitHub.gs
 */
function request(path, pagenation=1, debug=0) {
  let token = TOKEN;
  if(token == undefined){
    const service = getService();
    if (!service.hasAccess()) {
      throw new Error('Open the following URL and re-run the script: '
                      + service.getAuthorizationUrl());
    }
    token = service.getAccessToken();
  }
  var result = undefined;
  let url = 'https://api.github.com' + path;
  if(pagenation==0){
    const response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    result = JSON.parse(response.getContentText());
  }else{
    if(path.indexOf('?') != -1){
      path = path + '&per_page=100';
    }else{
      path = path + '?per_page=100';
    }
    result = [];
    while(true){
      const response = UrlFetchApp.fetch(url, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      Array.prototype.push.apply(result, JSON.parse(response.getContentText()));
      url = null;
      let links = response.getHeaders()['Link'];
      if(links === undefined){
        break;
      }
      links = links.split(',');
      for(let i=0; i<links.length; i++){
        const ll = links[i].split(';');
        if(ll[1].trim() == 'rel="next"'){
          url = ll[0].trim().replace('<', '').replace('>', '');
          break;
        }
      };
      if(url === null){
        break;
      }
    }
  }
  if(debug == 1){
    Logger.log(result);
  }
  return result;
}


/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  getService().reset();
}

/**
 * Configures the service.
 */
function getService() {
  return OAuth2.createService('GitHub')
      // Set the endpoint URLs.
      .setAuthorizationBaseUrl('https://github.com/login/oauth/authorize')
      .setTokenUrl('https://github.com/login/oauth/access_token')

      // Set the client ID and secret.
      .setClientId(CLIENT_ID)
      .setClientSecret(CLIENT_SECRET)

      // Set the name of the callback function that should be invoked to
      // complete the OAuth flow.
      .setCallbackFunction('authCallback')

      // Set scope
      .setScope('read:org')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties());
}

/**
 * Handles the OAuth callback.
 */
function authCallback(request) {
  const service = getService();
  const authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied.');
  }
}

/**
 * Logs the redict URI to register.
 */
function logRedirectUri() {
  Logger.log(OAuth2.getRedirectUri());
}