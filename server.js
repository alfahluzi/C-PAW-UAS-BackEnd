const express = require("express");
const { END_POINT } = require("./helper/end_point_helper");
const app = express();
const bodyParser = require("body-parser");
const adminProduk_c = require("./controller/admin/Produk");
const adminTransaksi_c = require("./controller/admin/Transaksi");
const cors = require("cors");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Methods", "Content-Type, Authorization");
  next();
});

const {
  db_testConnection,
  db_disconnect,
} = require("./helper/db_connect_helper");

app.use("/", adminProduk_c);
app.use("/", adminTransaksi_c);

const PORT = 4000;
app.listen(PORT, "localhost", function () {
  console.log(`Server is Listening at Port ${PORT}!`);
});

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
app.get(END_POINT.dc, (req, res) => {
  db_disconnect();
  return res.status(200).json(["disconnected"]);
});
