#!/bin/bash

# Caminho de origem das imagens geradas pela IA
SRC_DIR="/Users/BS_Dados/.gemini/antigravity-ide/brain/a3ee7f8e-d8c6-4ec8-8152-54ed9ab348db"
DEST_DIR="$(pwd)/assets"

echo "Iniciando a cópia das imagens reais do rebanho Nelore..."

cp "$SRC_DIR/gado_pasto_1782096565071.png" "$DEST_DIR/gado_pasto.png"
cp "$SRC_DIR/gado_confinamento_1782096587126.png" "$DEST_DIR/gado_confinamento.png"
cp "$SRC_DIR/fazenda_infra_1782096614686.png" "$DEST_DIR/fazenda_infra.png"

echo "Cópia concluída com sucesso! Verifique a pasta assets/"
ls -la "$DEST_DIR"
