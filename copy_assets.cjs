const fs = require('fs');
const path = require('path');

// Origem das imagens geradas pela IA no diretório privado da conversa
const srcDir = '/Users/BS_Dados/.gemini/antigravity-ide/brain/491b2a0e-3f63-422c-ac1a-9885920330cd';
// Destino na pasta assets do projeto
const destDir = path.join(__dirname, 'assets');

const files = [
  { src: 'nelore_elite_1_1782576025196.png', dest: 'nelore_elite_1.png' },
  { src: 'nelore_elite_2_1782576048190.png', dest: 'nelore_elite_2.png' },
  { src: 'nelore_manejo_1_1782576082390.png', dest: 'nelore_manejo_1.png' },
  { src: 'nelore_manejo_2_1782576120589.png', dest: 'nelore_manejo_2.png' },
  { src: 'nelore_rebanho_1_1782576158459.png', dest: 'nelore_rebanho_1.png' },
  { src: 'nelore_rebanho_2_1782576202178.png', dest: 'nelore_rebanho_2.png' }
];

console.log('Iniciando a cópia das imagens Nelore reais...');

// Garantir que a pasta assets existe
if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

let successCount = 0;
files.forEach(f => {
  const srcPath = path.join(srcDir, f.src);
  const destPath = path.join(destDir, f.dest);
  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copiado com sucesso: assets/${f.dest}`);
    successCount++;
  } catch (err) {
    console.error(`✗ Erro ao copiar assets/${f.dest}:`, err.message);
  }
});

console.log(`\nCópia finalizada! ${successCount} de ${files.length} imagens copiadas.`);
if (successCount === files.length) {
    console.log('Todas as imagens locais foram importadas perfeitamente para o projeto!');
} else {
    console.log('Algumas imagens não puderam ser copiadas. Verifique se o caminho de origem está correto.');
}
