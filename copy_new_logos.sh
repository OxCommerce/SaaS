#!/bin/bash

# Diretório de origem das logos na conversa
SRC_DIR="/Users/BS_Dados/.gemini/antigravity-ide/brain/491b2a0e-3f63-422c-ac1a-9885920330cd"
DEST_DIR="$(pwd)/assets"

echo "=== Copiando as novas logos para a pasta de assets ==="

# Verifica se a pasta de assets existe, caso contrário cria
if [ ! -d "$DEST_DIR" ]; then
  mkdir -p "$DEST_DIR"
fi

# Copia os arquivos binários correspondentes
cp "$SRC_DIR/media__1782538376117.png" "$DEST_DIR/logo_white.png"
cp "$SRC_DIR/media__1782538376123.png" "$DEST_DIR/logo_blue.png"

echo "✓ Arquivos copiados com sucesso:"
ls -lh "$DEST_DIR/logo_white.png"
ls -lh "$DEST_DIR/logo_blue.png"
echo "====================================================="
