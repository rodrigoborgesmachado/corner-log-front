import api from './serviceApi'; 

const cashregisterApi = {
    /**
     * Fetch all with optional filters.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The list.
     */
    getAll: async (params = {}) => {
        try {
            const response = await api.get('/Cashregister', { params });
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
            const response = await api.get(`/Cashregister/${code}`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching items by code:', error);
            throw error;
        }
    },

    /**
     * Fetch a item by its code.
     * @param {string} code - The item's unique code.
     * @param {Object} params - Query parameters such as `include`.
     * @returns {Promise<Object>} - The item data.
     */
    getCurrentCash: async (params = {}) => {
        try {
            const response = await api.get(`/Cashregister/current-cash`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching items:', error);
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
            const response = await api.post('/Cashregister', itemsData);
            return response.data;
        } catch (error) {
            console.error('Error creating items:', error);
            throw error;
        }
    },

    /**
     * Create a new item.
     * @param {Object} itemsData - The items data to create.
     * @returns {Promise<Object>} - The created items data.
     */
    closeCash: async (itemsData) => {
        try {
            const response = await api.post('/Cashregister/close-cash', itemsData);
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
            const response = await api.put('/Cashregister', itemsData);
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
            const response = await api.delete('/Cashregister', {
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
            const response = await api.get('/Cashregister/export', {
                params,

            });
            return response.data;
        } catch (error) {
            console.error('Error exporting items es:', error);
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
            const response = await api.get('/Cashregister/pagged', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching paginated items:', error);
            throw error;
        }
    },
};

export default cashregisterApi;
