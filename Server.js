const { startConfluenceProcess } = require("./Confluence");
const { setNotionApiToken } = require("./Notion");
const express = require("express");
const app = express();
const port = 8081;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.get("/", (req, res) => {
  res.send("Use Post Method");
});

app.post("/", async (req, res) => {
  const data = req.body;

  let msg = validateData(data);
  if (msg != "") res.status(201).send({ status: "F", msg: msg });
  else {
    try {
      setNotionApiToken(data.notionPageId, data.notionApiToken);
      const resp = await startConfluenceProcess(
        data.confluenceSpace,
        data.confluenceApiToken
      );
      if (resp.status === "S")
        res.status(201).send({ status: "S", msg: resp.successMessage });
    } catch (err) {
      return res.status(401).send({ status: "F", error: err.message });
    }
  }
});

app.listen(port, () => console.log(`Listening on port number ${port}`));

//Validation Functions
const validateData = (data) => {
  let msg = "";
  switch (false) {
    case "notionApiToken" in data:
      msg += "notionApiToken missing\\n";
      break;
    case "notionPageId" in data:
      msg += "notionPageId missing\\n";
      break;
    case "confluenceApiToken" in data:
      msg += "confluenceApiToken missing\\n";
      break;
    case "confluenceSpace" in data:
      msg += "confluenceSpace missing\\n";
      break;
    default:
      console.log("everything present");
      for (let key in data) {
        if (data[key] === "") {
          msg += `${key} is empty `;
        }
      }
  }
  return msg;
};
