// content.js
// Semua teks yang tampil di Personality Mirror (selain skenario).
// Ubah kalimat di sini tanpa menyentuh mesinnya.

export const TRAIT_ORDER = ["O", "C", "E", "A", "N"];

// low = kutub kiri (v rendah), high = kutub kanan (v tinggi).
// Kedua kutub sengaja ditulis netral: bukan "buruk" dan "bagus".
export const TRAITS = {
    O: {
        name: "Openness",
        gloss: "Keterbukaan",
        low: "Familiar & praktis",
        high: "Penasaran & eksploratif",
        about: "Seberapa terbuka seseorang pada pengalaman baru, gagasan, imajinasi, dan eksplorasi intelektual.",
        text: {
            low: "Jawabanmu condong ke hal yang sudah dikenal dan praktis. Kecenderungan ini sering berarti nyaman dengan cara yang sudah terbukti dan fokus pada hal yang konkret. Mungkin ada hal baru yang lebih jarang kamu coba, dan itu bukan kekurangan: rutinitas yang stabil juga punya kekuatannya.",
            mid: "Jawabanmu berada di tengah: kadang tertarik mencoba hal baru dan gagasan yang tidak biasa, kadang lebih memilih yang sudah akrab. Itu biasanya bergantung pada situasi dan suasana hatimu.",
            high: "Jawabanmu condong ke rasa ingin tahu dan eksplorasi. Kecenderungan ini sering berarti menikmati ide, seni, dan pengalaman baru. Di sisi lain, hal yang terlalu rutin atau terlalu praktis mungkin terasa kurang menarik."
        }
    },
    C: {
        name: "Conscientiousness",
        gloss: "Keteraturan",
        low: "Spontan & luwes",
        high: "Terencana & teratur",
        about: "Kecenderungan dalam keteraturan, tanggung jawab, perencanaan, dan pengendalian diri untuk mencapai tujuan.",
        text: {
            low: "Jawabanmu condong ke sikap spontan dan luwes. Kecenderungan ini sering berarti nyaman dengan rencana yang longgar dan mudah menyesuaikan diri saat keadaan berubah. Tenggat dan detail mungkin butuh perhatian ekstra, tapi fleksibilitas juga sangat berguna.",
            mid: "Jawabanmu berada di tengah: ada saatnya kamu menyusun rencana dengan rapi, ada saatnya kamu mengalir saja. Banyak orang berada di sini dan menyesuaikan diri dengan tuntutan situasi.",
            high: "Jawabanmu condong ke perencanaan dan keteraturan. Kecenderungan ini sering berarti konsisten mengejar target dan menyelesaikan apa yang dimulai. Di sisi lain, perubahan rencana mendadak atau hasil yang tidak sempurna mungkin terasa mengganggu."
        }
    },
    E: {
        name: "Extraversion",
        gloss: "Ekstraversi",
        low: "Tenang & reflektif",
        high: "Berenergi sosial",
        about: "Kecenderungan dalam interaksi sosial, tingkat aktivitas, dan pencarian stimulasi dari lingkungan sosial.",
        text: {
            low: "Jawabanmu condong ke suasana yang tenang dan reflektif. Kecenderungan ini sering berarti memulihkan energi saat sendiri atau di lingkaran kecil. Lingkungan yang sangat ramai mungkin cepat melelahkan, tapi itu tidak berarti kamu tidak menyukai orang lain.",
            mid: "Jawabanmu berada di tengah: kadang menikmati keramaian dan bertemu orang baru, kadang membutuhkan waktu tenang. Banyak orang menyesuaikan diri dengan situasi dan energi hari itu.",
            high: "Jawabanmu condong ke energi sosial. Kecenderungan ini sering berarti mudah memulai percakapan dan terisi energinya saat bersama orang lain. Di sisi lain, waktu sendiri yang terlalu lama mungkin terasa sepi."
        }
    },
    A: {
        name: "Agreeableness",
        gloss: "Keramahan & kerja sama",
        low: "Lugas & kritis",
        high: "Kooperatif & peduli",
        about: "Kecenderungan dalam kerja sama, kepedulian terhadap orang lain, kepercayaan, dan cara menghadapi perbedaan.",
        text: {
            low: "Jawabanmu condong ke sikap lugas dan kritis. Kecenderungan ini sering berarti teguh pada pendirian dan tidak segan menguji sebuah ide atau berunding dengan tegas. Bagi sebagian orang gaya ini terasa keras, tapi ia juga berguna saat dibutuhkan ketegasan.",
            mid: "Jawabanmu berada di tengah: kamu bisa bekerja sama dan peduli, namun juga mampu bersikap tegas ketika perlu. Seimbang antara menjaga hubungan dan mempertahankan pendapat.",
            high: "Jawabanmu condong ke kerja sama dan kepedulian. Kecenderungan ini sering berarti mudah percaya dan menjaga keharmonisan. Di sisi lain, menyampaikan ketidaksetujuan secara terbuka mungkin terasa lebih sulit."
        }
    },
    N: {
        name: "Neuroticism",
        gloss: "Reaktivitas Emosi",
        low: "Tenang di bawah tekanan",
        high: "Peka terhadap tekanan",
        about: "Kecenderungan merasakan emosi tidak menyenangkan seperti khawatir, tegang, atau gelisah ketika menghadapi tekanan atau ketidakpastian. Ini bukan ukuran kesehatan mental.",
        text: {
            low: "Jawabanmu condong ke sikap tenang saat menghadapi tekanan, kritik, atau ketidakpastian. Kecenderungan ini sering berarti emosi tidak mudah terguncang. Di sisi lain, kadang sinyal bahaya atau kebutuhan orang lain lebih mudah terlewat.",
            mid: "Jawabanmu berada di tengah: ada situasi yang membuatmu tegang atau cemas, ada pula yang bisa kamu hadapi dengan tenang. Reaksi emosi biasanya naik turun mengikuti keadaan.",
            high: "Jawabanmu condong ke kepekaan terhadap tekanan dan ketidakpastian. Kecenderungan ini sering berarti lebih cepat merasakan khawatir atau tegang. Kepekaan yang sama juga bisa membuat seseorang waspada, teliti, dan peka pada keadaan sekitar."
        }
    }
};

export const CONTENT = {

    title: "Personality Mirror",
    tagline: "A little window into how you see the world.",

    introLabel: "FUN STUFF · EKSPLORASI DIRI",

    intro: [
        "Big Five, sering disingkat OCEAN, adalah model kepribadian yang banyak dipakai dalam penelitian psikologi. Ia tidak memasukkanmu ke dalam satu label, tetapi memandang kepribadian sebagai lima dimensi, dan setiap orang berada di suatu titik di antara dua kutub pada tiap dimensinya.",
        "Di sini kamu akan menemui situasi sehari-hari. Pilih respons yang paling mendekati kecenderunganmu. Tidak ada jawaban yang benar atau salah, dan tidak ada pilihan yang dianggap lebih baik."
    ],

    disclaimerTitle: "Penting dibaca dulu",
    disclaimer: [
        "Ini eksplorasi, bukan diagnosis dan bukan tes psikologi tervalidasi. Hasilnya hanyalah gambaran awal dari jawabanmu kali ini.",
        "Jawabanmu diproses di browsermu dan tidak dikirim atau disimpan di mana pun. Di akhir kamu akan mendapat kode hasil yang bisa kamu simpan sendiri."
    ],

    startLabel: "Mulai",
    codeLabel: "Punya kode hasil?",
    learnLabel: "Pelajari Big Five",

    playHint: "Pilih yang paling mendekati kecenderunganmu. Tidak ada jawaban yang benar atau salah.",

    resultTitle: "Cerminan jawabanmu",
    resultIntro: "Ini gambaran dari jawabanmu kali ini, bukan label yang melekat padamu. Lima dimensi ini berdiri sendiri-sendiri, dan tidak ada yang lebih baik daripada yang lain.",
    resultFromCode: "Hasil ini dipulihkan dari kode.",
    varyNote: "Jawabanmu di dimensi ini cukup bervariasi antar situasi. Itu wajar: perilaku sering bergantung pada konteks.",

    tableCaption: "Posisi 0 sampai 100 menunjukkan letak jawabanmu di antara dua kutub. Ini bukan persentil dan tidak dibandingkan dengan orang lain.",

    codeTitle: "Kode hasilmu",
    codeHelp: "Simpan kode ini kalau kamu ingin melihat tabel hasilmu lagi nanti, bahkan dari perangkat lain.",
    codeWarning: "Kode ini memuat jawabanmu. Siapa pun yang memegangnya bisa melihat hasilmu, jadi bagikan dengan hati-hati.",

    closingNote: "Perilaku bisa berbeda di tiap situasi dan fase hidup. Kalau ada hal yang membuatmu merasa kewalahan, berbicara dengan orang tepercaya atau tenaga profesional adalah langkah yang baik.",

    retryLabel: "Ulangi eksplorasi",
    eduLabel: "Baca penjelasan Big Five",

    codeEntryTitle: "Masukkan kode hasil",
    codeEntryHelp: "Tempel kode yang kamu dapat sebelumnya. Huruf besar atau kecil dan tanda hubung tidak berpengaruh.",
    codeEntryPlaceholder: "XXXX-XXXX-XXXX-XX",
    codeEntryButton: "Tampilkan hasil",

    codeErrors: {
        empty: "Kodenya masih kosong.",
        chars: "Ada karakter yang tidak dikenali. Periksa kembali, ya.",
        length: "Panjang kodenya tidak sesuai. Mungkin ada yang terpotong atau berlebih.",
        checksum: "Kode ini tidak lolos pemeriksaan, kemungkinan ada salah ketik.",
        version: "Kode ini berasal dari versi skenario yang berbeda, jadi tidak bisa dibaca di versi sekarang."
    },

    placeholderBanner: "Mode uji: skenario di halaman ini masih data contoh, belum skenario asli.",

    education: [
        {
            q: "Apa itu Big Five?",
            a: [
                "Big Five adalah model kepribadian yang berkembang dari penelitian panjang tentang bagaimana manusia menggambarkan dirinya dan orang lain. Hasilnya, ada lima dimensi luas yang berulang muncul di banyak penelitian.",
                "Model ini banyak dipakai dalam riset psikologi, meski bukan tanpa kritik: lima dimensi ini tidak menjelaskan semua sisi seseorang."
            ]
        },
        {
            q: "Apa arti OCEAN?",
            a: [
                "O, Openness (Keterbukaan): keterbukaan pada pengalaman baru, gagasan, dan imajinasi.",
                "C, Conscientiousness (Keteraturan): perencanaan, tanggung jawab, dan pengendalian diri.",
                "E, Extraversion (Ekstraversi): interaksi sosial, aktivitas, dan stimulasi sosial.",
                "A, Agreeableness (Keramahan): kerja sama, kepedulian, dan cara menghadapi perbedaan.",
                "N, Neuroticism (Reaktivitas Emosi): kecenderungan merasakan emosi tidak menyenangkan saat menghadapi tekanan. Ini bukan ukuran kelemahan, apalagi kesehatan mental."
            ]
        },
        {
            q: "Apa bedanya dengan MBTI?",
            a: [
                "MBTI mengelompokkan orang ke dalam 16 tipe berdasarkan empat pasangan pilihan, misalnya introvert atau ekstrovert. Big Five memandang tiap dimensi sebagai spektrum kontinu, jadi kamu berada di suatu titik, bukan di satu kotak.",
                "Dalam penelitian psikologi, Big Five umumnya dianggap punya dukungan ilmiah yang lebih kuat. MBTI sering dikritik karena tipenya dikotomis dan hasilnya kadang berubah saat tes diulang, tetapi tetap populer sebagai bahan refleksi diri."
            ]
        },
        {
            q: "Kenapa satu label tidak cukup?",
            a: [
                "Kepribadian itu berlapis. Perilakumu berubah mengikuti situasi, orang di sekitarmu, dan fase hidupmu. Satu label seperti \"si introver\" menyederhanakan semua itu.",
                "Pada kebanyakan orang, posisi di tiap dimensi justru berada di sekitar tengah, bukan di kutub ekstrem."
            ]
        },
        {
            q: "Kenapa ini bukan penilaian profesional?",
            a: [
                "Tes psikologi yang sesungguhnya diuji secara statistik dengan banyak butir dan data pembanding dari banyak orang. Personality Mirror hanya memakai skenario yang dibuat khusus untuk fitur ini, tanpa uji validitas dan tanpa data pembanding.",
                "Karena itu hasilnya hanya cocok sebagai pengenalan dan bahan refleksi, bukan untuk keputusan penting seperti rekrutmen atau diagnosis."
            ]
        },
        {
            q: "Bagaimana kode hasil bekerja?",
            a: [
                "Kode itu adalah jawabanmu yang dipadatkan menjadi deretan karakter, bukan sandi rahasia. Saat kamu memasukkannya lagi, halaman ini membacanya dan menampilkan hasilnya kembali. Semuanya terjadi di browsermu.",
                "Karena isinya jawabanmu sendiri, siapa pun yang memegang kodenya bisa melihat hasilmu. Dan kalau skenario di sini diubah suatu hari, kode lama tidak bisa dibaca lagi."
            ]
        },
        {
            q: "Sumber dan catatan",
            a: [
                "Lima dimensi dan facet-nya merujuk pada penelitian Big Five (misalnya karya Costa dan McCrae serta Goldberg) dan pada IPIP, bank butir kepribadian yang berstatus domain publik.",
                "Skenario di sini dibuat khusus untuk fitur ini dan bukan butir IPIP."
            ]
        }
    ]
};
