const express = require("express");
const { db_query } = require("../../helper/db_connect_helper");
const { END_POINT } = require("../../helper/end_point_helper");
const router = express.Router();
module.exports = router;

router.get(END_POINT.barang, (req, res) => {
  db_query("SELECT * FROM barang", (err, rows) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(rows);
  });
});

router.get(END_POINT.kategori_barang, (req, res) => {
  db_query(
    "SELECT Kategori_barang_id AS id, kategori, " +
      "(SELECT COUNT(jenis) FROM jenis_barang WHERE jenis_barang.kategori_id = kategori_barang.Kategori_barang_id) AS jumlah_jenis " +
      "FROM kategori_barang",
    (err, rows) => {
      if (err) return res.status(500).json(err);
      let datas = rows;

      db_query(
        "SELECT " +
          "kategori_id AS kat_id," +
          "(SELECT COUNT(nama) FROM barang WHERE barang.jenis = jenis_barang.Jenis_barang_id) AS jumlah " +
          "FROM jenis_barang LEFT JOIN kategori_barang ON kategori_barang.Kategori_barang_id = jenis_barang.kategori_id",
        (err, rows) => {
          if (err) return res.status(500).json(err);
          result = [];
          for (let i = 0; i < datas.length; i++) {
            let n = 0;
            rows.map((row, index) => {
              if (row.kat_id == datas[i].id) n += row.jumlah;
            });
            obj = {
              id: datas[i].id,
              kategori: datas[i].kategori,
              jumlah_jenis: datas[i].jumlah_jenis,
              jumlah_produk: n,
            };
            result.push(obj);
          }
          return res.status(200).json(result);
        }
      );
    }
  );
});

router.get(END_POINT.jenis_barang, (req, res) => {
  db_query(
    "SELECT Jenis_barang_id AS id, jenis_barang.jenis AS jenis, kategori_barang.kategori AS kategori," +
      "(SELECT COUNT(nama) FROM barang WHERE barang.jenis = jenis_barang.Jenis_barang_id) AS jumlah  " +
      "FROM jenis_barang JOIN kategori_barang ON kategori_barang.Kategori_barang_id = jenis_barang.kategori_id",
    (err, rows) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(rows);
    }
  );
});
