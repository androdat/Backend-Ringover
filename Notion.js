const { Client } = require("@notionhq/client");
var NOTION_TOKEN = "";
var PAGE_ID = "";
var BLOCK_ID = "";

//START PROCESS
const startProcessNotion = async () => {
  const pageTitle = await getPageTitle();
  var levelOneData = await getLevelOneData();
  var levelOneContent = await getLevelOneContent(levelOneData);
  const obj = { pageTitle: pageTitle, pageData: levelOneContent };
  return obj;
};

const getPageTitle = async () => {
  const notion = new Client({ auth: NOTION_TOKEN });
  const response = await notion.pages.properties.retrieve({
    page_id: PAGE_ID,
    property_id: "title",
  });
  const pageTitle = response.results[0].title.plain_text;
  return pageTitle;
};

const getLevelOneData = async () => {
  const notion = new Client({ auth: NOTION_TOKEN });
  var filteredData = [];
  var originalDataFromAPi = [];
  const response = await notion.blocks.children.list({
    block_id: BLOCK_ID,
    page_size: 50,
  });
  originalDataFromAPi = response.results;
  originalDataFromAPi.map((item, index) => {
    var accessType = item.type;
    let obj = {
      object: item.object,
      id: item.id,
      has_children: item.has_children,
      type: item.type,
      data: item[accessType],
    };
    filteredData.push(obj);
  });
  return filteredData;
};

const getLevelOneContent = async (levelOneData) => {
  var tableData = [];
  for (var i = 0; i < levelOneData.length; i++) {
    switch (true) {
      case levelOneData[i].type === "paragraph" &&
        levelOneData[i].has_children === false:
        levelOneData[i].data.rich_text.map((itm, idx) => {
          var obj = { content: itm.text.content };
          levelOneData[i].data = obj;
        });
        break;

      case levelOneData[i].type === "heading_1" &&
        levelOneData[i].has_children === false:
        levelOneData[i].data.rich_text.map((itm, idx) => {
          var obj = { content: itm.text.content };
          levelOneData[i].data = obj;
        });
        break;

      case levelOneData[i].type === "heading_2" &&
        levelOneData[i].has_children === false:
        levelOneData[i].data.rich_text.map((itm, idx) => {
          //   console.log("content = " + itm.text.content);
          var obj = { content: itm.text.content };
          //   console.log(obj);
          levelOneData[i].data = obj;
        });
        break;
      case levelOneData[i].type === "heading_3" &&
        levelOneData[i].has_children === false:
        levelOneData[i].data.rich_text.map((itm, idx) => {
          //   console.log("content = " + itm.text.content);
          var obj = { content: itm.text.content };
          //   console.log(obj);
          levelOneData[i].data = obj;
        });
        break;
      case levelOneData[i].type === "callout" &&
        levelOneData[i].has_children === false:
        var txtval = "";
        levelOneData[i].data.rich_text.map((itm, idx) => {
          //   console.log("content = " + itm.text.content);
          txtval = itm.text.content;
        });
        var obj = { content: txtval, icon: levelOneData[i].data.icon.emoji };
        // console.log(obj);
        levelOneData[i].data = obj;
        break;
      case levelOneData[i].type === "quote" &&
        levelOneData[i].has_children === false:
        levelOneData[i].data.rich_text.map((itm, idx) => {
          //   console.log("content = " + itm.text.content);
          var obj = { content: itm.text.content };
          //   console.log(obj);
          levelOneData[i].data = obj;
        });
        break;
      case levelOneData[i].type === "bulleted_list_item" &&
        levelOneData[i].has_children === false:
        levelOneData[i].data.rich_text.map((itm, idx) => {
          //   console.log("content = " + itm.text.content);
          var obj = { content: itm.text.content, link: itm.text.link };
          //   console.log(obj);
          levelOneData[i].data = obj;
        });
        break;
      case levelOneData[i].type === "numbered_list_item" &&
        levelOneData[i].has_children === false:
        levelOneData[i].data.rich_text.map((itm, idx) => {
          //   console.log("content = " + itm.text.content);
          var obj = { content: itm.text.content, link: itm.text.link };
          //   console.log(obj);
          levelOneData[i].data = obj;
        });
        break;
      case levelOneData[i].type === "to_do" &&
        levelOneData[i].has_children === false:
        var txtval = "";
        levelOneData[i].data.rich_text.map((itm, idx) => {
          //   console.log("content = " + itm.text.content);
          txtval = itm.text.content;
        });
        var obj = { content: txtval, checked: levelOneData[i].data.checked };
        // console.log(obj);
        levelOneData[i].data = obj;
        break;
      case levelOneData[i].type === "code" &&
        levelOneData[i].has_children === false:
        var txtval = "";
        levelOneData[i].data.rich_text.map((itm, idx) => {
          //   console.log("content = " + itm.text.content);
          txtval = itm.text.content;
        });
        var obj = { content: txtval, language: levelOneData[i].data.language };
        // console.log(obj);
        levelOneData[i].data = obj;
        break;
      //   case levelOneData[i].type === "child_page" &&
      //     levelOneData[i].has_children === false:
      //     var obj = { content: levelOneData[i].data.child_page.title };
      //     // console.log(obj);
      //     levelOneData[i].data = obj;
      //     break;
      case levelOneData[i].type === "video" &&
        levelOneData[i].has_children === false:
        var obj = { content: levelOneData[i].data.external.url };
        // console.log(obj);
        levelOneData[i].data = obj;
        break;
      case levelOneData[i].type === "image" &&
        levelOneData[i].has_children === false:
        var obj = { content: levelOneData[i].data.file };
        // console.log(obj);
        levelOneData[i].data = obj;
        break;
      case levelOneData[i].type === "file" &&
        levelOneData[i].has_children === false:
        var obj = { content: levelOneData[i].data.file };
        // console.log(obj);
        levelOneData[i].data = obj;
        break;
      //   case levelOneData[i].type === "pdf" &&
      //     levelOneData[i].has_children === false:
      //     var obj = { content: levelOneData[i].data.file.url};
      //     // console.log(obj);
      //     levelOneData[i].data = obj;
      //     break;
      case levelOneData[i].type === "bookmark" &&
        levelOneData[i].has_children === false:
        var obj = { content: levelOneData[i].data.url };
        // console.log(obj);
        levelOneData[i].data = obj;
        break;
      case levelOneData[i].type === "equation" &&
        levelOneData[i].has_children === false:
        var obj = { content: levelOneData[i].data.expression };
        // console.log(obj);
        levelOneData[i].data = obj;
        break;
      //Nested Elements
      case levelOneData[i].type === "toggle" &&
        levelOneData[i].has_children === true:
        levelOneData[i].data.rich_text.map((itm, idx) => {
          //   console.log("content = " + itm.text.content);
          var obj = { content: itm.text.content };
          //   console.log("--------");
          //   console.log(obj);
        });
        //send item id ie block id
        // await getBlockChildren(item.id)
        break;
      case levelOneData[i].type === "table" &&
        levelOneData[i].has_children === true:
        var table_width = levelOneData[i].data.table_width;
        var has_column_header = levelOneData[i].data.has_column_header;
        var has_row_header = levelOneData[i].data.has_row_header;

        //cal get block children
        var data = await getTableChildren(levelOneData[i].id);
        //   console.log(response);

        var obj = {
          table_width: table_width,
          has_column_header: has_column_header,
          has_row_header: has_row_header,
          data: data,
        };

        levelOneData[i].data = obj;
        break;
      default:
      // console.log("switch default case for " + item.type + item.has_children);
    }
  }
  return levelOneData;
};

const getTableChildren = async (block_id) => {
  const notion = new Client({ auth: NOTION_TOKEN });
  var data = [];
  const response = await notion.blocks.children.list({
    block_id: block_id,
    page_size: 50,
  });
  var tc = [];

  response.results.map((item, index) => {
    var accessType = item.type;
    const obj = {
      object: item.object,
      id: item.id,
      has_children: item.has_children,
      type: item.type,
      data: item[accessType],
    };
    tc.push(obj);
  });

  tc.map((item, index) => {
    var rowVal = [];
    item.data.cells.map((cellitem) => {
      cellitem.map((cellitemval) => {
        rowVal.push(cellitemval.plain_text);
      });
    });
    var obj = { row: index, content: rowVal };

    data.push(obj);
  });
  return data;
};
const setNotionApiToken = (notionPageId, notionApiToken) => {
  NOTION_TOKEN = notionApiToken;
  PAGE_ID = notionPageId;
  BLOCK_ID = notionPageId;
};

// setNotionApiToken("1", "1");
// startProcessNotion();
module.exports = { startProcessNotion, setNotionApiToken };
