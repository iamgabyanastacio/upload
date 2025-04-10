// Importando multer, upload de arquivos
const multer = require("multer");

// Configuração do Multer para salvar em memória
const storage = multer.memoryStorage();

// Middleware do Multer para 
const upload = multer({
    storage,
    limits: {
        filesize: 5 * 1024 * 1024, // Limite de 5MB
    },
});

// Exporta para utilizar em outro arquivo
module.exports = upload;