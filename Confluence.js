const axios = require("axios");
const { startProcessNotion } = require("./Notion");
var CONFLUENCE_TOKEN = "";

const startConfluenceProcess = async (confluenceSpace, confluenceApiToken) => {
  setConfluenceApiToken(confluenceApiToken);
  const data = await startProcessNotion();
  const apiBodyData = generateBodyData(
    data.pageData,
    data.pageTitle,
    confluenceSpace
  );
  try {
    let res = await pushToConfluenceApiCall(apiBodyData);
    return res;
  } catch (error) {
    throw new Error(`${error.response.data.message}`);
  }
};

const pushToConfluenceApiCall = async (apiBodyData) => {
  let res = await axios({
    method: "post",
    url: "https://androdat.atlassian.net/wiki/rest/api/content",
    data: apiBodyData,
    headers: {
      Authorization: CONFLUENCE_TOKEN,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (res.status == 200) {
    const obj = {
      status: "S",
      successMessage: "Confluence Page Created",
    };
    return obj;
  }
};

const generateBodyData = (data, title, confluenceSpace) => {
  const bodyValues = getBodyValues(data);
  const bodyData = `{
    "space": {
      "key": "${confluenceSpace}"
    },
    "type": "page",
    "title": "${title}",
    "body": {
      "storage": {
        "value": "${bodyValues.trim()}",
        "representation": "storage"
      }
    }
  }
  `;
  return bodyData;
};

const getBodyValues = (data) => {
  let string = "";
  data.map((item, index) => {
    switch (true) {
      case item.type === "paragraph":
        if (item.data.content) {
          string += `<p>${item.data.content.replaceAll("\n", "<br/>")}</p>`;
        } else {
          string += "<br/>";
        }
        break;
      case item.type === "heading_1":
        string += `<h1>${item.data.content}</h1>`;
        break;
      case item.type === "heading_2":
        string += `<h2>${item.data.content}</h2>`;
        break;
      case item.type === "heading_3":
        string += `<h3>${item.data.content}</h3>`;
        break;
      case item.type === "callout":
        string += `<p>${item.data.icon} ${item.data.content}</p>`;
        break;
      case item.type === "quote":
        string += `<blockquote> <p>${item.data.content}</p> </blockquote>`;
        break;
      case item.type === "bulleted_list_item":
        string += `<ul> <li>${item.data.content}</li> </ul>`;
        break;
      case item.type === "numbered_list_item":
        string += `<ol> <li>${item.data.content.replaceAll(
          '"',
          "'"
        )}</li> </ol> `;
        break;
      case item.type === "to_do":
        string += `<ul> <li>${item.data.content}</li> </ul>`;
        break;
      // case item.type === "code":
      //   string += `<p>${item.data.language.replaceAll(
      //     "\n",
      //     "<br/>"
      //   )} ${item.data.content.replaceAll("\n", "<br/>")}</p>`;
      //   break;
      case item.type === "child_page":
        string += `<h3>This is the child page from Notion ${item.data.title}</h3>`;
        break;
      case item.type === "video":
        string += `<p>Video Link <a href='${item.data.content}' data-card-appearance='inline'>${item.data.content}</a> </p>`;
        break;
      //   case item.type === "image":
      //     console.log(item.data.content);
      //     string += `<p>file here ${item.data.content}</p>`;
      //     break;
      //   case item.type === "file":
      //     console.log(item.data.content);
      //     string += `<p>file here ${item.data.content}</p>`;
      //     break;
      //   case item.type === "pdf":
      //     console.log(item.data.content);
      //     string += `<p>PDF here ${item.data.content}</p>`;
      //     break;
      case item.type === "bookmark":
        string += `<p>Bookmark <a href='${item.data.content}' data-card-appearance='inline'>${item.data.content}</a> </p>`;
        break;
      case item.type === "equation":
        string += `<p>Equation here ${item.data.content}</p>`;
        break;
      case item.type === "table":
        string += `<table><tbody>${getTableRows(
          item.data.data,
          item.data.table_width
        )}</tbody></table>`;
        break;
    }
  });
  return string;
};
const getTableRows = (data, width) => {
  let rowString = "";
  data.map((item, index) => {
    if (index === 0) {
      let tr = "";
      item.content.map((itm) => {
        let td = `<th>${itm.trim()}</th>`;
        tr += td;
      });
      //add label tr
      let appendTrTag = `<tr>${tr}</tr>`;
      rowString += appendTrTag;
    } else {
      let tr = "";
      item.content.map((itm) => {
        let td = `<td>${itm.trim()}</td>`;
        tr += td;
      });
      //add label tr
      let appendTrTag = `<tr>${tr}</tr>`;
      rowString += appendTrTag;
    }
  });
  return rowString;
};

const setConfluenceApiToken = (confluenceApiToken) => {
  const buffer = Buffer.from(confluenceApiToken);
  const string = buffer.toString("base64");
  CONFLUENCE_TOKEN = `Basic ${string}`;
};

// startConfluenceProcess();
module.exports = { startConfluenceProcess };
