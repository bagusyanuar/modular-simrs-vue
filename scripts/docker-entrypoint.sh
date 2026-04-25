#!/bin/sh
set -e

CONFIG_FILE="/usr/share/nginx/html/config.js"

echo "⚙️ Generating runtime configuration..."

# Mulai nulis objek config
echo "window.config = {" > "$CONFIG_FILE"

# Ambil semua Environment Variable yang depannya VITE_
for i in $(env | grep '^VITE_')
do
  key=$(echo "$i" | cut -d '=' -f 1)
  val=$(echo "$i" | cut -d '=' -f 2-)
  
  # Tulis ke file JS
  echo "  $key: '$val'," >> "$CONFIG_FILE"
done

# Tutup objek config
echo "};" >> "$CONFIG_FILE"

echo "✅ Runtime configuration injected to $CONFIG_FILE"
