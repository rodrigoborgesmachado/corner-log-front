import api from './serviceApi'; // Import the axios instance

const tokenApi = {
    /**
     * Authenticate a user and retrieve a token.
     * @param {Object} credentials - The user credentials containing `userName` and `password`.
     * @returns {Promise<Object>} - The authentication response containing the access token.
     */
    getToken: async (credentials) => {
        try {
            const response = await api.post('/token', credentials);
            return response.data;
        } catch (error) {
            console.error('Error fetching token:', error);
            throw error;
        }
    },
};

export default tokenApi;
