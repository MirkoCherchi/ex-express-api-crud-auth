const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv"); // Aggiunta della libreria dotenv per caricare le variabili d'ambiente
const errorHandler = require("./middlewares/errorHandler.js");
const notFound = require("./middlewares/notFound.js");
const postRouter = require("./routers/posts.js");
const categoriesRouter = require("./routers/categories.js");
const tagsRouter = require("./routers/tags.js");
const authRouter = require("./routers/auth.js");

// Carica le variabili d'ambiente da .env
dotenv.config();
const { PORT, HOST } = process.env;
const port = PORT || 3000;

const app = express();

// Middleware
app.use(express.static("public"));
app.use(cors());
app.use(express.json());

// Rotte
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/categories", categoriesRouter);
app.use("/tags", tagsRouter);

// Middleware per gestire errori 404
app.use(notFound);

// Middleware per gestire altri errori
app.use(errorHandler);

// Avvio del server
app.listen(port, () => {
  console.log(`Server attivo su http://${HOST}:${port}`);
});
