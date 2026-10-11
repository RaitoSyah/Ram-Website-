// engine.js
// Logika murni Personality Mirror (tanpa DOM): validasi data, urutan skenario,
// perhitungan skor, dan kode hasil. Dipakai oleh mirror.js dan check.html.

export const TRAIT_IDS = ["O", "C", "E", "A", "N"];

const OPTIONS_PER_SCENARIO = 4;


// ---------- Validasi data skenario ----------

const TRAIT_WORDS = ["introver", "ekstrover", "extrover", "perfeksionis", "neurotik", "neurotic", "openness", "conscientious", "extravert", "agreeable"];
const LOADED_WORDS = ["egois", "malas", "hebat", "bijak", "sempurna", "dewasa banget", "bodoh", "pecundang"];

export function validateScenarios(scenarios) {

    const errors = [];
    const warnings = [];

    if (!Array.isArray(scenarios) || scenarios.length === 0) {
        return { errors: ["SCENARIOS harus berupa array yang tidak kosong."], warnings, perTrait: {} };
    }

    const ids = new Set();
    const perTrait = {};
    TRAIT_IDS.forEach(t => { perTrait[t] = { count: 0, facets: [] }; });

    let ascendingCount = 0;
    const topIndexCount = new Array(OPTIONS_PER_SCENARIO).fill(0);

    scenarios.forEach((s, i) => {

        const label = `Skenario #${i + 1}${s && s.id ? ` (${s.id})` : ""}`;

        if (!s || typeof s !== "object") {
            errors.push(`${label}: bukan objek.`);
            return;
        }

        if (typeof s.id !== "string" || !s.id.trim()) errors.push(`${label}: id kosong.`);
        else if (ids.has(s.id)) errors.push(`${label}: id "${s.id}" dobel.`);
        else ids.add(s.id);

        if (!TRAIT_IDS.includes(s.trait)) {
            errors.push(`${label}: trait harus salah satu dari ${TRAIT_IDS.join(", ")}.`);
        } else {
            perTrait[s.trait].count++;
            if (s.facet) perTrait[s.trait].facets.push(s.facet);
        }

        if (typeof s.title !== "string" || !s.title.trim()) errors.push(`${label}: title kosong.`);
        if (typeof s.situation !== "string" || !s.situation.trim()) errors.push(`${label}: situation kosong.`);

        if (typeof s.situation === "string") {
            const n = s.situation.trim().length;
            if (n > 0 && n < 40) warnings.push(`${label}: situasi sangat pendek (${n} karakter).`);
            if (n > 450) warnings.push(`${label}: situasi panjang (${n} karakter), mungkin terlalu berat dibaca di HP.`);
        }

        if (!Array.isArray(s.options) || s.options.length !== OPTIONS_PER_SCENARIO) {
            errors.push(`${label}: harus punya tepat ${OPTIONS_PER_SCENARIO} pilihan.`);
            return;
        }

        const vs = [];
        const lengths = [];
        const optIds = new Set();

        s.options.forEach((o, j) => {
            if (!o || typeof o.text !== "string" || !o.text.trim()) {
                errors.push(`${label}, pilihan ${j + 1}: teks kosong.`);
            } else {
                lengths.push(o.text.trim().length);
            }
            if (typeof o.id !== "string" || !o.id.trim()) errors.push(`${label}, pilihan ${j + 1}: id kosong.`);
            else if (optIds.has(o.id)) errors.push(`${label}, pilihan ${j + 1}: id "${o.id}" dobel.`);
            else optIds.add(o.id);

            if (![1, 2, 3, 4].includes(o.v)) errors.push(`${label}, pilihan ${j + 1}: v harus 1, 2, 3, atau 4.`);
            vs.push(o.v);
        });

        const sortedV = [...vs].sort();
        if (sortedV.join() !== "1,2,3,4") {
            errors.push(`${label}: nilai v harus tepat 1, 2, 3, 4 masing-masing sekali (sekarang: ${vs.join(", ")}).`);
        } else {
            if (vs.join() === "1,2,3,4" || vs.join() === "4,3,2,1") ascendingCount++;
            topIndexCount[vs.indexOf(4)]++;
        }

        if (lengths.length === OPTIONS_PER_SCENARIO) {
            const ratio = Math.max(...lengths) / Math.max(1, Math.min(...lengths));
            if (ratio > 2.5) warnings.push(`${label}: panjang pilihan timpang (terpanjang ${ratio.toFixed(1)}x terpendek). Pilihan yang paling panjang cenderung terasa "paling benar".`);
        }

        const allText = (s.situation + " " + s.options.map(o => o.text || "").join(" ")).toLowerCase();
        TRAIT_WORDS.forEach(w => {
            if (allText.includes(w)) warnings.push(`${label}: memuat kata label kepribadian "${w}".`);
        });
        LOADED_WORDS.forEach(w => {
            if (allText.includes(w)) warnings.push(`${label}: memuat kata bermuatan nilai "${w}".`);
        });
    });

    TRAIT_IDS.forEach(t => {
        if (perTrait[t].count === 0) errors.push(`Dimensi ${t} belum punya skenario.`);
        else if (perTrait[t].count < 3) warnings.push(`Dimensi ${t} hanya punya ${perTrait[t].count} skenario. Terlalu sedikit untuk gambaran yang berarti.`);

        const f = perTrait[t].facets;
        if (f.length && new Set(f).size < f.length) warnings.push(`Dimensi ${t}: ada facet yang dipakai lebih dari sekali (${f.join(", ")}).`);
    });

    const counts = TRAIT_IDS.map(t => perTrait[t].count).filter(Boolean);
    if (counts.length && Math.max(...counts) !== Math.min(...counts)) {
        warnings.push("Jumlah skenario tiap dimensi tidak sama, jadi dimensi tertentu lebih sedikit diwakili.");
    }

    if (ascendingCount > scenarios.length * 0.4) {
        warnings.push(`${ascendingCount} skenario menyusun pilihan berurutan naik/turun (v 1→4). Acak urutannya di file (tampilan sudah diacak, tapi data sebaiknya tidak berpola).`);
    }

    const maxTop = Math.max(...topIndexCount);
    if (scenarios.length >= 8 && maxTop > scenarios.length * 0.5) {
        warnings.push(`Pilihan kutub tertinggi (v=4) terlalu sering berada di posisi array yang sama (${maxTop} dari ${scenarios.length}).`);
    }

    return { errors, warnings, perTrait };
}


// ---------- Urutan skenario ----------
// Dimensi digilir (O, C, E, A, N, O, C, ...) supaya dimensi yang sama tidak berurutan.

export function playOrder(scenarios) {

    const groups = TRAIT_IDS.map(t => scenarios.map((s, i) => ({ s, i })).filter(x => x.s.trait === t).map(x => x.i));
    const out = [];
    const max = Math.max(...groups.map(g => g.length));

    for (let k = 0; k < max; k++) {
        groups.forEach(g => { if (k < g.length) out.push(g[k]); });
    }

    return out;
}

export function shuffled(array, rng = Math.random) {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


// ---------- Skor ----------
// answers[i] = indeks pilihan (urutan di data) yang dipilih untuk scenarios[i].

export function scoreAnswers(scenarios, answers) {

    const result = {};

    TRAIT_IDS.forEach(t => {
        const values = [];
        scenarios.forEach((s, i) => {
            if (s.trait !== t) return;
            const a = answers[i];
            if (Number.isInteger(a) && s.options[a]) values.push(s.options[a].v);
        });

        const n = values.length;
        const mean = n ? values.reduce((x, y) => x + y, 0) / n : null;
        const sd = n ? Math.sqrt(values.reduce((x, y) => x + (y - mean) ** 2, 0) / n) : null;

        result[t] = {
            n,
            values,
            mean,
            sd,
            position: n ? Math.round(((mean - 1) / 3) * 100) : null // 0 = kutub rendah, 100 = kutub tinggi
        };
    });

    return result;
}


// ---------- Kode hasil ----------
// Kode = jawaban yang dipadatkan (BUKAN hash): versi (6 bit) + 2 bit per jawaban + pemeriksa CRC-12.
// Seluruh bit "diacak" dengan aliran pseudo-acak tetap supaya kodenya tampak acak.
// Ini bukan enkripsi: siapa pun yang punya kode bisa membaca jawabannya. Pemeriksa hanya
// untuk mendeteksi salah ketik.

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford base32 (tanpa I, L, O, U)
const WHITEN_SEED = 0x5EED1234;
const CRC_BITS = 12;
const VERSION_BITS = 6;

function pushBits(out, value, width) {
    for (let i = width - 1; i >= 0; i--) out.push((value >> i) & 1);
}

function readBits(bits, start, width) {
    let v = 0;
    for (let i = 0; i < width; i++) v = (v << 1) | bits[start + i];
    return v;
}

function crc12(bits) {
    let crc = 0;
    for (const bit of bits) {
        const fb = ((crc >> 11) & 1) ^ bit;
        crc = (crc << 1) & 0xFFF;
        if (fb) crc ^= 0x80F;
    }
    return crc;
}

function whitenStream(length) {
    let s = WHITEN_SEED >>> 0;
    const out = [];
    for (let i = 0; i < length; i++) {
        s = (s + 0x6D2B79F5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        out.push(((t ^ (t >>> 14)) >>> 0) >>> 31);
    }
    return out;
}

function totalBits(count) {
    return VERSION_BITS + 2 * count + CRC_BITS;
}

export function codeLength(count) {
    return Math.ceil(totalBits(count) / 5);
}

export function encodeCode(answers, version) {

    if (!Number.isInteger(version) || version < 0 || version > 63) {
        throw new Error("SCENARIOS_VERSION harus bilangan bulat 0 sampai 63.");
    }

    const payload = [];
    pushBits(payload, version, VERSION_BITS);

    for (const a of answers) {
        if (!Number.isInteger(a) || a < 0 || a > 3) throw new Error("Semua pertanyaan harus dijawab.");
        pushBits(payload, a, 2);
    }

    pushBits(payload, crc12(payload), CRC_BITS);

    const stream = whitenStream(payload.length);
    const bits = payload.map((b, i) => b ^ stream[i]);

    while (bits.length % 5 !== 0) bits.push(0);

    let raw = "";
    for (let i = 0; i < bits.length; i += 5) raw += ALPHABET[readBits(bits, i, 5)];

    return raw;
}

export function formatCode(raw) {
    return raw.match(/.{1,4}/g).join("-");
}

export function normalizeCode(input) {
    return String(input || "")
        .toUpperCase()
        .replace(/[\s\-_.]/g, "")
        .replace(/O/g, "0")
        .replace(/[IL]/g, "1");
}

export function decodeCode(input, expectedVersion, count) {

    const raw = normalizeCode(input);

    if (!raw) return { ok: false, reason: "empty" };

    if ([...raw].some(c => !ALPHABET.includes(c))) return { ok: false, reason: "chars" };

    if (raw.length !== codeLength(count)) return { ok: false, reason: "length" };

    const bits = [];
    for (const c of raw) pushBits(bits, ALPHABET.indexOf(c), 5);

    const n = totalBits(count);

    // bit pengisi di ujung harus nol
    for (let i = n; i < bits.length; i++) {
        if (bits[i] !== 0) return { ok: false, reason: "checksum" };
    }

    const stream = whitenStream(n);
    const payloadAndCrc = bits.slice(0, n).map((b, i) => b ^ stream[i]);

    const payload = payloadAndCrc.slice(0, n - CRC_BITS);
    const crc = readBits(payloadAndCrc, n - CRC_BITS, CRC_BITS);

    if (crc12(payload) !== crc) return { ok: false, reason: "checksum" };

    const version = readBits(payload, 0, VERSION_BITS);
    if (version !== expectedVersion) return { ok: false, reason: "version" };

    const answers = [];
    for (let i = 0; i < count; i++) answers.push(readBits(payload, VERSION_BITS + 2 * i, 2));

    return { ok: true, answers };
}
