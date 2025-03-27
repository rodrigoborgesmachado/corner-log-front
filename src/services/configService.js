import config from '../config/config.json';

class ConfigService {
  constructor() {
    this.config = config;
  }

  getApiUrl() {
    return this.config.apiUrl;
  }

  getDefaultNumberOfItemsTable() {
    return this.config.DefaultNumberOfItemsTable;
  }

  getAdminEntityCode() {
    return this.config.SunSaleCode;
  }
}

var configService =  new ConfigService();
export default configService;
