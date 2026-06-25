#!/bin/bash

# Caminho de origem das imagens geradas pela IA
SRC_DIR="/Users/BS_Dados/.gemini/antigravity-ide/brain/a3ee7f8e-d8c6-4ec8-8152-54ed9ab348db"
DEST_DIR="$(pwd)/assets"

echo "Copiando as logos oficiais para a pasta assets..."

cp "$SRC_DIR/media__1782107786112.png" "$DEST_DIR/logo_white.png"
cp "$SRC_DIR/media__1782107817578.png" "$DEST_DIR/logo_blue.png"

echo "Cópia concluída! Arquivos na pasta assets/:"
ls -la "$DEST_DIR"
