const END_POINT = {
  dc: "/dc",
  akun: "/akun",
  barang: "/barang",
  tambah_produk: "/tambah-produk",
  edit_produk: "/edit-produk",
  hapus_produk: "/hapus-produk",
  cari_barang: "/cari-barang/:nama",
  jenis_barang: "/jenis-barang",
  kategori_barang: "/kategori-barang",
  tambah_kategori: "/tambah-kategori/:kategori",
  edit_kategori: "/edit-kategori/:kategori/:id",
  tambah_jenis: "/tambah-jenis/:jenis/:id_kategori",
  edit_jenis: "/edit-jenis/:jenis/:id_kategori/:id_jenis",
  delete_kategori: "/delete-kategori/:id",
  delete_jenis: "/delete-jenis/:id",
  data_konfirmasi_pembayaran: "/data-konfirmasi-pembayaran",
  data_disiapkan: "/data-disiapkan",
  data_pengambilan: "/data-pengambilan",
  data_selesai: "/data-selesai",
  update_pengambilan: "/update-pengambilan",
  update_pembayaran: "/update-pembayaran",
  konfirmasi_pengambilan: "/konfirmasi-pengambilan",  
  laporan_penjualan:"/laporan-penjualan"
};

module.exports = { END_POINT };
