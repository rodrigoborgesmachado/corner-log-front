import { createSlice } from '@reduxjs/toolkit';
import storageService from '../../services/storageService';
import Config from '../../config/storageConfiguration';
import configService from '../configService';

const token = storageService.getItem(Config.TOKEN);
const code = storageService.getItem(Config.CODE);
const name = storageService.getItem(Config.NAME);
const entitycode = storageService.getItem(Config.ENTITYCODE);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,
    code: code || null,
    isAuthenticated: !!token,
    name: name || '', 
    isAdmin: false,
    entitycode: entitycode || ''
  },
  reducers: {
    login: (state, action) => {
      const { access_token, code, name, entitycode } = action.payload;
      state.token = access_token;
      state.code = code;
      state.isAuthenticated = true;
      state.name = name;
      state.isAdmin = configService.getAdminEntityCode() === entitycode;
      state.entitycode = entitycode;

      storageService.setItem(Config.TOKEN, access_token);
      storageService.setItem(Config.NAME, name);
      storageService.setItem(Config.CODE, code);
      storageService.setItem(Config.ENTITYCODE, entitycode);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.name = '';
      state.isAdmin = false;
      state.isClient = false;
      storageService.clear();
    },
  },
});

export const { login, logout } = authSlice.actions;
export const selectUserName = (state) => state.auth.name;
export const selectUserCode = (state) => state.auth.code;
export const isAuthenticated = (state) => state.isAuthenticated;
export default authSlice.reducer;

