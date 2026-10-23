
"use strict";

// ========================================
// PENGATURAN WEBSITE
// ========================================

// Ganti dengan nomor WhatsApp rumah makan Anda.
// Gunakan kode negara 62 tanpa tanda + atau angka 0 di depan.
const NOMOR_WHATSAPP = "6285863171013";

// ========================================
// DATA MENU
// Foto disimpan dalam folder images/
// ========================================

const daftarMenu = [
  {
    id: 1,
    nama: "Ayam Goreng Spesial",
    kategori: "Makanan",
    harga: 25000,
    foto: "images/ayam.jpg",
    deskripsi: "Ayam goreng gurih dengan sambal khas."
  },
  {
    id: 2,
    nama: "Rendang Sapi",
    kategori: "Makanan",
    harga: 35000,
    foto: "images/rendang.jpg",
    deskripsi: "Rendang empuk dengan rempah pilihan."
  },
  {
    id: 3,
    nama: "Bebek Goreng",
    kategori: "Makanan",
    harga: 32000,
    foto: "images/bebek.jpg",
    deskripsi: "Bebek goreng renyah dan kaya rasa."
  },
  {
    id: 4,
    nama: "Nasi Goreng Spesial",
    kategori: "Makanan",
    harga: 22000,
    foto: "images/nasi-goreng.jpg",
    deskripsi: "Nasi goreng dengan bumbu racikan spesial."
  },
  {
    id: 5,
    nama: "Soto Ayam",
    kategori: "Makanan",
    harga: 18000,
    foto: "images/soto.jpg",
    deskripsi: "Soto hangat dengan kuah gurih."
  },
  {
    id: 6,
    nama: "Ikan Bakar",
    kategori: "Makanan",
    harga: 30000,
    foto: "images/ikan-bakar.jpg",
    deskripsi: "Ikan bakar dengan sambal pilihan."
  },
  {
    id: 7,
    nama: "Es Teh Manis",
    kategori: "Minuman",
    harga: 5000,
    foto: "images/es-teh.jpg",
    deskripsi: "Es teh segar untuk menemani makan."
  },
  {
    id: 8,
    nama: "Es Jeruk",
    kategori: "Minuman",
    harga: 8000,
    foto: "images/es-jeruk.jpg",
    deskripsi: "Jeruk segar dengan rasa manis alami."
  },
  {
    id: 9,
    nama: "Jus Alpukat",
    kategori: "Minuman",
    harga: 12000,
    foto: "images/jus-alpukat.jpg",
    deskripsi: "Jus alpukat lembut dan menyegarkan."
  },
  {
    id: 10,
    nama: "Pisang Goreng",
    kategori: "Camilan",
    harga: 10000,
    foto: "images/pisang-goreng.jpg",
    deskripsi: "Pisang goreng hangat dan renyah."
  },
  {
    id: 11,
    nama: "Tahu Crispy",
    kategori: "Camilan",
    harga: 8000,
    foto: "images/tahu.jpg",
    deskripsi: "Tahu goreng renyah dengan bumbu gurih."
  },
  {
    id: 12,
    nama: "Tempe Mendoan",
    kategori: "Camilan",
    harga: 10000,
    foto: "images/mendoan.jpg",
    deskripsi: "Tempe mendoan hangat khas Nusantara."
  }
];

// ========================================
// ELEMEN HALAMAN
// ========================================

const menuGrid = document.getElementById("menuGrid");
const searchMenu = document.getElementById("searchMenu");
const emptyMessage = document.getElementById("emptyMessage");
const categories = document.getElementById("categories");

const cartButton = document.getElementById("cartButton");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");

const customerName = document.getElementById("customerName");
const customerAddress = document.getElementById("customerAddress");

let kategoriAktif = "Semua";
let keranjang = {};

// ========================================
// FORMAT RUPIAH
// ========================================

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);
}

// ========================================
// MENAMPILKAN MENU
// ========================================

function tampilkanMenu() {
  const kataKunci = searchMenu.value.trim().toLowerCase();

  const menuTerfilter = daftarMenu.filter((menu) => {
    const cocokKategori =
      kategoriAktif === "Semua" ||
      menu.kategori === kategoriAktif;

    const cocokPencarian =
      menu.nama.toLowerCase().includes(kataKunci) ||
      menu.deskripsi.toLowerCase().includes(kataKunci);

    return cocokKategori && cocokPencarian;
  });

  menuGrid.innerHTML = menuTerfilter.map((menu) => `
    <article class="menu-card">
      <div class="menu-card-image">
        <img
          src="${menu.foto}"
          alt="${menu.nama}"
          loading="lazy"
          onerror="this.style.display='none'; this.parentElement.classList.add('image-fallback')"
        >
      </div>
      <div class="menu-card-body">
        <span class="menu-tag">${menu.kategori}</span>
        <h3>${menu.nama}</h3>
        <p>${menu.deskripsi}</p>
        <div class="menu-card-bottom">
          <span class="menu-price">${formatRupiah(menu.harga)}</span>
          <button
            class="add-button"
            data-add="${menu.id}"
            aria-label="Tambah ${menu.nama} ke keranjang"
            title="Tambah ke keranjang"
          >+</button>
        </div>
      </div>
    </article>
  `).join("");

  emptyMessage.hidden = menuTerfilter.length > 0;
}

// ========================================
// FILTER DAN PENCARIAN
// ========================================

searchMenu.addEventListener("input", tampilkanMenu);

categories.addEventListener("click", (event) => {
  const tombol = event.target.closest("[data-category]");

  if (!tombol) return;

  kategoriAktif = tombol.dataset.category;

  categories.querySelectorAll(".category").forEach((item) => {
    item.classList.toggle("active", item === tombol);
  });

  tampilkanMenu();
});

// ========================================
// KERANJANG PESANAN
// ========================================

function tambahKeKeranjang(id) {
  const menu = daftarMenu.find((item) => item.id === id);

  if (!menu) return;

  if (keranjang[id]) {
    keranjang[id].jumlah++;
  } else {
    keranjang[id] = {
      ...menu,
      jumlah: 1
    };
  }

  perbaruiKeranjang();
}

function ubahJumlah(id, perubahan) {
  if (!keranjang[id]) return;

  keranjang[id].jumlah += perubahan;

  if (keranjang[id].jumlah <= 0) {
    delete keranjang[id];
  }

  perbaruiKeranjang();
}

function perbaruiKeranjang() {
  const daftarPesanan = Object.values(keranjang);

  const jumlahItem = daftarPesanan.reduce(
    (total, item) => total + item.jumlah,
    0
  );

  const totalHarga = daftarPesanan.reduce(
    (total, item) => total + item.harga * item.jumlah,
    0
  );

  cartCount.textContent = jumlahItem;
  cartTotal.textContent = formatRupiah(totalHarga);

  if (daftarPesanan.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <p style="font-size: 38px">🛒</p>
        <p>Keranjang masih kosong.</p>
        <p>Silakan pilih menu favorit Anda.</p>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = daftarPesanan.map((item) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h3>${item.nama}</h3>
        <p>${formatRupiah(item.harga * item.jumlah)}</p>
      </div>
      <div class="quantity-controls">
        <button
          data-change="${item.id}"
          data-delta="-1"
          aria-label="Kurangi ${item.nama}"
        >−</button>
        <span>${item.jumlah}</span>
        <button
          data-change="${item.id}"
          data-delta="1"
          aria-label="Tambah ${item.nama}"
        >+</button>
      </div>
    </div>
  `).join("");
}

// Tombol tambah menu
menuGrid.addEventListener("click", (event) => {
  const tombol = event.target.closest("[data-add]");

  if (!tombol) return;

  tambahKeKeranjang(Number(tombol.dataset.add));
});

// Tombol tambah atau kurangi jumlah di keranjang
cartItems.addEventListener("click", (event) => {
  const tombol = event.target.closest("[data-change]");

  if (!tombol) return;

  ubahJumlah(
    Number(tombol.dataset.change),
    Number(tombol.dataset.delta)
  );
});

// ========================================
// BUKA DAN TUTUP KERANJANG
// ========================================

function bukaKeranjang() {
  cartModal.hidden = false;
  document.body.style.overflow = "hidden";
  closeCart.focus();
}

function tutupKeranjang() {
  cartModal.hidden = true;
  document.body.style.overflow = "";
  cartButton.focus();
}

cartButton.addEventListener("click", bukaKeranjang);
closeCart.addEventListener("click", tutupKeranjang);

cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    tutupKeranjang();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !cartModal.hidden) {
    tutupKeranjang();
  }
});

// ========================================
// PESANAN MELALUI WHATSAPP
// ========================================

checkoutButton.addEventListener("click", () => {
  const daftarPesanan = Object.values(keranjang);

  if (daftarPesanan.length === 0) {
    alert("Keranjang Anda masih kosong. Silakan pilih menu.");
    return;
  }

  const nama = customerName.value.trim();
  const alamat = customerAddress.value.trim();

  if (!nama) {
    alert("Silakan isi nama pemesan terlebih dahulu.");
    customerName.focus();
    return;
  }

  if (!/^\d{9,15}$/.test(NOMOR_WHATSAPP)) {
    alert("Nomor WhatsApp pada script.js belum dikonfigurasi dengan benar.");
    return;
  }

  const total = daftarPesanan.reduce(
    (sum, item) => sum + item.harga * item.jumlah,
    0
  );

  const rincian = daftarPesanan.map((item, index) =>
    `${index + 1}. ${item.nama}\n` +
    `   ${item.jumlah} x ${formatRupiah(item.harga)} = ` +
    `${formatRupiah(item.harga * item.jumlah)}`
  ).join("\n\n");

  const pesan = [
    "*PESANAN RASA NUSANTARA*",
    "",
    `Nama: ${nama}`,
    `Alamat: ${alamat || "Belum dicantumkan"}`,
    "",
    "*Rincian pesanan:*",
    rincian,
    "",
    `*TOTAL: ${formatRupiah(total)}*`,
    "",
    "Mohon konfirmasi pesanan saya. Terima kasih!"
  ].join("\n");

  const url =
    "https://wa.me/" +
    NOMOR_WHATSAPP +
    "?text=" +
    encodeURIComponent(pesan);

  window.open(url, "_blank", "noopener,noreferrer");
});

// ========================================
// NAVIGASI MOBILE
// ========================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const terbuka = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(terbuka));
  menuToggle.setAttribute(
    "aria-label",
    terbuka ? "Tutup navigasi" : "Buka navigasi"
  );
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka navigasi");
  });
});

// ========================================
// TOMBOL KONTAK DAN TAHUN FOOTER
// ========================================

document.getElementById("contactButton").addEventListener("click", (event) => {
  event.preventDefault();

  if (!/^\d{9,15}$/.test(NOMOR_WHATSAPP)) {
    alert("Silakan atur nomor WhatsApp pada script.js.");
    return;
  }

  const pesan = encodeURIComponent(
    "Halo Rasa Nusantara, saya ingin bertanya tentang menu."
  );

  window.open(
    `https://wa.me/${NOMOR_WHATSAPP}?text=${pesan}`,
    "_blank",
    "noopener,noreferrer"
  );
});

document.getElementById("year").textContent =
  new Date().getFullYear();

// Jalankan website
tampilkanMenu();
perbaruiKeranjang();
