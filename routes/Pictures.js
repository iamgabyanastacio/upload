// Importa o módulo do Express para configurar as Rotas
const express = require("express")

// Cria a instância do roteador do express para definir ROTAS
const router = express.Router();

// Importa a configuração do Multer para ligar com uploads de arquivos
const upload = require("../config/multer")

// Importa o controlador da IMg, onde tem todas as funções e busca
const PictureController = require("../controllers/PictureController");

// Definido a rota POST para criar, e fazer upload da imagem
router.post("/", upload.single("file"), PictureController.create);

// Definindo a rota GET para buscar todas as imagens do DB
router.get("/", PictureController.findALL);

// Definindo a rota GET para obter uma img. especifica
router.get("/:id/image", PictureController.getImage);

// Definindo a Rota DELETE para apagar imagens
router.delete("/:id", PictureController.remove);

router.put("/:id", upload.single("file"), PictureController.update);

// Exportando o arquivo para utilizar no app.js
module.exports = router;