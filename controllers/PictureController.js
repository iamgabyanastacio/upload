// Importa o models Picture para interagir com o DB
const Picture = require("../models/Picture")

// Função para criar uma nova imagem no banco de dados
exports.create = async (req, res) => {
  try {
    // Obtém o nome da img do corpo da requisição
        const { name } = req.body
    
    // Obtém o arquivo da req. (Usado pelo Multer para fazer o Upload)
        const file = req.file
    
    // Cria uma nova instância com nome e caminho do arquivo
        const picture = new Picture({
            name,
            image: file.buffer,
            contentType: file.mimetype,
        });

        // Salva a imagem no DB
        await picture.save();

        // Retorna a resposta com a img. e uma msg. de sucesso
        res.json({ picture, msg: "Imagem salva com sucesso!"});
    }   catch (error) {
        // Em caso de erro, retorna uma msg. com erro 500
        res.status(500).json({ message: "Erro ao salvar iamgem!" });
    }
};

// Função para obter somente uma imagem especifica
exports.getImage = async (req, res) => {
    try{
        // Buscando a img. pelo ID fornecido pelo DB
        const picture = await Picture.findById(req.params.id);

        // Se a img. não foi encontrada, retorna um erro 404
        if (!picture) {
            return res.status(404).json({ message: "Imagem não encontrada" });
        }

        // Define o tipo da resposta para o tipo de imagem
        res.set('Content-Type', picture.contentType)
        
        // Mostra a imagem na resposta
        res.send(picture.image)
    } catch (error) {
        
        // Caso ocorra erro, retorna para o usuario
        res.status(500).json({ message: "Erro ao buscar imagem!" });

    }
};

// Função para encontrar todas as imagens no banco de dados
exports.findALL = async (req, res) => {
    try {
      // Busca toda as imagens no banco de dados
        const pictures = await Picture.find()
        
      // Retorna todas as imagens do DB
        res.json(pictures)
    } catch (err) {
      // Em caso de erro, retorna uma resposta de erro com código 500
        res.status(500).json({ message: "Erro ao buscar imagens!"});
    }
};

// Função para remover uma imagem do DB e local
exports.remove = async (req, res) => {
    try {
        // Busca a imagem no DB, com a ID enviada
        const picture = await Picture.findById(req.params.id);
        
        // Se a img. não for encontrada no DB
        if (!picture) {
            return res.status(404).json({ message: "Imagem não encontrada!" });
        }
        
        // Remove o documento do banco de dados
        await Picture.deleteOne({_id: req.params.id});
        
        // Retorna uma resposta ao Usuario
        res.json({ message: "Imagem removida!" });
    }   catch (error) {

        // Retorna erro se houver algum problema
        console.error(error); 
        res.status(500).json({ message: "Erro ao excluir imagem!" });
    }
};

// Função para atualizar uma imagem no banco de dados
exports.update = async (req, res) => {
    try {
        // Obtém o ID da imagem a ser atualizada a partir dos parâmetros da URL
        const { id } = req.params;
 
        // Obtém os novos dados da requisição
        const { name } = req.body;
        const file = req.file;
 
        // Busca a imagem no banco de dados pelo ID
        const picture = await Picture.findById(id);
 
        // Se a imagem não for encontrada, retorna um erro 404
        if (!picture) {
            return res.status(404).json({ message: "Imagem não encontrada!" });
        }
 
        // Se um novo arquivo for enviado, remove o antigo arquivo do sistema de arquivos
        if (file) {
            fs.unlinkSync(picture.src);  // Remove o arquivo antigo
 
            // Atualiza o caminho do novo arquivo no banco de dados
            picture.src = file.path;
        }
 
        // Atualiza o nome da imagem no banco de dados
        picture.name = name || picture.name;  // Mantém o nome anterior se não for enviado um novo
 
        // Salva as mudanças no banco de dados
        await picture.save();
 
        // Retorna uma resposta com os dados da imagem atualizada e uma mensagem de sucesso
        res.json({ picture, msg: "Imagem atualizada com sucesso!" });
    } catch (error) {
        // Caso ocorra algum erro, retorna uma resposta de erro com código 500
        res.status(500).json({ message: "Erro ao atualizar imagem!" });
    }
};