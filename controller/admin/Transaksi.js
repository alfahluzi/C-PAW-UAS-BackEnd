const express = require("express");
const { db_query } = require("../../helper/db_connect_helper");
const { END_POINT } = require("../../helper/end_point_helper");
const router = express.Router();
module.exports = router;

class ObjectData {
  constructor(id, nama, kontak, waktu, resi, item, total) {
    return {
      id: id,
      kustomer: {
        nama: nama,
        kontak: kontak,
      },
      waktu: waktu,
      resi: resi,
      item: item,
      total: total,
    };
  }
}
class Item {
  constructor(nama, detail, kuantitas) {
    return { nama: nama, detail: detail, kuantitas: kuantitas };
  }
}

router.post(END_POINT.konfirmasi_pengambilan, (req, res) => {
  let { resi, action } = req.body;
  console.log("konfirmasi pengambilan");
  console.log(resi);
  if (action == "cari") {
    db_query(
      `SELECT akun.nama, transaksi.kode_resi FROM transaksi
    JOIN akun ON akun.Akun_id = transaksi.customer_id 
    WHERE transaksi.kode_resi = ${resi}`,
      (err, rows) => {
        if (err) return res.status(500).json(err);
        console.log("query success");
        return res.status(200).json(rows);
      }
    );
  } else if (action == "konfirmasi") {
    db_query(
      `UPDATE transaksi
      SET status_pengambilan = 'c'
      WHERE transaksi.kode_resi = ${resi}`,
      (err, rows) => {
        if (err) return res.status(500).json(err);
        console.log("query success");
        return res.status(200).json(rows);
      }
    );
  }
});

router.post(END_POINT.update_pembayaran, (req, res) => {
  let { id, status } = req.body;
  console.log("update pembayaran");
  console.log(id);
  console.log(status);
  db_query(
    `UPDATE transaksi
    SET status_pembayaran = '${status}'
    WHERE Transaksi_id = ${id};`,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      return res.status(200).json(rows);
    }
  );
});
router.post(END_POINT.update_pengambilan, (req, res) => {
  let { id, status } = req.body;
  console.log("update pengambilan");
  console.log(id);
  console.log(status);
  db_query(
    `UPDATE transaksi
    SET status_pengambilan = '${status}'
    WHERE Transaksi_id = ${id};`,
    (err, rows) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      return res.status(200).json(rows);
    }
  );
});

router.get(END_POINT.data_selesai, (req, res) => {
  db_query(
    `SELECT transaksi.Transaksi_id as id, akun.nama AS nama, akun.nomor_hp AS no_hp, transaksi.waktu AS waktu, 
    transaksi.tanggal AS tanggal, transaksi.kode_resi AS resi, transaksi.foto_pembayaran AS bukti, 
    transaksi.total_harga_transaksi as total
    FROM transaksi
	JOIN akun ON akun.Akun_id = transaksi.customer_id
	WHERE transaksi.status_pembayaran = 'y' and transaksi.status_pengambilan = 'c'`,
    (err, rows1) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      db_query(
        `SELECT kode_resi, nama_barang, detail_barang, kuantitas FROM penjualan`,
        (err, rows2) => {
          if (err) return res.status(500).json(err);
          console.log("second query success");
          let arrData = [];
          rows1.map((row1) => {
            let arrItem = [];
            rows2.map((row2) => {
              if (row2.kode_resi == row1.resi) {
                arrItem.push(
                  new Item(row2.nama_barang, row2.detail_barang, row2.kuantitas)
                );
              }
            });
            arrData.push(
              new ObjectData(
                row1.id,
                row1.nama,
                row1.no_hp,
                row1.waktu + " " + row1.tanggal,
                row1.resi,
                arrItem,
                row1.total
              )
            );
          });
          return res.status(200).json(arrData);
        }
      );
    }
  );
});

router.get(END_POINT.data_pengambilan, (req, res) => {
  db_query(
    `SELECT transaksi.Transaksi_id as id,  akun.nama AS nama, akun.nomor_hp AS no_hp, transaksi.waktu AS waktu, 
    transaksi.tanggal AS tanggal, transaksi.kode_resi AS resi, transaksi.foto_pembayaran AS bukti, 
    transaksi.total_harga_transaksi as total
    FROM transaksi
	JOIN akun ON akun.Akun_id = transaksi.customer_id
	WHERE transaksi.status_pembayaran = 'y' and transaksi.status_pengambilan = 'r'`,
    (err, rows1) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      db_query(
        `SELECT kode_resi, nama_barang, detail_barang, kuantitas FROM penjualan`,
        (err, rows2) => {
          if (err) return res.status(500).json(err);
          console.log("second query success");
          let arrData = [];
          rows1.map((row1) => {
            let arrItem = [];
            rows2.map((row2) => {
              if (row2.kode_resi == row1.resi) {
                arrItem.push(
                  new Item(row2.nama_barang, row2.detail_barang, row2.kuantitas)
                );
              }
            });
            arrData.push(
              new ObjectData(
                row1.id,
                row1.nama,
                row1.no_hp,
                row1.waktu + " " + row1.tanggal,
                row1.resi,
                arrItem,
                row1.total
              )
            );
          });
          return res.status(200).json(arrData);
        }
      );
    }
  );
});

router.get(END_POINT.data_disiapkan, (req, res) => {
  db_query(
    `SELECT transaksi.Transaksi_id as id, akun.nama AS nama, akun.nomor_hp AS no_hp, transaksi.waktu AS waktu, 
    transaksi.tanggal AS tanggal, transaksi.kode_resi AS resi, transaksi.foto_pembayaran AS bukti, 
    transaksi.total_harga_transaksi as total
    FROM transaksi
	JOIN akun ON akun.Akun_id = transaksi.customer_id
	WHERE transaksi.status_pembayaran = 'y' and transaksi.status_pengambilan = 'n'`,
    (err, rows1) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      db_query(
        `SELECT kode_resi, nama_barang, detail_barang, kuantitas FROM penjualan`,
        (err, rows2) => {
          if (err) return res.status(500).json(err);
          console.log("second query success");
          let arrData = [];
          rows1.map((row1) => {
            let arrItem = [];
            rows2.map((row2) => {
              if (row2.kode_resi == row1.resi) {
                arrItem.push(
                  new Item(row2.nama_barang, row2.detail_barang, row2.kuantitas)
                );
              }
            });
            arrData.push(
              new ObjectData(
                row1.id,
                row1.nama,
                row1.no_hp,
                row1.waktu + " " + row1.tanggal,
                row1.resi,
                arrItem,
                row1.total
              )
            );
          });
          return res.status(200).json(arrData);
        }
      );
    }
  );
});

router.get(END_POINT.data_konfirmasi_pembayaran, (req, res) => {
  db_query(
    `SELECT transaksi.Transaksi_id as id, akun.nama AS nama, akun.nomor_hp AS no_hp, transaksi.waktu AS waktu, 
    transaksi.tanggal AS tanggal, transaksi.kode_resi AS resi, transaksi.foto_pembayaran AS bukti, 
    transaksi.total_harga_transaksi as total
    FROM transaksi
	JOIN akun ON akun.Akun_id = transaksi.customer_id
	WHERE transaksi.status_pembayaran = 'n'`,
    (err, rows1) => {
      if (err) return res.status(500).json(err);
      console.log("query success");
      db_query(
        `SELECT kode_resi, nama_barang, detail_barang, kuantitas FROM penjualan`,
        (err, rows2) => {
          if (err) return res.status(500).json(err);
          console.log("second query success");
          let arrData = [];
          rows1.map((row1) => {
            let arrItem = [];
            rows2.map((row2) => {
              if (row2.kode_resi == row1.resi) {
                arrItem.push(
                  new Item(row2.nama_barang, row2.detail_barang, row2.kuantitas)
                );
              }
            });
            arrData.push(
              new ObjectData(
                row1.id,
                row1.nama,
                row1.no_hp,
                row1.waktu + " " + row1.tanggal,
                row1.resi,
                arrItem,
                row1.total
              )
            );
          });
          return res.status(200).json(arrData);
        }
      );
    }
  );
});

router.get(END_POINT.laporan_penjualan, (req, res) => {
  console.log("laporan");
  db_query(
    `SELECT penjualan.penjualan_id as id,penjualan.kode_resi,penjualan.nama_barang,penjualan.kuantitas,
    penjualan.harga_jual,penjualan.harga_total
    FROM penjualan	
`,
  (err, rows) => {
  if (err) return res.status(500).json(err);
  return res.status(200).json(rows);
  }
  );
});
