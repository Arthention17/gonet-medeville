#!/bin/bash
mkdir -p public/bottles
cd public/bottles

echo "Downloading bottle images from Vivino..."

curl -sL -A "Mozilla/5.0" -o champagne_raw.jpg "https://images.vivino.com/thumbs/ApnFiWsNp1VJpYQaGtgMUQ_375x500.jpg"
curl -sL -A "Mozilla/5.0" -o gilette_raw.jpg "https://images.vivino.com/thumbs/JVp7E3gVTJinh_ck8BRRMw_375x500.jpg"
curl -sL -A "Mozilla/5.0" -o eyrins_raw.jpg "https://images.vivino.com/thumbs/RtyVl-8nT6izj_LmUz5YEA_375x500.jpg"
curl -sL -A "Mozilla/5.0" -o respide_raw.jpg "https://images.vivino.com/thumbs/AwjOCsCT90KsHqAXyJkJ0g_375x500.jpg"

echo "Done. Remove backgrounds with remove.bg or rembg, save as .png"
