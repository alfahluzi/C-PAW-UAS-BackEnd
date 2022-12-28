const express = require("express");
const multer = require("multer");
const { db_query } = require("../../helper/db_connect_helper");
const { END_POINT } = require("../../helper/end_point_helper");
const router = express.Router();
module.exports = router;

let formatName =
  new Date().toISOString().slice(0, 10) +
  "-" +
  Math.floor(Math.random() * 10000);

const storage = multer.diskStorage({
  destination: "./public/images",
  filename: function (req, file, callback) {
    callback(null, formatName + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("file");

router.post(END_POINT.hapus_produk, (req, res) => {
  let id = req.body.id;
  db_query(`DELETE FROM barang WHERE Barang_id = ${id}`, (err, rows) => {
    if (err) return res.status(500).json(err);
    console.log("query success");
    return res.status(200).json(rows);
  });
});

router.post(END_POINT.edit_produk, upload, (req, res) => {
  let id = req.body.id;
  let nama = req.body.nama;
  let detail = req.body.detail;
  let kuantitas = req.body.kuantitas;
  let harga = req.body.harga;
  let id_jenis = req.body.id_jenis;
  let filename = formatName + "-" + req.body.filename;
  console.log("edit jenis");
  db_query(
    `UPDATE barang
    SET nama = '${nama}', 
        detail = '${detail}', 
        kuantitas = ${kuantitas}, 
        foto = '${filename}', 
        jenis = ${id_jenis}, 
        harga = ${harga} 
    WHERE Barang_id = ${id};`,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      return res.status(200).json(rows);
    }
  );
});
router.post(END_POINT.tambah_produk, upload, (req, res) => {
  let nama = req.body.nama;
  let detail = req.body.detail;
  let kuantitas = req.body.kuantitas;
  let harga = req.body.harga;
  let id_jenis = req.body.id_jenis;
  let filename = formatName + "-" + req.body.filename;
  db_query(
    `INSERT INTO barang (nama, detail, kuantitas, foto, jenis, harga)
    VALUES ("${nama}", "${detail}", ${kuantitas}, "${filename}", ${id_jenis}, ${harga});`,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      console.log("query tambah produk success");
      return res.status(200).json(rows);
    }
  );
});

router.get(END_POINT.delete_jenis, (req, res) => {
  let id = req.params.id;
  db_query(
    `DELETE FROM jenis_barang WHERE Jenis_barang_id = ${id}`,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      return res.status(200).json(rows);
    }
  );
});

router.get(END_POINT.delete_kategori, (req, res) => {
  let id = req.params.id;
  db_query(
    `DELETE FROM kategori_barang WHERE Kategori_barang_id = ${id}`,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      return res.status(200).json(rows);
    }
  );
});

router.get(END_POINT.edit_jenis, (req, res) => {
  let jenis = req.params.jenis;
  let id_kategori = req.params.id_kategori;
  let id_jenis = req.params.id_jenis;
  db_query(
    `UPDATE jenis_barang 
    SET jenis = '${jenis}', kategori_id = ${id_kategori}  
    WHERE Jenis_barang_id = ${id_jenis} `,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      return res.status(200).json(rows);
    }
  );
});

router.get(END_POINT.edit_kategori, (req, res) => {
  let kategori = req.params.kategori;
  let id = req.params.id;
  db_query(
    `UPDATE kategori_barang 
    SET kategori = '${kategori}' 
    WHERE Kategori_barang_id = ${id} `,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      return res.status(200).json(rows);
    }
  );
});

router.get(END_POINT.tambah_jenis, (req, res) => {
  let jenis = req.params.jenis;
  let id_kategori = req.params.id_kategori;
  db_query(
    `INSERT INTO jenis_barang (jenis, kategori_id) VALUES ("${jenis}", ${id_kategori});`,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(rows);
    }
  );
});
router.get(END_POINT.tambah_kategori, (req, res) => {
  let kategori = req.params.kategori;
  db_query(
    "INSERT INTO kategori_barang (kategori)" + `VALUES ("${kategori}");`,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(rows);
    }
  );
});

router.get(END_POINT.cari_barang, (req, res) => {
  let nama = req.params.nama;
  db_query(
    `SELECT * FROM barang WHERE barang.nama LIKE '%${nama}%'`,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(rows);
    }
  );
});

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
