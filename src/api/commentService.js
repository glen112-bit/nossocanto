
// client/src/api/commentService.js

import apiClient from './apiClient'; // Axios configurado para la URL base del backend

@params {string}
@returns {Promise<Array<Object>>}

export const fetchCommetnByMediaId = async (mediaId) =>{
  try {
    const response = await apliClient.get(`/comments/${mediaId}`);
    return response.data
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//publicar comentario
@param {string}
@param {string}
@returns {Promise<Object>}

export const postComment = async (mediaId, commentText) => {
  try {
    const response = await apiClient.post(`/comments/${mediaId}`, {
      text: commentText
    });
    return response.data
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

