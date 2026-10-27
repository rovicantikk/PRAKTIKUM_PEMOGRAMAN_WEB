
/* ==================================================
   KODE BARU: MAIN.JS UNTUK FITUR CRUD PROYEK
   ================================================== */

// Mengambil elemen HTML yang digunakan
const formProyek = document.getElementById("form-proyek-crud");
const inputId = document.getElementById("crud-id");
const inputJudul = document.getElementById("crud-judul");
const inputKategori = document.getElementById("crud-kategori");
const inputAnggaran = document.getElementById("crud-anggaran");
const inputStatus = document.getElementById("crud-status");

const judulForm = document.getElementById("crud-judul-form");
const tombolSimpan = document.getElementById("crud-tombol-simpan");
const tombolBatal = document.getElementById("crud-batal-edit");

const daftarProyek = document.getElementById("crud-daftar-proyek");
const inputCari = document.getElementById("crud-cari");
const jumlahProyek = document.getElementById("crud-jumlah");

const totalProyek = document.getElementById("crud-total");
const totalSelesai = document.getElementById("crud-selesai");
const totalProses = document.getElementById("crud-proses");

// Mengambil data proyek dari localStorage
let proyek = JSON.parse(localStorage.getItem("dataProyek")) || [];


/* ==================================================
   KODE BARU: MENYIMPAN DATA KE LOCAL STORAGE
   ================================================== */

function simpanKeBrowser() {
    localStorage.setItem("dataProyek", JSON.stringify(proyek));
}


/* ==================================================
   KODE BARU: MENAMPILKAN DAFTAR PROYEK (READ)
   ================================================== */

function tampilkanProyek(kataKunci = "") {
    daftarProyek.innerHTML = "";

    const hasilPencarian = proyek.filter(function (item) {
        return item.judul.toLowerCase().includes(kataKunci.toLowerCase());
    });

    hasilPencarian.forEach(function (item) {
        const kartu = document.createElement("article");
        kartu.className = "crud-project-card";

        const informasi = document.createElement("div");
        informasi.className = "crud-project-info";

        const judul = document.createElement("h4");
        judul.textContent = item.judul;

        const kategori = document.createElement("p");
        kategori.textContent = "Kategori: " + item.kategori;

        const anggaran = document.createElement("p");
        anggaran.textContent =
            "Anggaran: " + Number(item.anggaran).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0
            });

        const status = document.createElement("span");
        status.className = item.selesai
            ? "crud-status selesai"
            : "crud-status proses";
        status.textContent = item.selesai
            ? "Selesai"
            : "Dalam Pengerjaan";

        informasi.append(judul, kategori, anggaran, status);

        const aksi = document.createElement("div");
        aksi.className = "crud-project-actions";

        const tombolEdit = document.createElement("button");
        tombolEdit.type = "button";
        tombolEdit.className = "crud-btn-edit";
        tombolEdit.textContent = "Edit";
        tombolEdit.addEventListener("click", function () {
            editProyek(item.id);
        });

        const tombolHapus = document.createElement("button");
        tombolHapus.type = "button";
        tombolHapus.className = "crud-btn-delete";
        tombolHapus.textContent = "Hapus";
        tombolHapus.addEventListener("click", function () {
            hapusProyek(item.id);
        });

        aksi.append(tombolEdit, tombolHapus);
        kartu.append(informasi, aksi);
        daftarProyek.appendChild(kartu);
    });

    jumlahProyek.textContent =
        "Menampilkan " + hasilPencarian.length + " proyek";

    if (hasilPencarian.length === 0) {
        const pesan = document.createElement("p");
        pesan.className = "crud-empty";
        pesan.textContent = kataKunci
            ? "Proyek yang dicari tidak ditemukan."
            : "Belum ada proyek. Silakan tambahkan proyek baru.";
        daftarProyek.appendChild(pesan);
    }

    perbaruiStatistik();
}


/* ==================================================
   KODE BARU: MENAMBAH PROYEK (CREATE)
   ================================================== */

formProyek.addEventListener("submit", function (event) {
    event.preventDefault();

    const dataBaru = {
        id: inputId.value || String(Date.now()),
        judul: inputJudul.value.trim(),
        kategori: inputKategori.value,
        anggaran: Number(inputAnggaran.value),
        selesai: inputStatus.checked
    };

    if (!dataBaru.judul || !dataBaru.kategori || dataBaru.anggaran <= 0) {
        alert("Silakan lengkapi data proyek dengan benar.");
        return;
    }

    if (inputId.value) {
        // Memperbarui proyek yang sudah ada
        proyek = proyek.map(function (item) {
            return item.id === inputId.value ? dataBaru : item;
        });
    } else {
        // Menambahkan proyek baru
        proyek.push(dataBaru);
    }

    simpanKeBrowser();
    tampilkanProyek(inputCari.value);
    resetForm();

    alert("Data proyek berhasil disimpan.");
});


/* ==================================================
   KODE BARU: MENGEDIT PROYEK (UPDATE)
   ================================================== */

function editProyek(id) {
    const item = proyek.find(function (data) {
        return data.id === id;
    });

    if (!item) return;

    inputId.value = item.id;
    inputJudul.value = item.judul;
    inputKategori.value = item.kategori;
    inputAnggaran.value = item.anggaran;
    inputStatus.checked = item.selesai;

    judulForm.textContent = "Edit Data Proyek";
    tombolSimpan.textContent = "Simpan Perubahan";
    tombolBatal.hidden = false;

    formProyek.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* ==================================================
   KODE BARU: MENGHAPUS PROYEK (DELETE)
   ================================================== */

function hapusProyek(id) {
    const konfirmasi = confirm(
        "Apakah kamu yakin ingin menghapus proyek ini?"
    );

    if (!konfirmasi) return;

    proyek = proyek.filter(function (item) {
        return item.id !== id;
    });

    simpanKeBrowser();
    tampilkanProyek(inputCari.value);

    if (inputId.value === id) {
        resetForm();
    }
}


/* ==================================================
   KODE BARU: MEMBATALKAN EDIT DAN RESET FORM
   ================================================== */

function resetForm() {
    formProyek.reset();
    inputId.value = "";

    judulForm.textContent = "Tambah Proyek Baru";
    tombolSimpan.textContent = "+ Tambah Proyek";
    tombolBatal.hidden = true;
}

tombolBatal.addEventListener("click", resetForm);


/* ==================================================
   KODE BARU: PENCARIAN PROYEK
   ================================================== */

inputCari.addEventListener("input", function () {
    tampilkanProyek(inputCari.value);
});


/* ==================================================
   KODE BARU: MEMPERBARUI STATISTIK DASHBOARD
   ================================================== */

function perbaruiStatistik() {
    const selesai = proyek.filter(function (item) {
        return item.selesai;
    }).length;

    totalProyek.textContent = proyek.length;
    totalSelesai.textContent = selesai;
    totalProses.textContent = proyek.length - selesai;
}


/* ==================================================
   KODE BARU: MENAMPILKAN DATA SAAT HALAMAN DIBUKA
   ================================================== */

tampilkanProyek();
