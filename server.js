const express = require("express");
const fs = require("fs");
const path = require("path");
const compression = require("compression");
const cors = require("cors")

const port = process.env.PORT || 5000;
const app = express();
app.use(compression());

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "build/assets")));
app.use("/static", express.static(path.join(__dirname, "build/static")));



app.get("*", async (req, res) => {

  let html = fs.readFileSync(path.join(__dirname, "build", "index.html"));
  let htmlWithSeo = html
    .toString()

  return res.status(200).send(htmlWithSeo);
});

app.listen(port, () => console.log(`running on port ${port} on success!`));
