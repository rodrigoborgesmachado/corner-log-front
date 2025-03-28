import api from './serviceApi'; 

const userApi = {
    /**
     * Fetch all with optional filters.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The list.
     */
    getAll: async (params = {}) => {
        try {
            const response = await api.get('/User', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching all items es:', error);
            throw error;
        }
    },

    /**
     * Fetch a item by its code.
     * @param {string} code - The item's unique code.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The item data.
     */
    getByCode: async (code, params = {}) => {
        try {
            const response = await api.get(`/User/${code}`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching items by code:', error);
            throw error;
        }
    },

    /**
     * Create a new item.
     * @param {Object} itemsData - The items data to create.
     * @returns {Promise<Object>} - The created items data.
     */
    create: async (itemsData) => {
        try {
            const response = await api.post('/User', itemsData);
            return response.data;
        } catch (error) {
            console.error('Error creating items:', error);
            throw error;
        }
    },

    /**
     * Update an existing items.
     * @param {Object} itemsData - The items data to update.
     * @returns {Promise<Object>} - The updated items data.
     */
    update: async (itemsData) => {
        try {
            const response = await api.put('/User', itemsData);
            return response.data;
        } catch (error) {
            console.error('Error updating items :', error);
            throw error;
        }
    },

    /**
     * Delete a item by its code.
     * @param {string} itemsCode - The item code to delete.
     * @returns {Promise<Object>} - The result of the deletion.
     */
    delete: async (itemsCode) => {
        try {
            const response = await api.delete('/User', {
                data: { code: itemsCode },
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    },

    /**
     * Export items es based on filters.
     * @param {Object} params - Query parameters such as `quantityMax`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Blob>} - The exported file data.
     */
    export: async (params) => {
        try {
            const response = await api.get('/User/export', {
                params,

            });
            return response.data;
        } catch (error) {
            console.error('Error exporting items es:', error);
            throw error;
        }
    },

    /**
         * Create a new admin.
         * @param {Object} adminData - The admin data to create.
         * @returns {Promise<Object>} - The created admin data.
         */
    confirmUser: async (adminData) => {
        try {
            const response = await api.post('/User/confirm-user', adminData);
            return response.data;
        } catch (error) {
            console.error('Error confirming admin:', error);
            throw error;
        }
    },

    /**
     * Fetch a paginated list of items with optional filters.
     * @param {Object} params - Query parameters such as `page`, `quantity`, `isActive`, `term`, `orderBy`, `include`.
     * @returns {Promise<Object>} - The paginated list of items.
     */
    getPaginated: async (params) => {
        try {
            const response = await api.get('/User/pagged', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching paginated items:', error);
            throw error;
        }
    },

    /**
     * Create a new admin.
     * @param {Object} email - The admin data to create.
     * @returns {Promise<Object>} - The created admin data.
     */
    recoverPass: async (email) => {
        try {
            const response = await api.get('/User/recover-pass-user?email=' + email);
            return response.data;
        } catch (error) {
            console.error('Error getting password admin:', error);
            throw error;
        }
    },
};

export default userApi;
