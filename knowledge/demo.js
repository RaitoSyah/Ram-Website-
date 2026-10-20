// demo.js
// Materi DEMO untuk menguji tampilan Knowledge Garden. Isinya sengaja hanya contoh format,
// tanpa klaim ilmiah apa pun.
//
// Cara kerja: materi demo hanya tampil kalau koleksi "knowledge" di database MASIH KOSONG,
// dengan spanduk "Mode demo". Begitu kamu menerbitkan materi pertama, materi demo
// hilang otomatis. Untuk mematikannya sepenuhnya, ubah USE_DEMO_WHEN_EMPTY menjadi false.

export const USE_DEMO_WHEN_EMPTY = true;

export const DEMO_ITEMS = [
    {
        id: "demo-materi-singkat",
        demo: true,
        title: "Contoh Materi Singkat (DEMO)",
        category: "technology",
        summary: "Contoh format materi singkat: hanya pengertian, contoh, dan referensi.",
        tags: ["demo", "format", "contoh"],
        featured: false,
        publishedAt: Date.parse("2026-10-01"),
        updatedAt: 0,
        content: "<h2>What Is It?</h2><p>Ini contoh materi singkat. Materi singkat boleh hanya berisi pengertian, satu contoh, dan referensi, tanpa daftar isi.</p><h2>Simple Example</h2><p>Contoh konkret ditaruh di sini. Teks ini hanya demo.</p>",
        interpretation: "",
        sources: [{"title": "Sumber contoh (DEMO)", "author": "Penulis Contoh", "publication": "Situs Contoh", "year": "2026", "url": "https://example.com/", "note": "Ini sumber contoh untuk menguji tampilan, bukan sumber sungguhan."}],
        related: ["demo-materi-mendalam"]
    },
    {
        id: "demo-materi-mendalam",
        demo: true,
        title: "Contoh Materi Mendalam dengan Daftar Isi (DEMO)",
        category: "science",
        summary: "Contoh materi panjang dengan beberapa bagian, supaya daftar isi otomatis ikut tampil.",
        tags: ["demo", "format", "daftar isi"],
        featured: true,
        publishedAt: Date.parse("2026-10-02"),
        updatedAt: 0,
        content: "<h2>What Is It?</h2><p>Bagian ini berisi penjelasan singkat tentang sebuah konsep. Ini hanya contoh format, bukan materi sungguhan.</p><p>Paragraf ini hanyalah teks pengisi untuk menguji tampilan halaman, daftar isi otomatis, dan jarak antarbagian. Isinya sengaja tidak memuat klaim apa pun tentang dunia nyata. Saat kamu menulis materi asli, bagian ini diganti dengan penjelasan dari sumber yang kamu pelajari, ditulis ulang dengan bahasamu sendiri.</p><p>Paragraf ini hanyalah teks pengisi untuk menguji tampilan halaman, daftar isi otomatis, dan jarak antarbagian. Isinya sengaja tidak memuat klaim apa pun tentang dunia nyata. Saat kamu menulis materi asli, bagian ini diganti dengan penjelasan dari sumber yang kamu pelajari, ditulis ulang dengan bahasamu sendiri.</p><p>Paragraf ini hanyalah teks pengisi untuk menguji tampilan halaman, daftar isi otomatis, dan jarak antarbagian. Isinya sengaja tidak memuat klaim apa pun tentang dunia nyata. Saat kamu menulis materi asli, bagian ini diganti dengan penjelasan dari sumber yang kamu pelajari, ditulis ulang dengan bahasamu sendiri.</p><h2>How Does It Work?</h2><p>Di sini kamu menjelaskan mekanisme atau cara kerjanya, selangkah demi selangkah.</p><p>Paragraf ini hanyalah teks pengisi untuk menguji tampilan halaman, daftar isi otomatis, dan jarak antarbagian. Isinya sengaja tidak memuat klaim apa pun tentang dunia nyata. Saat kamu menulis materi asli, bagian ini diganti dengan penjelasan dari sumber yang kamu pelajari, ditulis ulang dengan bahasamu sendiri.</p><p>Paragraf ini hanyalah teks pengisi untuk menguji tampilan halaman, daftar isi otomatis, dan jarak antarbagian. Isinya sengaja tidak memuat klaim apa pun tentang dunia nyata. Saat kamu menulis materi asli, bagian ini diganti dengan penjelasan dari sumber yang kamu pelajari, ditulis ulang dengan bahasamu sendiri.</p><p>Paragraf ini hanyalah teks pengisi untuk menguji tampilan halaman, daftar isi otomatis, dan jarak antarbagian. Isinya sengaja tidak memuat klaim apa pun tentang dunia nyata. Saat kamu menulis materi asli, bagian ini diganti dengan penjelasan dari sumber yang kamu pelajari, ditulis ulang dengan bahasamu sendiri.</p><h3>Subbagian contoh</h3><p>Materi yang lebih kompleks boleh memiliki subbagian seperti ini.</p><p>Paragraf ini hanyalah teks pengisi untuk menguji tampilan halaman, daftar isi otomatis, dan jarak antarbagian. Isinya sengaja tidak memuat klaim apa pun tentang dunia nyata. Saat kamu menulis materi asli, bagian ini diganti dengan penjelasan dari sumber yang kamu pelajari, ditulis ulang dengan bahasamu sendiri.</p><p>Paragraf ini hanyalah teks pengisi untuk menguji tampilan halaman, daftar isi otomatis, dan jarak antarbagian. Isinya sengaja tidak memuat klaim apa pun tentang dunia nyata. Saat kamu menulis materi asli, bagian ini diganti dengan penjelasan dari sumber yang kamu pelajari, ditulis ulang dengan bahasamu sendiri.</p><h2>Simple Example</h2><p>Contoh konkret dalam kehidupan sehari-hari ditaruh di sini.</p><p>Paragraf ini hanyalah teks pengisi untuk menguji tampilan halaman, daftar isi otomatis, dan jarak antarbagian. Isinya sengaja tidak memuat klaim apa pun tentang dunia nyata. Saat kamu menulis materi asli, bagian ini diganti dengan penjelasan dari sumber yang kamu pelajari, ditulis ulang dengan bahasamu sendiri.</p><p>Paragraf ini hanyalah teks pengisi untuk menguji tampilan halaman, daftar isi otomatis, dan jarak antarbagian. Isinya sengaja tidak memuat klaim apa pun tentang dunia nyata. Saat kamu menulis materi asli, bagian ini diganti dengan penjelasan dari sumber yang kamu pelajari, ditulis ulang dengan bahasamu sendiri.</p><h2>Why Does It Matter?</h2><p>Mengapa konsep ini penting untuk dipahami.</p><p>Paragraf ini hanyalah teks pengisi untuk menguji tampilan halaman, daftar isi otomatis, dan jarak antarbagian. Isinya sengaja tidak memuat klaim apa pun tentang dunia nyata. Saat kamu menulis materi asli, bagian ini diganti dengan penjelasan dari sumber yang kamu pelajari, ditulis ulang dengan bahasamu sendiri.</p><p>Paragraf ini hanyalah teks pengisi untuk menguji tampilan halaman, daftar isi otomatis, dan jarak antarbagian. Isinya sengaja tidak memuat klaim apa pun tentang dunia nyata. Saat kamu menulis materi asli, bagian ini diganti dengan penjelasan dari sumber yang kamu pelajari, ditulis ulang dengan bahasamu sendiri.</p><h2>Important Notes</h2><p>Batasan, pengecualian, atau kesalahpahaman umum.</p><p>Paragraf ini hanyalah teks pengisi untuk menguji tampilan halaman, daftar isi otomatis, dan jarak antarbagian. Isinya sengaja tidak memuat klaim apa pun tentang dunia nyata. Saat kamu menulis materi asli, bagian ini diganti dengan penjelasan dari sumber yang kamu pelajari, ditulis ulang dengan bahasamu sendiri.</p><p>Paragraf ini hanyalah teks pengisi untuk menguji tampilan halaman, daftar isi otomatis, dan jarak antarbagian. Isinya sengaja tidak memuat klaim apa pun tentang dunia nyata. Saat kamu menulis materi asli, bagian ini diganti dengan penjelasan dari sumber yang kamu pelajari, ditulis ulang dengan bahasamu sendiri.</p>",
        interpretation: "",
        sources: [{"title": "Sumber contoh (DEMO)", "author": "Penulis Contoh", "publication": "Situs Contoh", "year": "2026", "url": "https://example.com/", "note": "Ini sumber contoh untuk menguji tampilan, bukan sumber sungguhan."}],
        related: ["demo-materi-singkat", "demo-fakta-dan-interpretasi"]
    },
    {
        id: "demo-referensi",
        demo: true,
        title: "Contoh Cara Menampilkan Referensi (DEMO)",
        category: "language",
        summary: "Contoh daftar pustaka: penulis, tahun, judul, publikasi, tautan, dan catatan bagian yang didukung.",
        tags: ["demo", "referensi", "contoh"],
        featured: false,
        publishedAt: Date.parse("2026-10-03"),
        updatedAt: 0,
        content: "<h2>What Is It?</h2><p>Setiap materi bisa memuat daftar pustaka. Tiap sumber bisa dilengkapi nama penulis, tahun, judul, nama publikasi, tautan, dan catatan singkat tentang bagian yang didukungnya.</p><p>Lihat bagian Referensi di bawah halaman ini sebagai contoh tampilannya.</p>",
        interpretation: "",
        sources: [{"title": "Sumber contoh (DEMO)", "author": "Penulis Contoh", "publication": "Situs Contoh", "year": "2026", "url": "https://example.com/", "note": "Ini sumber contoh untuk menguji tampilan, bukan sumber sungguhan."}],
        related: ["demo-fakta-dan-interpretasi"]
    },
    {
        id: "demo-kategori-dan-tag",
        demo: true,
        title: "Contoh Kategori dan Tag (DEMO)",
        category: "society",
        summary: "Contoh bagaimana satu kategori utama dan beberapa tag menghubungkan materi.",
        tags: ["demo", "tag", "kategori"],
        featured: false,
        publishedAt: Date.parse("2026-10-04"),
        updatedAt: 0,
        content: "<h2>What Is It?</h2><p>Setiap materi punya satu kategori utama, dan boleh punya beberapa tag. Tag yang sama bisa dipakai di banyak materi, dan mengetuknya menampilkan materi lain dengan tag itu.</p>",
        interpretation: "",
        sources: [{"title": "Sumber contoh (DEMO)", "author": "Penulis Contoh", "publication": "Situs Contoh", "year": "2026", "url": "https://example.com/", "note": "Ini sumber contoh untuk menguji tampilan, bukan sumber sungguhan."}],
        related: ["demo-materi-singkat", "demo-referensi"]
    },
    {
        id: "demo-fakta-dan-interpretasi",
        demo: true,
        title: "Contoh Memisahkan Fakta dan Interpretasi (DEMO)",
        category: "philosophy",
        summary: "Contoh kotak Interpretasi penulis, supaya pendapat pribadi tidak tercampur dengan informasi bersumber.",
        tags: ["demo", "interpretasi", "berpikir kritis"],
        featured: true,
        publishedAt: Date.parse("2026-10-05"),
        updatedAt: 0,
        content: "<h2>What Is It?</h2><p>Isi utama materi adalah informasi yang dirangkum dari sumber. Pendapat pribadi penulis dipisahkan ke dalam kotak tersendiri di bawah isi, supaya pembaca bisa membedakannya.</p>",
        interpretation: "Ini contoh interpretasi pribadi penulis. Isinya adalah pandangan penulis, bukan fakta yang sudah terverifikasi.",
        sources: [{"title": "Sumber contoh (DEMO)", "author": "Penulis Contoh", "publication": "Situs Contoh", "year": "2026", "url": "https://example.com/", "note": "Ini sumber contoh untuk menguji tampilan, bukan sumber sungguhan."}],
        related: ["demo-referensi"]
    },
    {
        id: "demo-materi-terkait",
        demo: true,
        title: "Contoh Materi Terkait (DEMO)",
        category: "psychology",
        summary: "Contoh bagian Materi terkait di bawah sebuah materi, dipilih lewat editor atau kesamaan tag.",
        tags: ["demo", "contoh", "format"],
        featured: false,
        publishedAt: Date.parse("2026-10-06"),
        updatedAt: 0,
        content: "<h2>What Is It?</h2><p>Di bawah setiap materi ada bagian materi terkait. Materi terkait bisa dipilih manual lewat editor, dan sisanya dilengkapi otomatis dari kesamaan tag.</p>",
        interpretation: "",
        sources: [{"title": "Sumber contoh (DEMO)", "author": "Penulis Contoh", "publication": "Situs Contoh", "year": "2026", "url": "https://example.com/", "note": "Ini sumber contoh untuk menguji tampilan, bukan sumber sungguhan."}],
        related: ["demo-materi-mendalam", "demo-kategori-dan-tag"]
    },
];
