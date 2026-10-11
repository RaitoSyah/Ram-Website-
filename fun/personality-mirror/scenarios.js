// scenarios.js
// DATA SKENARIO Personality Mirror.
//
// Ganti isi SCENARIOS dengan 25 skenario aslimu (5 per dimensi), lalu ubah
// IS_PLACEHOLDER menjadi false. Selama IS_PLACEHOLDER = true, halaman menampilkan
// spanduk "data uji" supaya data contoh tidak sengaja ikut tayang.
//
// Format tiap skenario:
//   id        : unik, mis. "E1"
//   trait     : "O" | "C" | "E" | "A" | "N"
//   facet     : nama facet (untuk catatanmu, tidak ditampilkan)
//   title     : judul singkat
//   situation : deskripsi situasi
//   options   : TEPAT 4 pilihan { id, text, v }
//               v = 1 kutub rendah dimensi, 2 agak rendah, 3 agak tinggi, 4 kutub tinggi
//               (tiap nilai dipakai sekali per skenario)
//
// PENTING: SCENARIOS_VERSION menjadi bagian dari kode hasil. Setiap kali isi skenario
// atau urutan pilihan diubah setelah kode dibagikan, naikkan angkanya (0 sampai 63).
// Kode dari versi lama otomatis ditolak dengan pesan yang jelas.
//
// Periksa data di halaman check.html sebelum dipublikasikan.

export const SCENARIOS_VERSION = 1;

export const IS_PLACEHOLDER = false;

export const scenarios = [
    // ==========================================
    // O — OPENNESS TO EXPERIENCE
    // ==========================================

    {
        id: "O1",
        trait: "O",
        facet: "Imajinasi",
        title: "Dunia di Balik Jendela",
        situation: "Kamu sedang duduk di kendaraan dalam perjalanan yang cukup panjang. Pemandangan di luar terlihat biasa saja, tetapi kamu mulai membayangkan berbagai cerita tentang orang-orang dan tempat yang kamu lewati.",
        options: [
            {
                id: "a",
                text: "Menikmati pemandangan sebagaimana adanya tanpa terlalu memikirkan kemungkinan lain.",
                v: 1
            },
            {
                id: "b",
                text: "Sesekali membayangkan cerita tentang tempat yang menarik perhatianku.",
                v: 2
            },
            {
                id: "c",
                text: "Mulai menyusun berbagai kemungkinan cerita berdasarkan hal-hal yang kulihat.",
                v: 3
            },
            {
                id: "d",
                text: "Membayangkan berbagai dunia dan cerita berbeda dari pemandangan sederhana itu.",
                v: 4
            }
        ]
    },

    {
        id: "O2",
        trait: "O",
        facet: "Minat seni dan estetika",
        title: "Galeri yang Tak Direncanakan",
        situation: "Saat berjalan-jalan, kamu menemukan galeri kecil berisi lukisan, instalasi seni, dan karya abstrak yang belum pernah kamu lihat sebelumnya. Kamu tidak mengenal seniman-senimannya dan tidak ada kewajiban untuk masuk.",
        options: [
            {
                id: "a",
                text: "Melewatinya karena biasanya aku tidak terlalu tertarik dengan pameran semacam itu.",
                v: 1
            },
            {
                id: "b",
                text: "Masuk sebentar jika ada karya yang langsung menarik perhatianku.",
                v: 2
            },
            {
                id: "c",
                text: "Melihat-lihat beberapa karya dan mencoba memahami kesan yang ditimbulkannya.",
                v: 3
            },
            {
                id: "d",
                text: "Menjelajahi hampir seluruh galeri untuk menikmati detail dan berbagai bentuk ekspresi artistik.",
                v: 4
            }
        ]
    },

    {
        id: "O3",
        trait: "O",
        facet: "Petualangan dan pengalaman baru",
        title: "Rute yang Belum Pernah Dicoba",
        situation: "Kamu memiliki waktu luang saat berada di suatu tempat yang cukup aman. Ada jalan kecil menuju kawasan yang belum pernah kamu kunjungi, sedangkan rute yang biasa kamu lewati sudah sangat familier.",
        options: [
            {
                id: "a",
                text: "Memilih rute yang sudah kukenal karena lebih sesuai dengan kebiasaanku.",
                v: 1
            },
            {
                id: "b",
                text: "Tetap melalui rute biasa, tetapi mungkin mencoba jalan baru di kesempatan lain.",
                v: 2
            },
            {
                id: "c",
                text: "Mencoba jalan baru jika masih punya cukup waktu untuk kembali.",
                v: 3
            },
            {
                id: "d",
                text: "Memilih jalan baru karena penasaran dengan tempat yang belum pernah kulihat.",
                v: 4
            }
        ]
    },

    {
        id: "O4",
        trait: "O",
        facet: "Gagasan dan intelektual",
        title: "Teori yang Aneh",
        situation: "Seorang teman menceritakan sebuah gagasan yang terdengar tidak biasa tentang bagaimana dunia bekerja. Penjelasannya belum tentu benar, tetapi cukup menarik untuk dipikirkan.",
        options: [
            {
                id: "a",
                text: "Lebih memilih membahas sesuatu yang sudah jelas dan bisa langsung diterapkan.",
                v: 1
            },
            {
                id: "b",
                text: "Mendengarkan gagasannya, tetapi tidak terlalu tertarik membahasnya lebih jauh.",
                v: 2
            },
            {
                id: "c",
                text: "Mempertimbangkan gagasan itu dan mencari tahu alasan di baliknya.",
                v: 3
            },
            {
                id: "d",
                text: "Menikmati diskusi tersebut dengan mengeksplorasi berbagai kemungkinan dan sudut pandang.",
                v: 4
            }
        ]
    },

    {
        id: "O5",
        trait: "O",
        facet: "Nilai dan keterbukaan pandangan",
        title: "Pendapat yang Berbeda",
        situation: "Dalam sebuah diskusi, kamu mendengar pendapat yang bertentangan dengan pandangan yang selama ini kamu pegang. Orang tersebut menyampaikan alasannya dengan cukup masuk akal, meskipun kamu belum tentu setuju.",
        options: [
            {
                id: "a",
                text: "Tetap berpegang pada pandanganku dan tidak merasa perlu mengeksplorasi pendapat tersebut.",
                v: 1
            },
            {
                id: "b",
                text: "Mendengarkan pendapatnya, tetapi cenderung mempertahankan pandanganku semula.",
                v: 2
            },
            {
                id: "c",
                text: "Mempertimbangkan argumennya dan melihat apakah ada hal yang perlu kupikirkan ulang.",
                v: 3
            },
            {
                id: "d",
                text: "Mengeksplorasi sudut pandangnya secara mendalam, termasuk kemungkinan mengubah pendapatku.",
                v: 4
            }
        ]
    },


    // ==========================================
    // C — CONSCIENTIOUSNESS
    // ==========================================

    {
        id: "C1",
        trait: "C",
        facet: "Merasa mampu",
        title: "Tugas yang Belum Pernah Dicoba",
        situation: "Kamu mendapat tugas yang belum pernah kamu kerjakan sebelumnya. Petunjuknya cukup jelas, tetapi kamu masih harus mencari tahu beberapa hal sendiri sebelum bisa menyelesaikannya.",
        options: [
            {
                id: "a",
                text: "Merasa kesulitan memulai dan cenderung menunggu bantuan sebelum mengerjakannya.",
                v: 1
            },
            {
                id: "b",
                text: "Mencoba bagian yang mudah terlebih dahulu sambil menunggu petunjuk tambahan.",
                v: 2
            },
            {
                id: "c",
                text: "Mempelajari petunjuk dan mencoba menyelesaikannya secara bertahap.",
                v: 3
            },
            {
                id: "d",
                text: "Menyusun langkah pengerjaan sendiri dan mencoba menyelesaikannya sampai tuntas.",
                v: 4
            }
        ]
    },

    {
        id: "C2",
        trait: "C",
        facet: "Keteraturan",
        title: "Meja yang Penuh Barang",
        situation: "Mejamu mulai dipenuhi buku, kabel, catatan, dan barang-barang yang digunakan selama beberapa hari terakhir. Kamu masih bisa menemukan barang yang dibutuhkan, tetapi susunannya mulai tidak teratur.",
        options: [
            {
                id: "a",
                text: "Membiarkannya seperti sekarang selama barang-barang yang kubutuhkan masih bisa ditemukan.",
                v: 1
            },
            {
                id: "b",
                text: "Merapikan bagian yang mengganggu ketika mulai membutuhkan ruang tambahan.",
                v: 2
            },
            {
                id: "c",
                text: "Menyisihkan waktu untuk mengembalikan sebagian besar barang ke tempatnya.",
                v: 3
            },
            {
                id: "d",
                text: "Mengatur barang-barang secara teratur agar meja siap digunakan untuk kegiatan berikutnya.",
                v: 4
            }
        ]
    },

    {
        id: "C3",
        trait: "C",
        facet: "Tanggung jawab",
        title: "Bagian yang Belum Selesai",
        situation: "Kamu mengerjakan tugas kelompok dan bertanggung jawab atas satu bagian penting. Mendekati waktu pengumpulan, kamu menyadari bahwa bagianmu masih belum selesai, sementara anggota lain sudah menyelesaikan tugas mereka.",
        options: [
            {
                id: "a",
                text: "Menunggu anggota lain mengingatkanku sebelum memutuskan langkah berikutnya.",
                v: 1
            },
            {
                id: "b",
                text: "Menyelesaikan bagian yang tersisa jika masih memungkinkan sebelum tenggat.",
                v: 2
            },
            {
                id: "c",
                text: "Segera mengatur waktu untuk menyelesaikannya dan memberi kabar kepada kelompok.",
                v: 3
            },
            {
                id: "d",
                text: "Mengambil langkah konkret untuk menuntaskan bagianku dan memastikan kelompok mengetahui perkembangannya.",
                v: 4
            }
        ]
    },

    {
        id: "C4",
        trait: "C",
        facet: "Dorongan berprestasi",
        title: "Proyek Pribadi",
        situation: "Kamu memulai proyek pribadi yang cukup menarik, tetapi hasilnya tidak akan dinilai siapa pun dan tidak ada tenggat yang ditentukan. Setelah beberapa hari, rasa antusiasmu mulai berkurang.",
        options: [
            {
                id: "a",
                text: "Membiarkan proyek itu berhenti dan mungkin kembali mengerjakannya jika tertarik lagi.",
                v: 1
            },
            {
                id: "b",
                text: "Mengerjakannya sesekali ketika sedang ingin melanjutkan.",
                v: 2
            },
            {
                id: "c",
                text: "Menentukan target sederhana agar proyeknya tetap bergerak maju.",
                v: 3
            },
            {
                id: "d",
                text: "Membuat target yang jelas dan berusaha mencapai hasil yang sudah kubayangkan.",
                v: 4
            }
        ]
    },

    {
        id: "C5",
        trait: "C",
        facet: "Kehati-hatian",
        title: "Tombol Kirim",
        situation: "Kamu akan mengirim pesan penting kepada guru, rekan kerja, atau seseorang yang perlu menerima informasi dengan tepat. Pesannya sudah selesai ditulis dan kamu bisa langsung mengirimkannya.",
        options: [
            {
                id: "a",
                text: "Langsung mengirimnya setelah merasa isi utamanya sudah tersampaikan.",
                v: 1
            },
            {
                id: "b",
                text: "Membaca ulang sekilas untuk memastikan tidak ada kesalahan yang terlihat.",
                v: 2
            },
            {
                id: "c",
                text: "Memeriksa isi, penerima, dan informasi penting sebelum mengirim.",
                v: 3
            },
            {
                id: "d",
                text: "Memeriksa kembali isi dan konteks pesan secara menyeluruh sebelum mengirimkannya.",
                v: 4
            }
        ]
    },


    // ==========================================
    // E — EXTRAVERSION
    // ==========================================

    {
        id: "E1",
        trait: "E",
        facet: "Keramahan",
        title: "Orang Baru di Ruangan",
        situation: "Kamu datang ke sebuah kegiatan dan duduk di dekat seseorang yang belum kamu kenal. Kalian sedang menunggu acara dimulai, dan suasananya cukup santai.",
        options: [
            {
                id: "a",
                text: "Menunggu sampai orang itu memulai percakapan atau kegiatan dimulai.",
                v: 1
            },
            {
                id: "b",
                text: "Memberi senyum atau sapaan singkat jika ada kesempatan yang terasa alami.",
                v: 2
            },
            {
                id: "c",
                text: "Memulai percakapan ringan tentang acara yang sedang berlangsung.",
                v: 3
            },
            {
                id: "d",
                text: "Menyapa dengan santai dan mencoba mengenal orang itu melalui percakapan.",
                v: 4
            }
        ]
    },

    {
        id: "E2",
        trait: "E",
        facet: "Kesukaan berkumpul",
        title: "Akhir Pekan yang Kosong",
        situation: "Akhir pekan ini kamu tidak memiliki tugas mendesak atau janji tertentu. Beberapa teman mengajak berkumpul, sementara kamu juga bisa menikmati waktu luang dengan kegiatan sendiri.",
        options: [
            {
                id: "a",
                text: "Lebih memilih menghabiskan waktu sendiri dengan kegiatan yang kusukai.",
                v: 1
            },
            {
                id: "b",
                text: "Mempertimbangkan ajakan berkumpul jika suasana dan waktunya cocok.",
                v: 2
            },
            {
                id: "c",
                text: "Cenderung menerima ajakan karena menikmati kesempatan bertemu teman.",
                v: 3
            },
            {
                id: "d",
                text: "Mencari kesempatan untuk berkumpul dan menghabiskan banyak waktu bersama teman.",
                v: 4
            }
        ]
    },

    {
        id: "E3",
        trait: "E",
        facet: "Ketegasan",
        title: "Diskusi yang Terhenti",
        situation: "Dalam diskusi kelompok, semua orang sedang menunggu keputusan, tetapi belum ada yang menyampaikan pendapat dengan jelas. Kamu punya gagasan yang bisa dipertimbangkan, meskipun belum tentu disetujui semua orang.",
        options: [
            {
                id: "a",
                text: "Menunggu anggota lain menyampaikan pendapat sebelum ikut berbicara.",
                v: 1
            },
            {
                id: "b",
                text: "Menyampaikan gagasan jika ada orang yang meminta pendapatku.",
                v: 2
            },
            {
                id: "c",
                text: "Mengusulkan gagasanku ketika melihat kesempatan untuk berbicara.",
                v: 3
            },
            {
                id: "d",
                text: "Mengawali diskusi dengan menyampaikan gagasan dan mengajak kelompok mempertimbangkannya.",
                v: 4
            }
        ]
    },

    {
        id: "E4",
        trait: "E",
        facet: "Tingkat aktivitas",
        title: "Hari yang Penuh Waktu Luang",
        situation: "Kamu memiliki satu hari tanpa jadwal wajib. Ada beberapa hal yang bisa dilakukan di luar rumah, sementara kamu juga dapat menghabiskan hari dengan aktivitas santai di rumah.",
        options: [
            {
                id: "a",
                text: "Menghabiskan sebagian besar hari dengan kegiatan santai dan sedikit perpindahan aktivitas.",
                v: 1
            },
            {
                id: "b",
                text: "Melakukan satu atau dua kegiatan ringan tanpa membuat jadwal yang padat.",
                v: 2
            },
            {
                id: "c",
                text: "Mengisi hari dengan beberapa kegiatan yang berbeda sepanjang waktu luang.",
                v: 3
            },
            {
                id: "d",
                text: "Menikmati hari yang penuh aktivitas dan berpindah dari satu kegiatan ke kegiatan lain.",
                v: 4
            }
        ]
    },

    {
        id: "E5",
        trait: "E",
        facet: "Pencarian sensasi",
        title: "Wahana yang Belum Dicoba",
        situation: "Kamu mengunjungi taman hiburan dan melihat wahana baru yang terkenal dengan gerakan cepat serta pengalaman yang intens. Wahana itu memenuhi standar keselamatan, tetapi kamu belum pernah mencobanya.",
        options: [
            {
                id: "a",
                text: "Memilih wahana yang sudah kukenal dan terasa lebih nyaman bagiku.",
                v: 1
            },
            {
                id: "b",
                text: "Mempertimbangkan wahana itu, tetapi kemungkinan memilih aktivitas yang lebih familier.",
                v: 2
            },
            {
                id: "c",
                text: "Tertarik mencobanya setelah mengetahui aturan dan pengalaman yang akan didapat.",
                v: 3
            },
            {
                id: "d",
                text: "Merasa antusias mencoba pengalaman intens yang belum pernah kurasakan.",
                v: 4
            }
        ]
    },


    // ==========================================
    // A — AGREEABLENESS
    // ==========================================

    {
        id: "A1",
        trait: "A",
        facet: "Kepercayaan",
        title: "Cerita dari Teman Baru",
        situation: "Kamu baru mengenal seseorang yang bercerita tentang pengalaman pribadinya. Ceritanya terdengar masuk akal, tetapi kamu belum memiliki cukup pengalaman untuk mengetahui seberapa dapat dipercaya orang tersebut.",
        options: [
            {
                id: "a",
                text: "Menunggu lebih banyak bukti atau pengalaman sebelum mempercayai ceritanya.",
                v: 1
            },
            {
                id: "b",
                text: "Menerima ceritanya sebagai kemungkinan, sambil tetap mempertimbangkan ketidakpastian.",
                v: 2
            },
            {
                id: "c",
                text: "Cenderung mempercayai ceritanya selama tidak ada alasan khusus untuk meragukannya.",
                v: 3
            },
            {
                id: "d",
                text: "Memberikan kepercayaan awal dan berusaha memahami ceritanya dari sudut pandang orang tersebut.",
                v: 4
            }
        ]
    },

    {
        id: "A2",
        trait: "A",
        facet: "Ketulusan dan moral",
        title: "Barang yang Tertinggal",
        situation: "Kamu menemukan barang milik seseorang di tempat umum. Tidak ada orang di sekitar yang melihat saat kamu menemukannya, dan pemiliknya belum terlihat.",
        options: [
            {
                id: "a",
                text: "Mempertimbangkan situasinya terlebih dahulu sebelum menentukan apa yang akan dilakukan.",
                v: 1
            },
            {
                id: "b",
                text: "Menyimpannya sementara dan melihat apakah ada orang yang mencari barang tersebut.",
                v: 2
            },
            {
                id: "c",
                text: "Mencoba menyerahkannya kepada petugas atau mencari cara menghubungi pemiliknya.",
                v: 3
            },
            {
                id: "d",
                text: "Segera mencari cara yang tepat agar barang itu bisa kembali kepada pemiliknya.",
                v: 4
            }
        ]
    },

    {
        id: "A3",
        trait: "A",
        facet: "Altruisme",
        title: "Teman yang Kewalahan",
        situation: "Seorang teman sedang kewalahan mengurus beberapa keperluan. Kamu juga memiliki kegiatan sendiri hari itu, tetapi masih punya sedikit waktu luang yang bisa digunakan untuk membantu.",
        options: [
            {
                id: "a",
                text: "Tetap berfokus pada kegiatanku sendiri dan membiarkannya mencari bantuan lain.",
                v: 1
            },
            {
                id: "b",
                text: "Menawarkan bantuan jika ada bagian kecil yang bisa kuselesaikan tanpa mengubah banyak rencana.",
                v: 2
            },
            {
                id: "c",
                text: "Meluangkan sebagian waktu untuk membantu menyelesaikan keperluannya.",
                v: 3
            },
            {
                id: "d",
                text: "Mencari cara agar aku bisa memberikan bantuan yang cukup berarti sesuai kemampuanku.",
                v: 4
            }
        ]
    },

    {
        id: "A4",
        trait: "A",
        facet: "Kerja sama",
        title: "Ide yang Bertabrakan",
        situation: "Dalam sebuah proyek kelompok, kamu dan anggota lain memiliki gagasan berbeda mengenai cara menyelesaikannya. Kedua gagasan punya kelebihan masing-masing, tetapi waktu diskusi terbatas.",
        options: [
            {
                id: "a",
                text: "Mempertahankan gagasanku dan memilih cara yang menurutku paling sesuai.",
                v: 1
            },
            {
                id: "b",
                text: "Mendengarkan gagasan lain, tetapi tetap berharap kelompok menggunakan usulanku.",
                v: 2
            },
            {
                id: "c",
                text: "Membandingkan kedua gagasan dan mencari pilihan yang dapat diterima bersama.",
                v: 3
            },
            {
                id: "d",
                text: "Mengajak kelompok menggabungkan gagasan jika memungkinkan agar semua pihak dapat berkontribusi.",
                v: 4
            }
        ]
    },

    {
        id: "A5",
        trait: "A",
        facet: "Simpati",
        title: "Hari yang Tidak Menyenangkan",
        situation: "Seorang teman terlihat lebih diam daripada biasanya setelah mengalami kejadian yang mengecewakan. Ia belum menceritakan apa yang terjadi dan tetap menjalankan aktivitasnya seperti biasa.",
        options: [
            {
                id: "a",
                text: "Memberinya ruang dan menunggu sampai ia sendiri ingin membicarakannya.",
                v: 1
            },
            {
                id: "b",
                text: "Menyapa seperti biasa dan melihat apakah ia ingin memulai percakapan.",
                v: 2
            },
            {
                id: "c",
                text: "Menanyakan keadaannya dengan santai dan mendengarkan jika ia ingin bercerita.",
                v: 3
            },
            {
                id: "d",
                text: "Mencoba memahami perasaannya dan menawarkan dukungan sesuai yang ia butuhkan.",
                v: 4
            }
        ]
    },


    // ==========================================
    // N — NEUROTICISM
    // ==========================================

    {
        id: "N1",
        trait: "N",
        facet: "Kecemasan",
        title: "Pesan yang Belum Dibalas",
        situation: "Kamu mengirim pesan penting kepada seseorang, tetapi pesan itu belum dibalas selama beberapa jam. Kamu tidak tahu apakah orang tersebut sedang sibuk atau belum sempat membacanya.",
        options: [
            {
                id: "a",
                text: "Tetap memikirkan beberapa kemungkinan dan merasa sulit mengalihkan perhatian dari pesan itu.",
                v: 4
            },
            {
                id: "b",
                text: "Sesekali memeriksa pesan sambil bertanya-tanya mengapa belum ada balasan.",
                v: 3
            },
            {
                id: "c",
                text: "Menganggap orang itu mungkin sedang sibuk, meskipun masih sedikit penasaran.",
                v: 2
            },
            {
                id: "d",
                text: "Tetap menjalankan kegiatanku dan menunggu balasan tanpa terlalu memikirkannya.",
                v: 1
            }
        ]
    },

    {
        id: "N2",
        trait: "N",
        facet: "Kemarahan dan mudah tersinggung",
        title: "Komentar yang Menyebalkan",
        situation: "Saat sedang berdiskusi, seseorang memberikan komentar yang menurutmu kurang menyenangkan. Kamu tidak yakin apakah ia bermaksud menyindir atau hanya menyampaikan pendapatnya dengan cara yang kurang tepat.",
        options: [
            {
                id: "a",
                text: "Merasa kesal cukup lama dan terus memikirkan maksud di balik komentarnya.",
                v: 4
            },
            {
                id: "b",
                text: "Merasa terganggu dan membutuhkan waktu sebelum kembali nyaman berbicara dengannya.",
                v: 3
            },
            {
                id: "c",
                text: "Sedikit kesal, tetapi biasanya bisa melanjutkan percakapan setelah beberapa saat.",
                v: 2
            },
            {
                id: "d",
                text: "Cenderung melewatkan komentar itu dan melanjutkan diskusi tanpa banyak memikirkannya.",
                v: 1
            }
        ]
    },

    {
        id: "N3",
        trait: "N",
        facet: "Kemurungan",
        title: "Rencana yang Gagal",
        situation: "Kamu sudah menantikan suatu kegiatan selama beberapa hari, tetapi kegiatan itu mendadak dibatalkan. Tidak ada cara untuk mengubah keputusan tersebut, dan kamu sekarang memiliki waktu luang yang tidak direncanakan.",
        options: [
            {
                id: "a",
                text: "Merasa kecewa cukup lama sehingga sulit menikmati kegiatan lain pada hari itu.",
                v: 4
            },
            {
                id: "b",
                text: "Merasa suasana hati menurun dan membutuhkan waktu untuk kembali bersemangat.",
                v: 3
            },
            {
                id: "c",
                text: "Merasa kecewa sebentar, lalu mulai mempertimbangkan kegiatan pengganti.",
                v: 2
            },
            {
                id: "d",
                text: "Menerima perubahan tersebut dan relatif cepat menemukan hal lain untuk dilakukan.",
                v: 1
            }
        ]
    },

    {
        id: "N4",
        trait: "N",
        facet: "Rasa malu dan canggung sosial",
        title: "Salah Mengucapkan Sesuatu",
        situation: "Kamu sedang berbicara dalam kelompok kecil dan tanpa sengaja salah mengucapkan sesuatu. Beberapa orang menyadarinya, tetapi tidak ada yang memberikan komentar atau menertawakannya.",
        options: [
            {
                id: "a",
                text: "Terus memikirkan kejadian itu dan merasa sulit kembali santai di depan mereka.",
                v: 4
            },
            {
                id: "b",
                text: "Merasa malu dan menjadi lebih berhati-hati saat berbicara untuk sementara waktu.",
                v: 3
            },
            {
                id: "c",
                text: "Merasa sedikit canggung, tetapi perlahan kembali mengikuti percakapan.",
                v: 2
            },
            {
                id: "d",
                text: "Menganggapnya sebagai kesalahan kecil dan melanjutkan percakapan seperti biasa.",
                v: 1
            }
        ]
    },

    {
        id: "N5",
        trait: "N",
        facet: "Kerentanan terhadap tekanan",
        title: "Tiga Hal Sekaligus",
        situation: "Dalam satu hari, kamu harus menyelesaikan tugas, menghadiri sebuah pertemuan, dan mengurus keperluan pribadi. Semuanya cukup penting dan waktunya berdekatan, sehingga kamu perlu mengatur prioritas.",
        options: [
            {
                id: "a",
                text: "Merasa kewalahan sehingga sulit menentukan hal pertama yang harus dikerjakan.",
                v: 4
            },
            {
                id: "b",
                text: "Merasa cukup tertekan dan membutuhkan waktu untuk menenangkan pikiran sebelum mulai.",
                v: 3
            },
            {
                id: "c",
                text: "Merasakan tekanan, tetapi mulai mengatur urutan tugas agar situasinya lebih terkendali.",
                v: 2
            },
            {
                id: "d",
                text: "Tetap cukup tenang dan membagi waktu sesuai prioritas yang sudah ditentukan.",
                v: 1
            }
        ]
    }
];