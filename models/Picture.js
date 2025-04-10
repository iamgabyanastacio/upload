// Importa para interação com o DB
const mongoose = require("mongoose")

// Permite criar esquemas e modelos para o MongoDB
const Schema = mongoose.Schema;

// Definido um Schema para as Imagens
const PictureSchema = new Schema({
    // Campo do tipo String e obrigatório
    name: { type: String, require: true },
    // Amarzenar a imagem como Buffer
    imagem: { type: Buffer, required: true },
    // Campo amarzenar o tipo da imagem
    contentType: { type: String, required: true},
});

// Criando o modelo 'Picture' a partir do esquema criado antes
// O Modelo 'Picture' é usado para interagir com a "Tabela" Picture no DB
module.exports = mongoose.model("Picture", PictureSchema);