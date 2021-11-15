# GitHub-gas

Google Apps Script to retrieve GitHub user information in Organization.

## Preparation

* Make Google Sheets
* Open **Tools**->**Script editer**
* Copy all gs files in this repository to the Apps Script editor
* Add library: `1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF` (OAuth2)
* Set parameters in **params.gs**

For parameters, refer to the following.

### (CLIENT_ID, CLIENT_SECRET**) or TOKEN

You can choose (**CLIENT_ID**, **CLIENT_SECRET**) or **TOKEN** for the authorization.

#### CLIENT_ID, CLIENT_SECRET

Note: (**CLIENT_ID**, **CLIENT_SECRET**) requires authorization process at the first time. The script shows the error and URL to be accessed. You need to open the URL and authorize it with your account.

Note: (**CLIENT_ID**, **CLIENT_SECRET**) method can obtain only public users in the Organization. Users who set the Organization hidden (this is the default setting) will not be obtained.


Go to [GitHub Apps](https://github.com/settings/apps) and make New GitHub App.

* Fill App name, Homepage URL (something related to this app)
* Fill **Callback URL** and it can be obtained by calling **GitHub.gs/logRedirectURi()** function.
    * **Callback URL** should be like `https://script.google.com/macros/d/<sheets ID>/usercallback`.
* Uncheck **Active** for **Webhook**.
* Update permissions:
    * Repository permissions:
        * Metadata: Read-only
        * Issues: Read-only
        * Pull requests: Read-only
    * Organization permissions:
        * Members requests: Read-only

And get Client ID and Client secret.

#### TOKEN

Go to [Personal Access Tokens](https://github.com/settings/tokens),

* Check `repo` (Full control of private repositories)

And generate a token.

#### ORGANIZATION

Set your organization name.

#### REPLICA

If you want to share the result, it is better to prepare another Sheets
to hide parameters (ClientID/Secret or TOKEN),
because the public access to your sheets will allow seeing scripts, too.

For this case, make new Sheets and get ID, and set ID to `REPLICA`,
then execute **GitHub.gs/copySheets()** function.

## Usage

### Get number of stars for own repositories obtained by organization members

Execute **organization.gs/getOwnerRepos()**.

### Get number of stars for repositories of which organization member is the member

Execute **organization.gs/getMemberRepos()**.

### Get number of pull requests of the organization members

Execute **organization.gs/getPullRequests()**.

Note: This function can get information from only a few users by hitting the rate limit.

It may be possible to get all information by using [GitHub GraphQL API - GitHub Docs](https://docs.github.com/en/graphql)

Ref: [tarao/oss-contributions: List OSS contributions of users or organization members](https://github.com/tarao/oss-contributions/)







