// client/src/api/mediaService.js
import axios from 'axios';
const API_URL = 'http://localhost:3000/media'; // 🛑 Ajuste a URL base se necessário

/**
 * Envia um arquivo de mídia (imagem/vídeo) e seus metadados para o servidor.
 * @param {File} mediaFile - O arquivo a ser enviado.
 * @param {string} title - O título da mídia.
 * @param {string} description - A descrição da mídia.
 * @param {string} token - O JWT do usuário logado (obtido via AuthContext).
 * @returns {Promise<object>} Os dados da mídia criada pelo backend.
 */
export const uploadMedia = async (mediaFile, title, description, token) => {
    // 1. Cria o FormData para enviar o arquivo e os metadados
    const formData = new FormData();
    formData.append('mediaFile', mediaFile); // O nome 'mediaFile' deve corresponder ao nome esperado no Multer do backend
    formData.append('title', title);
    formData.append('description', description);

    // 2. Determina o tipo de mídia (para validação do backend)
    const mediaType = mediaFile.type.startsWith('video') ? 'video' : 'image';
    formData.append('type', mediaType);

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            // 🛑 IMPORTANTE: O Multer no backend espera o formato 'multipart/form-data', mas o 'fetch' configura isso automaticamente ao usar 'FormData'.
            // Você só precisa enviar o JWT no header 'Authorization'.
            headers: {
                'Authorization': `Bearer ${token}`, // Envia o token de autenticação
            },
            body: formData,
        });

        if (!response.ok) {
            // Tenta ler a mensagem de erro JSON do backend
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao carregar mídia: Status ${response.status}`);
        }

        return await response.json(); // Retorna os dados da mídia salva

    } catch (error) {
        // Lança o erro para ser capturado pelo componente
        throw error;
    }
};


/**
 * 🖼️ Busca os detalhes de uma mídia específica.
 * @param {string} mediaId - O ID da mídia.
 * @returns {Promise<object>} Os dados da mídia.
 */
export const getMediaDetails = async (mediaId) => {
    try {
        const response = await axios.get(`${API_URL}/${mediaId}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

/**
 * 💬 Envia um novo comentário para uma mídia.
 * @param {string} mediaId - O ID da mídia.
 * @param {string} text - O conteúdo do comentário.
 * @param {string} token - O JWT do usuário logado.
 * @returns {Promise<object>} Os dados do novo comentário.
 */
export const postComment = async (mediaId, text, token) => {
    try {
        const response = await axios.post(`http://localhost:3000/comment/${mediaId}`, // 🛑 Rota do Comentário
                                          { text },
                                          {
                                              headers: {
                                                  Authorization: `Bearer ${token}`,
                                              },
                                          }
                                         );
                                         return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

/**
 * 📝 Busca todos os comentários de uma mídia.
 * @param {string} mediaId - O ID da mídia.
 * @returns {Promise<Array<object>>} A lista de comentários.
 */
export const getMediaComments = async (mediaId) => {
    try {
        const response = await axios.get(`http://localhost:3000/comment/${mediaId}`); // 🛑 Rota do Comentário
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};



/**
 *  * 📢 Busca a lista de todas as mídias (Feed).
 *   * @returns {Promise<Array<object>>} A lista de objetos de mídia.
 *    */
export const getMediaFeed = async () => {
    try {
        // Assume que a rota GET /media retorna o feed completo
        //         const response = await axios.get(`http://localhost:3000/media`); 
        return response.data;

    } catch (error) {
        // Trata erros de rede ou servidor
        const errorMessage = error.response?.data?.message || 'Erro ao carregar o feed.';
        throw new Error(errorMessage);

    }

};

/**
 * 👤 Busca a lista de mídias postadas por um usuário específico.
 * @param {string} userId - O ID do usuário cujas mídias serão buscadas.
 * @returns {Promise<Array<object>>} A lista de objetos de mídia do usuário.
 */
export const getUserMedia = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:3000/media/user/${userId}`); 
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Erro ao carregar mídias do usuário.';
        throw new Error(errorMessage);
    }
};
