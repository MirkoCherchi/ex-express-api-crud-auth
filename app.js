const express = require("express");
const postRouter = require("./routers/posts.js");
const errorHandler = require("./middlewares/errorHandler.js");
const notFound = require("./middlewares/notFound.js");
const categoriesRouter = require("./routers/categories.js");
const tagsRouter = require("./routers/tags.js");
const app = express();

require("dotenv").config();
const { PORT } = process.env;
const port = PORT || 3000;

app.use(express.json());
app.use("/posts", postRouter);
app.use("/categories", categoriesRouter);
app.use("/tags", tagsRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server attivo su http://localhost:${port}`);
});
