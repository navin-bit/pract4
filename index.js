const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const path = require("path");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));

app.post("/search", async (req, res) => {
  const query = req.body;
  let search = query.search;

  try {
    const url = `https://www.bing.com/search?q=${search}`;
    const response = await axios.get(url);
    const data = await response.data;

    const $ = cheerio.load(data);
    const searchResults = $("li.b_algo");

    if (searchResults.length > 0) {
      const results = [];
      searchResults.each((index, element) => {
        const link = $(element).find("a").attr("href");
        const paragraph = $(element).find("p").text();

        results.push({ link, paragraph });
      });
      return res.render("home", { data: results, search: search });
    } else {
      res.json({ message: "No search results found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  return res.render("home");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
