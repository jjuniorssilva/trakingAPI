const simplify = require("simplify-js"); // Biblioteca para simplificação de rotas
const axios = require("axios"); // Biblioteca para requisições HTTP
const rotas = require("./rotas"); // Importa a lista de rotas
const logger = require("../custom/logger"); // Importa o módulo de log personalizado
const cache = require("../cache"); // Importa o módulo de cache

/**
 * Função para simplificar uma rota usando a biblioteca simplify-js
 * @param {Array} points - Lista de coordenadas [longitude, latitude]
 * @param {Number} tolerance - Grau de simplificação da rota
 * @returns {Array} - Lista simplificada de coordenadas
 */
const simplifyRoute = (points, tolerance) => {
  const simplifiedPoints = points.map((point) => ({
    x: point[0],
    y: point[1],
  }));
  return simplify(simplifiedPoints, tolerance, true);
};

/**
 * Função para obter uma rota entre dois pontos utilizando o serviço OSRM
 * @param {Object} start - Objeto com latitude e longitude do ponto inicial
 * @param {Object} end - Objeto com latitude e longitude do ponto final
 * @returns {Object|null} - Objeto contendo coordenadas, distância e duração da rota ou null em caso de erro
 */
async function getRoute(start, end) {
  const url = `http://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
  try {
    const response = await axios.get(url);
    const route = response.data.routes[0];

    return {
      coordenadas: simplifyRoute(route.geometry.coordinates, 0.0001), // Simplifica a rota para reduzir pontos desnecessários
      distancia: route.distance / 1000 + "km", // Converte distância para quilômetros
      duracao: (route.duration / 60).toFixed(2) + "min", // Converte duração para minutos
    };
  } catch (error) {
    console.error("Erro ao calcular a rota:", error);
    return null;
  }
}

/**
 * Função para gerar uma placa aleatória no formato brasileiro (AAA0A00)
 * @returns {String} - Placa gerada
 */
function gerarPlacaAleatoria() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeros = "0123456789";

  const placa =
    letras[Math.floor(Math.random() * 26)] +
    letras[Math.floor(Math.random() * 26)] +
    letras[Math.floor(Math.random() * 26)] +
    numeros[Math.floor(Math.random() * 10)] +
    letras[Math.floor(Math.random() * 26)] +
    numeros[Math.floor(Math.random() * 10)] +
    numeros[Math.floor(Math.random() * 10)];

  return placa;
}

module.exports = {
  async execute() {
    cache.del("rotas"); // Remove rotas anteriores do cache antes de criar novas
    try {
      logger.debug("Iniciando a criação das rotas...");

      // Processa todas as rotas de forma assíncrona
      const results = await Promise.all(
        rotas.map(async (rota, index) => {
          const start = { lat: rota[0].latitude, lng: rota[0].longitude };
          const end = { lat: rota[1].latitude, lng: rota[1].longitude };

          // Obtém a rota entre os dois pontos
          const response = await getRoute(start, end);
          if (response) {
            return {
              id: `rota${index}`,
              placa: gerarPlacaAleatoria(), // Gera uma placa aleatória para cada rota
              capacidade: Math.floor(Math.random() * 9 + 1) + "t", // Define capacidade aleatória entre 1 e 9 toneladas
              origem: rota[0].cidade,
              destino: rota[1].cidade,
              ...response, // Adiciona coordenadas, distância e duração da rota
            };
          }
        })
      );

      cache.set("rotas", results); // Armazena as rotas geradas no cache

      logger.info("Criação de rotas finalizada com sucesso!");
    } catch (error) {
      logger.error("Falha na criação das rotas:", error);
    }
  },
};
