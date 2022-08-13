const { Client } = require("@notionhq/client");
var NOTION_TOKEN = "";
var PAGE_ID = "";
var BLOCK_ID = "";

//START PROCESS
const startProcessNotion = async () => {
  const pageTitle = await getPageTitle();
  const levelOneData = await getLevelOneData();
  const levelOneContent = await getLevelOneContent(levelOneData);
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
  let filteredData = [];
  let originalDataFromAPi = [];
  const response = await notion.blocks.children.list({
    block_id: BLOCK_ID,
    page_size: 50,
  });
  originalDataFromAPi = response.results;
  originalDataFromAPi.map((item) => {
    let accessType = item.type;
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
  for (let i = 0; i < levelOneData.length; i++) {
    switch (true) {
      case levelOneData[i].type === "paragraph" &&
        levelOneData[i].has_children === false:
        levelOneData[i].data.rich_text.map((itm) => {
          const paragraphObj = { content: itm.text.content };
          levelOneData[i].data = paragraphObj;
        });
        break;

      case levelOneData[i].type === "heading_1" &&
        levelOneData[i].has_children === false:
        levelOneData[i].data.rich_text.map((itm) => {
          const heading_1Obj = { content: itm.text.content };
          levelOneData[i].data = heading_1Obj;
        });
        break;
      case levelOneData[i].type === "heading_2" &&
        levelOneData[i].has_children === false:
        levelOneData[i].data.rich_text.map((itm) => {
          const heading_2Obj = { content: itm.text.content };
          levelOneData[i].data = heading_2Obj;
        });
        break;
      case levelOneData[i].type === "heading_3" &&
        levelOneData[i].has_children === false:
        levelOneData[i].data.rich_text.map((itm) => {
          const heading_3Obj = { content: itm.text.content };
          levelOneData[i].data = heading_3Obj;
        });
        break;
      case levelOneData[i].type === "callout" &&
        levelOneData[i].has_children === false:
        let calloutTxtval = "";
        levelOneData[i].data.rich_text.map((itm) => {
          calloutTxtval = itm.text.content;
        });
        const calloutObj = {
          content: calloutTxtval,
          icon: levelOneData[i].data.icon.emoji,
        };
        levelOneData[i].data = calloutObj;
        break;
      case levelOneData[i].type === "quote" &&
        levelOneData[i].has_children === false:
        levelOneData[i].data.rich_text.map((itm) => {
          const quoteObj = { content: itm.text.content };
          levelOneData[i].data = quoteObj;
        });
        break;
      case levelOneData[i].type === "bulleted_list_item" &&
        levelOneData[i].has_children === false:
        levelOneData[i].data.rich_text.map((itm) => {
          const bulleted_list_itemObj = { content: itm.text.content, link: itm.text.link };
          levelOneData[i].data = bulleted_list_itemObj;
        });
        break;
      case levelOneData[i].type === "numbered_list_item" &&
        levelOneData[i].has_children === false:
        levelOneData[i].data.rich_text.map((itm) => {
          const numbered_list_itemObj = { content: itm.text.content, link: itm.text.link };
          levelOneData[i].data = numbered_list_itemObj;
        });
        break;
      case levelOneData[i].type === "to_do" &&
        levelOneData[i].has_children === false:
        let to_doTxtval = "";
        levelOneData[i].data.rich_text.map((itm, idx) => {
          to_doTxtval = itm.text.content;
        });
        const to_doObj = {
          content: to_doTxtval,
          checked: levelOneData[i].data.checked,
        };
        levelOneData[i].data = to_doObj;
        break;
      case levelOneData[i].type === "code" &&
        levelOneData[i].has_children === false:
        let codeTxtval = "";
        levelOneData[i].data.rich_text.map((itm) => {
          codeTxtval = itm.text.content;
        });
        const codeObj = {
          content: codeTxtval,
          language: levelOneData[i].data.language,
        };
        levelOneData[i].data = codeObj;
        break;
      //   case levelOneData[i].type === "child_page" &&
      //     levelOneData[i].has_children === false:
      //     var obj = { content: levelOneData[i].data.child_page.title };
      //     // console.log(obj);
      //     levelOneData[i].data = obj;
      //     break;
      case levelOneData[i].type === "video" &&
        levelOneData[i].has_children === false:
        const videoObj = { content: levelOneData[i].data.external.url };
        levelOneData[i].data = videoObj;
        break;
      case levelOneData[i].type === "image" &&
        levelOneData[i].has_children === false:
        const imageObj = { content: levelOneData[i].data.file };
        levelOneData[i].data = imageObj;
        break;
      case levelOneData[i].type === "file" &&
        levelOneData[i].has_children === false:
        const fileObj = { content: levelOneData[i].data.file };
        levelOneData[i].data = fileObj;
        break;
      //   case levelOneData[i].type === "pdf" &&
      //     levelOneData[i].has_children === false:
      //     var obj = { content: levelOneData[i].data.file.url};
      //     // console.log(obj);
      //     levelOneData[i].data = obj;
      //     break;
      case levelOneData[i].type === "bookmark" &&
        levelOneData[i].has_children === false:
        const bookmarkObj = { content: levelOneData[i].data.url };
        levelOneData[i].data = bookmarkObj;
        break;
      case levelOneData[i].type === "equation" &&
        levelOneData[i].has_children === false:
        const equationObj = { content: levelOneData[i].data.expression };
        levelOneData[i].data = equationObj;
        break;
      //Nested Elements
      // case levelOneData[i].type === "toggle" &&
      //   levelOneData[i].has_children === true:
      //   levelOneData[i].data.rich_text.map((itm, idx) => {
      //     //   console.log("content = " + itm.text.content);
      //     var obj = { content: itm.text.content };
      //     //   console.log("--------");
      //     //   console.log(obj);
      //   });
      //   //send item id ie block id
      //   // await getBlockChildren(item.id)
      //   break;
      case levelOneData[i].type === "table" &&
        levelOneData[i].has_children === true:
        let table_width = levelOneData[i].data.table_width;
        let has_column_header = levelOneData[i].data.has_column_header;
        let has_row_header = levelOneData[i].data.has_row_header;

        //cal get block children
        let finalTableChildren = await getTableChildren(levelOneData[i].id);
        const tableObj = {
          table_width: table_width,
          has_column_header: has_column_header,
          has_row_header: has_row_header,
          data: finalTableChildren,
        };
        levelOneData[i].data = tableObj;
        break;
      default:
      // console.log("switch default case for " + levelOneData[i].type + levelOneData[i].has_children);
    }
  }
  return levelOneData;
};

const getTableChildren = async (block_id) => {
  const notion = new Client({ auth: NOTION_TOKEN });
  let finalTableChildren = [];
  let tableChild = [];
  const response = await notion.blocks.children.list({
    block_id: block_id,
    page_size: 50,
  });
  response.results.map((item) => {
    let accessType = item.type;
    const obj = {
      object: item.object,
      id: item.id,
      has_children: item.has_children,
      type: item.type,
      data: item[accessType],
    };
    tableChild.push(obj);
  });
  tableChild.map((item, index) => {
    let rowVal = [];
    item.data.cells.map((cellitem) => {
      cellitem.map((cellitemval) => {
        rowVal.push(cellitemval.plain_text);
      });
    });
    const obj = { row: index, content: rowVal };
    finalTableChildren.push(obj);
  });
  return finalTableChildren;
};
const setNotionApiToken = (notionPageId, notionApiToken) => {
  NOTION_TOKEN = notionApiToken;
  PAGE_ID = notionPageId;
  BLOCK_ID = notionPageId;
};

// setNotionApiToken("1", "1");
// startProcessNotion();
module.exports = { startProcessNotion, setNotionApiToken };
