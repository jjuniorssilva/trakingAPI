const logger = require("../../custom/logger");
const cache = require("../../cache");
const { error } = require("winston");

module.exports = {
  async execute(params) {
    const { placa } = params;
    try {
    console.log(placa)
      if (!placa) {
        logger.error("Placa não informada");
        return { error: "Placa não informada" };
      }
      logger.debug("Buscando geolocalização atual da rota "+placa+"...");

      const rotas = cache.get("rotas");
      const posicoes = cache.get("posicoes") || {};

      if (!rotas) {
        logger.error("Rotas não encontradas no cache");
        return [];
      }
      // retona a rota com a placa correpondente
      const rotasFiltradas = rotas.filter((rota) => rota.placa === placa);
      if (!rotasFiltradas.length) {
        logger.error("Placa não encontrada nas rotas");
        return [];
      }
      // retorna a posição da placa
      const posicao = posicoes[rotasFiltradas[0].id] || { trecho: 0 };

      // retorna a coordenada da placa
      const coordenadas = rotasFiltradas[0].coordenadas[posicao.trecho] || null;

      logger.info("Geolocalização da rota obtida com sucesso!");
      return {
        ...rotasFiltradas[0],
        coordenadas: coordenadas,
      };
    } catch (error) {
      logger.error("Erro ao obter geolocalização das rotas: ", error.message);
      throw new Error("Falha ao buscar geolocalização das rotas!");
    }
  },
};
