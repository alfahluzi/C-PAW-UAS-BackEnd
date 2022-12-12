const express = require("express");
const { db_query, db_testConnection } = require("./helper/db_connect_helper");
const { END_POINT } = require("./helper/end_point_helper");
const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "Content-Type",
    "Authorization"
  );
  next();
});
const PORT = 4000;
app.listen(PORT, "localhost", function () {
  console.log(`Server is Listening at Port ${PORT}!`);
});

const adminProduk_c = require("./controller/admin/Produk");
app.use("/", adminProduk_c);

app.get("/", (req, res) => {
  db_testConnection((result) => {
    let stat = {
      server_status: `Server is active on port ${PORT}`,
      database: result ? result : "unknow",
      end_point: END_POINT,
    };
    return res.json(stat);
  });
});
