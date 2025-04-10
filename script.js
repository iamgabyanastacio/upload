// Elementos da interface (DOM)
const elements = {
    photoGrid: document.getElementById("photoGrid"), // Container de grade de fotos
    uploadModal: document.getElementById("uploadModal"), // Modal de Upload
    addPhotoButton: document.getElementById("addPhotoBtn"), // Botão para abrir o Modal
    closeButton: document.querySelector(".close"), // Botão para fechar o Modal
    uploadForm: document.getElementById("uploadForm"), // Formulário de upload
    toast: document.getElementById("toast"), // Elemento para notificação
    nameInput: document.getElementById("name"), // Input do nome da foto
    fileInput: document.getElementById("file"), // Input do arquivo da foto
  };
  
  // Configuração da aplicação
  const config = {
    apiUrl: "http://localhost:4000/pictures", // Endpoint da API
    /* Colocar img Base 64*/
  };
  
  // Função de notificação temporária
  function showNotification(message, type = "success") {
    const { toast } = elements;
  
    toast.textContent = message; // Define o texto da mensagem
    toast.className = `toast ${type}`; // Aplica a classe do CSS (Muda de cor)
    toast.style.opacity = "1"; // Torna a notificação vísivel
  
    // Configuração de temporizador para esconder a notificação (3. Seg)
    setTimeout(() => {
      toast.style.opacity = "0"; // Faz a notificação desaparecer
    }, 3000);
  }
  
  // Função de manipulação de dados (Busca as fotos da API)
  async function fetchPhotos() {
    try {
      // Faz requisição GET na API
      const response = await fetch(config.apiUrl);
  
      // Se a resposta não foi completa, mostra um erro
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
  
      // Converte a resposta para JSON
      const data = await response.json();
  
      // Retorna o Array de fotos ou vazio se não houver dados
      return data.pictures || [];
    } catch (error) {
      // Em caso de erro, mostra no console log
      console.error("Falha ao carregar foto", error);
      // Mostra a nofiticação de erro para o User
      showNotification("Falha ao carregar fotos", "error");
      // Retorna o array vazio para evitar erros no código
      return [];
    }
  }
  
  // Renderiza as fotos no Grid (Recebendo um array de objetos de foto)
  function renderPhotoGrid(photos) {
    const { photoGrid } = elements;
  
    photoGrid.innerHTML = ""; // Limpa todo o conteúdo atual do Grid
  
    // Se não tiver nada no Array mostra a mensagem
    if (photos.length === 0) {
      photoGrid.innerHTML = '<p class="no-photos">Nenhuma foto encontrada</p>';
      return;
    }
  
    // Para cada foto no array, criar um Card e adiciona ao Grid
    photos.forEach((photo) => {
      const photoCard = createPhotoCardElement(photo);
      photoGrid.appendChild(photoCard);
    });
  }
  
  // Cria o elemento HTML de um card de foto (Recebe objeto de Foto)
  function createPhotoCardElement(photo) {
    const card = document.createElement("div");
    card.className = "photo-card"; // Aplica classe CSS para estilização
  
    // Monta a URL (API + ID da foto + /image)
    const imageUrl = `${config.apiUrl}/${photo._id}/image`;
  
    // Define o HTML interno do card (Imagem e informação)
    card.innerHTML = `
           <img src="${imageUrl}" alt="${photo.name}"
                onerror="this.onerror=null; this.src='${config.placeholderImage}'">
           <div class="photo-info">
               <div class="photo-name">${photo.name}</div>
           </div>
           `;
  
    return card;
  }
  
  // Função de gerenciamento (CRUD), envia a foto para o servidor com o FormData
  async function uploadNewPhoto(formData) {
    try {
      // Faz requisição POST para API com os dados do formulário
      const response = await fetch(config.apiUrl, {
        method: "POST",
        body: formData,
      });
  
      // Verifica se houve resposta, se não retorna erro
      if (!response.ok) {
        throw new Error("Falha no upload da foto");
      }
  
      // Exibibe uma notificação para o User
      showNotification("Foto enviada com sucesso!");
      // Chama a função para fechar o Model
      closeUploadModal();
      // Reseta os campos do formulário
      elements.uploadForm.reset();
      // Recarrega a lista de fotos para mostrar a nova foto
      loadAndDisplayPhotos();
    } catch (error) {
      // Mostra no console o erro
      console.error("Erro no upload:", error);
      // Mostra notificação para o usuario
      showNotification("Falha ao enviar foto", "error");
    }
  }
  
  /* Função controle de Interface */
  
  // Abre o model de Upload (Mostra a janela de adicionar foto)
  function openUploadModal() {
    elements.uploadModal.style.display = "block"; // Muda o CSS para block (Visivel)
  }
  // Fecha o model de Upload
  function closeUploadModal() {
    elements.uploadModal.style.display = "none"; // Muda o CSS para none (Invisivel)
  }
  
  // Fecha modal ao clicar fora dele
  function handleOutsideClick(event) {
    //Verifica se o click foi no model (Area escura ao redor)
    if (event.target === elements.uploadModal) {
      closeUploadModal();
    }
  }
  
  // Processa o envio do formulário
  function handleFormSubmit(event) {
    event.preventDefault(); // Impede o recarregamtno da página
  
    // Cria um novo FormData com os valores do formulário
    const formData = new FormData();
    formData.append("name", elements.nameInput.value); // Adiciona o nome do foto
    formData.append("file", elements.fileInput.files[0]); // Adiciona o arquivo
  
    // Chama a função de Upload
    uploadNewPhoto(formData);
  }
  
  // Função principal de carremento
  async function loadAndDisplayPhotos() {
    const photos = await fetchPhotos(); // Busca as fotos e aguarda
    renderPhotoGrid(photos); // Renderiza as fotos no Grid
  }
  
  // Configura todos os eventos da aplicação (Centraliza a configuração)
  function setupEventListeners() {
    // Botão "Adicionar foto" abre o Modal
    elements.addPhotoButton.addEventListener("click", openUploadModal);
    // Botão "X" fecha o Modal
    elements.closeButton.addEventListener("click", closeUploadModal);
    // Click fora do modal (Fechar)
    window.addEventListener("click", handleOutsideClick);
    // Submit do formulário chama a função de upload
    elements.uploadForm.addEventListener("submit", handleFormSubmit);
  }
  
  /* Inicialização da aplicação */
  
  // Inicia a aplicação quando o DOM estiver pronto
  document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners(); // Configura todos os eventos
    loadAndDisplayPhotos(); // Carrega e exibe as fotos inicias
  });