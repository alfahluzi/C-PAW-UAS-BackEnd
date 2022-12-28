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

router.post(END_POINT.edit_keranjang, (req, res) => {
  let { akun_id, barang_id, action } = req.body;
  if (action == "tambah") {
    db_query(
      `UPDATE keranjang
      SET kuantitas = kuantitas + 1
      WHERE akun_id = ${akun_id} AND barang_id = ${barang_id}`,
      (err, rows) => {
        if (err) return res.status(500).json(err);
        console.log("query success");
        return res.status(200).json(rows);
      }
    );
  } else if (action == "kurang") {
    db_query(
      `UPDATE keranjang
        SET kuantitas = kuantitas - 1
        WHERE akun_id = ${akun_id} AND barang_id = ${barang_id}`,
      (err, rows) => {
        if (err) return res.status(500).json(err);
        console.log("query success");
        return res.status(200).json(rows);
      }
    );
  } else if (action == "hapus") {
    db_query(
      `DELETE FROM keranjang WHERE akun_id = ${akun_id} AND barang_id = ${barang_id}`,
      (err, rows) => {
        if (err) return res.status(500).json(err);
        console.log("query success");
        return res.status(200).json(rows);
      }
    );
  }
});
router.post(END_POINT.tambah_keranjang, (req, res) => {
  let { akun_id, barang_id } = req.body;
  db_query(
    `SELECT * FROM keranjang 
    WHERE akun_id = 1 AND barang_id = ${barang_id}
  `,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      if (rows.length > 0) {
        db_query(
          `UPDATE keranjang
        SET kuantitas = kuantitas + 1
        WHERE akun_id = ${akun_id} AND barang_id = ${barang_id}`,
          (err, rows) => {
            if (err) return res.status(500).json(err);
            console.log("query success");
            return res.status(200).json(rows);
          }
        );
      } else {
        db_query(
          `INSERT INTO keranjang (akun_id, barang_id, kuantitas)
                VALUES (${akun_id}, ${barang_id}, 1)
                `,
          (err, rows) => {
            if (err) return res.status(500).json(err);
            console.log("query success");
            return res.status(200).json(rows);
          }
        );
      }
    }
  );
});
router.post(END_POINT.keranjang, (req, res) => {
  let { akun_id } = req.body;
  db_query(
    `SELECT barang.Barang_id, barang.nama, barang.detail, barang.foto, barang.harga, keranjang.kuantitas FROM keranjang 
    JOIN barang on barang.Barang_id = keranjang.barang_id
    WHERE keranjang.akun_id = ${akun_id}`,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      return res.status(200).json(rows);
    }
  );
});
router.post(END_POINT.bayar, upload, (req, res) => {
  let { id, resi, totalTransaksi } = req.body;
  let fileName = formatName + "-" + req.body.fileName;
  console.log(id);
  console.log(resi);
  console.log(fileName);
  var d = new Date();
  let waktu = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  let tanggal = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
  //buat transaksi
  db_query(
    `INSERT INTO 
    transaksi (customer_id, waktu, tanggal, total_harga_transaksi, foto_pembayaran, kode_resi)
  VALUES (${id}, '${waktu}', '${tanggal}', ${totalTransaksi}, '${fileName}', ${resi})
  `,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      //buat data penjualan
      db_query(
        `
      INSERT INTO penjualan (kode_resi, id_barang, nama_barang, detail_barang, kuantitas, harga_jual, harga_total)
      SELECT ${resi}, keranjang.barang_id, barang.nama, barang.detail, keranjang.kuantitas, barang.harga, (barang.harga * keranjang.kuantitas) 
      FROM keranjang JOIN barang ON barang.Barang_id = keranjang.barang_id
      `,
        (err, rows) => {
          if (err) return res.status(500).json(err);
          console.log("query success");
          //hapus keranjang
          db_query(
            `DELETE FROM keranjang WHERE akun_id = ${id};`,
            (err, rows) => {
              if (err) return res.status(500).json(err);
              console.log("query success");
              console.log("bayar selesai");
              return res.status(200).json(rows);
            }
          );
        }
      );
    }
  );
});

router.post(END_POINT.login, (req, res) => {
  let { nama, password } = req.body;
  db_query(
    `SELECT * FROM akun 
    WHERE nama = '${nama}' AND password = '${password}'`,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      return res.status(200).json(rows);
    }
  );
});
router.post(END_POINT.registration, (req, res) => {
  let { nama, hp, password } = req.body;
  db_query(
    `INSERT INTO akun (nama, nomor_hp, password) 
    VALUES ('${nama}', ${hp}, '${password}')`,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      return res.status(200).json(rows);
    }
  );
});
