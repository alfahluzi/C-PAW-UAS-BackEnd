const END_POINT = {
  akun: "/akun",
  barang: "/barang",
  jenis_barang: "/jenis-barang",
  kategori_barang: "/kategori-barang",
  tambah_kategori: "/tambah-kategori/:kategori",
  edit_kategori: "/edit-kategori/:kategori/:id",
  tambah_jenis: "/tambah-jenis/:jenis/:id_kategori",
  edit_jenis: "/edit-jenis/:jenis/:id_kategori/:id_jenis",
};

module.exports = { END_POINT };
