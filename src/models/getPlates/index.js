const logger = require("../../custom/logger");
const cache = require("../../cache");

module.exports = {
  async execute(params) {
    try {
      const rotas = cache.get("rotas");

      if (!rotas) {
        logger.error("Rotas não encontradas no cache");
        return [];
      }
      //retornas todas as placas das rotas
      return rotas.map((rota) => rota.placa);
    } catch (error) {
      logger.error("Erro ao obter geolocalização das rotas: ", error.message);
      throw new Error("Falha ao buscar geolocalização das rotas!");
    }
  },
};
