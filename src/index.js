const express = require("express");
const cors = require("cors");
const http = require("http");

const routes = require("./routes");
const app = express();
const server = http.createServer(app);
const schedule = require("./schedule");
const createRoutes = require("./scripts/generateRotes");
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  app.use(cors());
  next();
});
app.use(routes);

server.listen(3335, () => {
  console.log("http on *:3335");
});
// executa o script de criação das rotas

createRoutes.execute();
schedule.updateRouter();