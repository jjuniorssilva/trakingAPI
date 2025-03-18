const logger = require("../../custom/logger");
const cache = require("../../cache");

module.exports = {
  async execute(params) {
    try {
      logger.debug("Buscando geolocalização atual das rotas...");
      
      const rotas = cache.get("rotas");
      const posicoes = cache.get("posicoes") || {};
      
      if (!rotas) {
        logger.error("Rotas não encontradas no cache");
        return [];
      }
      
      const geoLocalizacoes = rotas.map(rota => {
        const posicaoAtual = posicoes[rota.id] || { trecho: 0 };
        const coordenadas = rota.coordenadas[posicaoAtual.trecho] || null;
        
        return {
          ...rota,
          coordenadas: coordenadas,
        };
      });
      
      logger.info("Geolocalização das rotas obtida com sucesso!");
      return geoLocalizacoes;
    } catch (error) {
      logger.error("Erro ao obter geolocalização das rotas: ", error.message);
      throw new Error("Falha ao buscar geolocalização das rotas!");
    }
  },
};
