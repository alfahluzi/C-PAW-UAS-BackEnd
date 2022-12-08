const express = require("express");
const { db_query, db_testConnection } = require("./helper/db_connect_helper");
const app = express();

const PORT = 3000;
const END_POINT = {
  test: "/test",
  akun: "/akun",
};

app.listen(PORT, "localhost", function () {
  console.log("Server is Listening at Port 3000!");
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

app.get("/test", (req, res) => {
  console.log("Request is Incoming");
  const responseData = {
    message: "Server API Test",
    endingMessage: "Server API is actived, you can use this API",
  };
  const jsonContent = JSON.stringify(responseData);
  res.end(jsonContent);
});

app.get("/akun", (req, res) => {
  db_query("SELECT * FROM akun", (err, rows) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(rows);
  });
});
