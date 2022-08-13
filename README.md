# Backend-Ringover

To Run Server: 

npm install
node Server.js 

Url: http://localhost:8081/notionToConfluence

### API Request Body Data
```javascript
{
    "notionApiToken":"secret_iufNTmTklhliGZ2lpvDiNDwSuntAgmqT5FOeNNC1NbF",
    "notionPageId":"f9cb55e5ebe3bc39917a9337ba61ead4",
    "confluenceApiToken":"saxenavedant61@gmail.com:Ex6DQSjAxEi1ikTAh4YE1790",
    "confluenceSpace":"TFR"
}
```

### Keys used here are for sample only generate your own keys
1. Notion API Token.
2. Confluence API Token (send it in `your_email@domain.com:your_user_api_token` format) base64 encoding of authorization credentials handled in code no need to do it manually.
3. Page ID of Notion Page to be converted.
4. Confluence Space Key Confluence Space where page will be generated.

### Links to generate API Tokens
1. Notion: https://www.notion.com/my-integrations
2. Confluence: https://developer.atlassian.com/cloud/confluence/basic-auth-for-rest-apis/
 
#### Sample Notion Page Converted for Testing:
https://solstice-jackfruit-f5b.notion.site/Ringover-f9cb55e5ebe34c39987e9337ba61ead4

#### Respective Converted Page in Confluence:
https://androdat.atlassian.net/l/cp/CzU2Lmnh
