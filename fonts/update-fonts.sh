#!/usr/bin/env bash
# update-fonts.sh
# Membuat ulang fonts/fonts.js dari isi folder fonts/.
#
# Cara pakai (di Termux, dari folder website):
#   bash update-fonts.sh
# Lalu: git add . && git commit -m "Update font" && git push
#
# Aturan nama berkas (huruf besar/kecil tidak berpengaruh):
#   Inter-Regular.ttf, Inter-Bold.ttf, Inter-Italic.ttf, Inter-BoldItalic.ttf
#   -> satu font "Inter" dengan 4 varian
#   PlayfairDisplay.otf (tanpa akhiran) -> font "Playfair Display", varian regular
# Format yang dikenali: .woff2 .woff .ttf .otf
# Kalau satu font punya beberapa format, dipilih yang paling ringan (woff2 > woff > ttf > otf).

set -u
cd "$(dirname "$0")" || exit 1

FONT_DIR="fonts"
OUT="$FONT_DIR/fonts.js"

if [ ! -d "$FONT_DIR" ]; then
    echo "Folder '$FONT_DIR' tidak ditemukan."
    echo "Jalankan skrip ini dari folder website (Ram Website)."
    exit 1
fi

declare -A REG BOLD ITAL BI NAMES

rank() {
    case "$1" in
        woff2) echo 4 ;;
        woff)  echo 3 ;;
        ttf)   echo 2 ;;
        otf)   echo 1 ;;
        *)     echo 0 ;;
    esac
}

# set_best NAMA_ARRAY KUNCI BERKAS EKSTENSI
set_best() {
    local -n arr="$1"
    local key="$2" file="$3" ext="$4"
    local cur="${arr[$key]-}"
    if [ -z "$cur" ]; then
        arr[$key]="$file"
    else
        local ce="${cur##*.}"
        ce="${ce,,}"
        if [ "$(rank "$ext")" -gt "$(rank "$ce")" ]; then
            arr[$key]="$file"
        fi
    fi
}

# Memecah nama berkas menjadi family + varian
variant=""
family=""
split_stem() {
    local s="$1" l="${1,,}" pair suf var cand low
    for pair in "bolditalic:boldItalic" "bold-italic:boldItalic" "bold_italic:boldItalic" \
                "bold italic:boldItalic" "boldoblique:boldItalic" "italic:italic" \
                "oblique:italic" "bold:bold" "regular:regular" "normal:regular" "roman:regular"; do
        suf="${pair%%:*}"
        var="${pair##*:}"
        if [[ "$l" == *"$suf" && ${#l} -gt ${#suf} ]]; then
            cand="${s:0:${#s}-${#suf}}"
            cand="$(printf '%s' "$cand" | sed 's/[-_ ]*$//')"
            low="${cand,,}"
            # "SemiBold", "ExtraBold", dst. bukan varian bold dari font biasa
            case "$low" in
                *semi|*extra|*ultra|*demi) continue ;;
            esac
            [ -z "$cand" ] && continue
            variant="$var"
            family="$cand"
            return
        fi
    done
    variant="regular"
    family="$s"
}

count=0

while IFS= read -r -d '' path; do

    rel="${path#"$FONT_DIR"/}"
    base="$(basename "$rel")"
    ext="${base##*.}"
    ext="${ext,,}"
    stem="${base%.*}"

    case "$ext" in
        woff2|woff|ttf|otf) ;;
        *) continue ;;
    esac

    case "$rel" in
        *\"*|*\\*)
            echo "Dilewati (nama berkas mengandung tanda kutip atau garis miring terbalik): $rel"
            continue
            ;;
    esac

    split_stem "$stem"

    name="$(printf '%s' "$family" \
        | sed -e 's/[-_]\+/ /g' \
              -e 's/\([a-z0-9]\)\([A-Z]\)/\1 \2/g' \
              -e 's/[^A-Za-z0-9 ]//g' \
              -e 's/  */ /g' -e 's/^ //' -e 's/ $//')"
    [ -z "$name" ] && name="Font"

    NAMES["$name"]=1
    case "$variant" in
        regular)    set_best REG  "$name" "$rel" "$ext" ;;
        bold)       set_best BOLD "$name" "$rel" "$ext" ;;
        italic)     set_best ITAL "$name" "$rel" "$ext" ;;
        boldItalic) set_best BI   "$name" "$rel" "$ext" ;;
    esac
    count=$((count + 1))

done < <(find "$FONT_DIR" -type f -print0)

{
    cat <<'HEADER'
// fonts/fonts.js
// FILE INI DIBUAT OTOMATIS oleh update-fonts.sh. Jangan diedit manual,
// karena akan tertimpa saat skripnya dijalankan lagi.
//
// Untuk menambah font: taruh berkasnya di folder fonts/ lalu jalankan
//   bash update-fonts.sh

export const FONTS = [

HEADER

    while IFS= read -r n; do
        [ -z "$n" ] && continue
        line="    { name: \"$n\""
        [ -n "${REG[$n]-}" ]  && line+=", regular: \"${REG[$n]}\""
        [ -n "${BOLD[$n]-}" ] && line+=", bold: \"${BOLD[$n]}\""
        [ -n "${ITAL[$n]-}" ] && line+=", italic: \"${ITAL[$n]}\""
        [ -n "${BI[$n]-}" ]   && line+=", boldItalic: \"${BI[$n]}\""
        line+=" },"
        echo "$line"
    done < <(printf '%s\n' "${!NAMES[@]}" | sort)

    echo
    echo "];"
} > "$OUT"

echo "Selesai. $count berkas font diproses."
echo "Daftar font di $OUT:"
printf '%s\n' "${!NAMES[@]}" | sort | sed 's/^/  - /'
if [ "$count" -eq 0 ]; then
    echo "Belum ada berkas font (.woff2 .woff .ttf .otf) di folder $FONT_DIR."
fi
echo "Lanjut: git add . && git commit -m \"Update font\" && git push"
