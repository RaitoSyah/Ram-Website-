#!/usr/bin/env bash
# apply-theme-snippet.sh
# Menyisipkan potongan kecil ke <head> semua halaman .html supaya tema pilihan
# pengunjung langsung terpasang sebelum halaman tampil (tanpa kedipan terang->gelap).
#
# Cara pakai (di Termux, dari folder website):
#   bash apply-theme-snippet.sh
# Aman dijalankan berulang kali: halaman yang sudah punya potongan itu dilewati.

set -u
cd "$(dirname "$0")" || exit 1

SNIPPET='<script>/*theme-init*/(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"||t==="warm"||t==="mono")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();</script>'

done_count=0
skip_count=0

while IFS= read -r -d '' f; do

    if grep -q 'theme-init' "$f"; then
        echo "Dilewati (sudah ada): $f"
        skip_count=$((skip_count + 1))
        continue
    fi

    content="$(cat "$f")"

    # Cari tag <head> pertama (huruf besar/kecil bebas; <header> tidak ikut)
    if [[ "$content" =~ (<[hH][eE][aA][dD]([[:space:]][^>]*)?>) ]]; then
        head_tag="${BASH_REMATCH[1]}"
        printf '%s\n' "${content/"$head_tag"/"$head_tag"$'\n'"    $SNIPPET"}" > "$f"
        echo "Ditambahkan: $f"
        done_count=$((done_count + 1))
    else
        echo "Dilewati (tidak ada <head>): $f"
        skip_count=$((skip_count + 1))
    fi

done < <(find . -name "*.html" -not -path "./.git/*" -not -path "./node_modules/*" -print0)

echo
echo "Selesai. $done_count halaman diubah, $skip_count dilewati."
echo "Lanjut: git add . && git commit -m \"Tema: potongan head\" && git push"
