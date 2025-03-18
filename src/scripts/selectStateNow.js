const logger = require("../custom/logger"); // Importa o módulo de log personalizado
const cache = require("../cache"); // Importa o módulo de cache

module.exports = {
  async execute() {
    try {
      logger.debug("Iniciando a atualização das posições das rotas...");

      // Obtém as rotas armazenadas no cache
      const rotas = cache.get("rotas");
      if (!rotas) {
        logger.error("Rotas não encontradas no cache");
        return; // Se não houver rotas no cache, encerra a execução
      }

      // Obtém as posições atuais do cache ou inicializa um objeto vazio
      let posicoes = cache.get("posicoes") || {};

      // Percorre todas as rotas e atualiza a posição de cada uma
      rotas.forEach((rota) => {
        const posicaoAtual = posicoes[rota.id] || { trecho: 0, sentido: 1 };

        // Verifica se a rota atingiu o final do percurso e altera o sentido
        if (posicaoAtual.trecho === rota.coordenadas.length - 1) {
          posicaoAtual.sentido = -1; // Inverte o sentido para voltar
        } else if (posicaoAtual.trecho === 0) {
          posicaoAtual.sentido = 1; // Inverte o sentido para avançar
        }

        // Atualiza a posição do trecho conforme o sentido atual
        posicaoAtual.trecho += posicaoAtual.sentido;
        posicoes[rota.id] = posicaoAtual;
      });

      // Salva as posições atualizadas no cache
      cache.set("posicoes", posicoes);

      logger.debug("Atualizando rotas...");

      // Atualização opcional: incremento de um contador em cada rota
      // rotas.forEach(rota => {
      //   rota.contador = (rota.contador || 0) + 1;
      // });

      // Atualiza as rotas no cache (aparentemente sem alteração significativa)
      cache.set("rotas", rotas);

      logger.info("Atualização de rotas finalizada com sucesso!");
    } catch (error) {
      // Captura e registra qualquer erro que ocorra durante a execução
      logger.error("Falha na atualização das rotas:", error);
    }
  },
};
