// categories.js
// Daftar kategori Knowledge Garden. Ubah, tambah, atau hapus di sini saja.
//
// id          : huruf kecil tanpa spasi (dipakai di URL dan data). Jangan diubah setelah ada materi
//               yang memakainya, karena materi menyimpan id ini.
// name        : nama yang tampil.
// description : deskripsi singkat di kartu kategori.
//
// Kategori yang belum punya materi otomatis disembunyikan dari halaman publik.

export const CATEGORIES = [
    {
        id: "psychology",
        name: "Psychology & Mind",
        description: "Cara pikiran, perilaku, dan emosi bekerja."
    },
    {
        id: "biology",
        name: "Biology & Life Sciences",
        description: "Makhluk hidup, tubuh, dan cara kerja kehidupan."
    },
    {
        id: "science",
        name: "Science & Nature",
        description: "Dasar-dasar ilmu pengetahuan dan alam sekitar."
    },
    {
        id: "society",
        name: "Society & Humanity",
        description: "Masyarakat, budaya, sejarah, dan hubungan antarmanusia."
    },
    {
        id: "technology",
        name: "Technology & Computer Science",
        description: "Konsep teknologi dan dasar-dasar ilmu komputer."
    },
    {
        id: "philosophy",
        name: "Philosophy & Critical Thinking",
        description: "Cara berpikir jernih, bertanya, dan menimbang argumen."
    },
    {
        id: "religion",
        name: "Religion & Spirituality",
        description: "Agama, keyakinan, dan pencarian makna."
    },
    {
        id: "language",
        name: "Language & Communication",
        description: "Bahasa, makna kata, dan cara manusia berkomunikasi."
    }
];

export function categoryById(id) {
    return CATEGORIES.find(c => c.id === id) || null;
}
