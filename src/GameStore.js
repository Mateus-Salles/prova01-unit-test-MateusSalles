/**
 * GameStore
 * Simula uma lojinha digital de jogos (tipo Steam/PSN) 🎮🛍️
 * Cada método faz UMA coisa só, então é super fácil de testar isoladinho.
 */
class GameStore {
  constructor() {
    this.catalog = new Map();      // gameId -> { id, title, genre, price, discount, reviews: [] }
    this.cart = new Set();         // gameIds no carrinho
    this.wishlist = new Set();     // gameIds na lista de desejos
    this.purchasedGames = new Set(); // gameIds já comprados
    this.salesCount = new Map();   // gameId -> quantidade vendida
  }

  // ---------- Catálogo ----------

  /**
   * Adiciona um novo jogo ao catálogo.
   * @param {{ id: string, title: string, genre: string, price: number }} game
   *   - id: obrigatório, string única identificando o jogo
   *   - title: nome do jogo
   *   - genre: gênero (ex: 'RPG', 'Ação')
   *   - price: preço base (número, sem desconto)
   * @returns {object} o objeto do jogo salvo no catálogo:
   *   { id, title, genre, price, discount: 0, reviews: [] }
   * @throws {Error} se `game` for nulo ou não tiver `id`
   */
  addGame(game) {
    if (!game || !game.id) throw new Error('Jogo precisa ter um id');
    this.catalog.set(game.id, {
      id: game.id,
      title: game.title,
      genre: game.genre,
      price: game.price,
      discount: 0,
      reviews: [],
    });
    return this.catalog.get(game.id);
  }

  /**
   * Remove um jogo do catálogo pelo id.
   * @param {string} gameId - id do jogo a remover
   * @returns {boolean} true se o jogo existia e foi removido, false se não existia
   */
  removeGame(gameId) {
    return this.catalog.delete(gameId);
  }

  /**
   * Busca um jogo pelo id.
   * @param {string} gameId - id do jogo
   * @returns {object|null} o objeto do jogo, ou null se não existir
   */
  getGameById(gameId) {
    return this.catalog.get(gameId) || null;
  }

  /**
   * Busca jogos cujo título contenha o texto informado (case-insensitive).
   * @param {string} query - trecho do título a buscar
   * @returns {object[]} array de jogos que combinam (pode ser vazio)
   */
  searchGamesByTitle(query) {
    const q = query.toLowerCase();
    return [...this.catalog.values()].filter(g =>
      g.title.toLowerCase().includes(q)
    );
  }

  /**
   * Filtra jogos por gênero exato.
   * @param {string} genre - gênero a filtrar (ex: 'RPG')
   * @returns {object[]} array de jogos daquele gênero (pode ser vazio)
   */
  filterByGenre(genre) {
    return [...this.catalog.values()].filter(g => g.genre === genre);
  }

  /**
   * Filtra jogos cujo preço COM desconto esteja dentro de um intervalo.
   * @param {number} min - preço mínimo (inclusive)
   * @param {number} max - preço máximo (inclusive)
   * @returns {object[]} array de jogos dentro da faixa de preço (pode ser vazio)
   */
  filterByPriceRange(min, max) {
    return [...this.catalog.values()].filter(
      g => this.getDiscountedPrice(g.id) >= min && this.getDiscountedPrice(g.id) <= max
    );
  }

  // ---------- Descontos ----------

  /**
   * Aplica um percentual de desconto a um jogo.
   * @param {string} gameId - id do jogo
   * @param {number} percent - percentual de 0 a 100
   * @returns {object} o jogo atualizado, já com `discount` novo
   * @throws {Error} se o jogo não existir, ou se percent < 0 ou > 100
   */
  applyDiscount(gameId, percent) {
    const game = this.getGameById(gameId);
    if (!game) throw new Error('Jogo não encontrado');
    if (percent < 0 || percent > 100) throw new Error('Desconto inválido');
    game.discount = percent;
    return game;
  }

  /**
   * Remove qualquer desconto de um jogo (volta discount para 0).
   * @param {string} gameId - id do jogo
   * @returns {object} o jogo atualizado
   * @throws {Error} se o jogo não existir
   */
  removeDiscount(gameId) {
    const game = this.getGameById(gameId);
    if (!game) throw new Error('Jogo não encontrado');
    game.discount = 0;
    return game;
  }

  /**
   * Calcula o preço final de um jogo já aplicando o desconto atual.
   * @param {string} gameId - id do jogo
   * @returns {number} preço com desconto, arredondado em 2 casas decimais
   * @throws {Error} se o jogo não existir
   */
  getDiscountedPrice(gameId) {
    const game = this.getGameById(gameId);
    if (!game) throw new Error('Jogo não encontrado');
    return +(game.price * (1 - game.discount / 100)).toFixed(2);
  }

  // ---------- Carrinho ----------

  /**
   * Adiciona um jogo ao carrinho.
   * @param {string} gameId - id do jogo (deve existir no catálogo)
   * @returns {string[]} array com os ids atualmente no carrinho
   * @throws {Error} se o jogo não existir no catálogo
   */
  addToCart(gameId) {
    if (!this.catalog.has(gameId)) throw new Error('Jogo não encontrado');
    this.cart.add(gameId);
    return [...this.cart];
  }

  /**
   * Remove um jogo do carrinho.
   * @param {string} gameId - id do jogo
   * @returns {boolean} true se estava no carrinho e foi removido, false se não estava
   */
  removeFromCart(gameId) {
    return this.cart.delete(gameId);
  }

  /**
   * Soma o preço (com desconto) de todos os itens no carrinho.
   * @returns {number} valor total do carrinho (0 se carrinho vazio)
   */
  getCartTotal() {
    return [...this.cart].reduce(
      (total, id) => total + this.getDiscountedPrice(id),
      0
    );
  }

  /**
   * Esvazia o carrinho por completo.
   * @returns {boolean} sempre true, confirmando que o carrinho ficou vazio
   */
  clearCart() {
    this.cart.clear();
    return this.cart.size === 0;
  }

  // ---------- Lista de desejos ----------

  /**
   * Adiciona um jogo à lista de desejos.
   * @param {string} gameId - id do jogo (deve existir no catálogo)
   * @returns {string[]} array com os ids atualmente na wishlist
   * @throws {Error} se o jogo não existir no catálogo
   */
  addToWishlist(gameId) {
    if (!this.catalog.has(gameId)) throw new Error('Jogo não encontrado');
    this.wishlist.add(gameId);
    return [...this.wishlist];
  }

  /**
   * Remove um jogo da lista de desejos.
   * @param {string} gameId - id do jogo
   * @returns {boolean} true se estava na wishlist e foi removido, false se não estava
   */
  removeFromWishlist(gameId) {
    return this.wishlist.delete(gameId);
  }

  // ---------- Compra ----------

  /**
   * Finaliza a compra de tudo que está no carrinho.
   * Marca os jogos como comprados, soma vendas e limpa o carrinho.
   * @param {string} paymentMethod - método de pagamento (ex: 'cartao', 'pix'), obrigatório
   * @returns {{ purchased: string[], total: number, paymentMethod: string }}
   *   - purchased: ids dos jogos comprados nesta transação
   *   - total: valor total pago
   *   - paymentMethod: método usado
   * @throws {Error} se o carrinho estiver vazio ou paymentMethod não for informado
   */
  checkout(paymentMethod) {
    if (this.cart.size === 0) throw new Error('Carrinho vazio');
    if (!paymentMethod) throw new Error('Método de pagamento obrigatório');

    const purchased = [...this.cart];
    purchased.forEach(id => {
      this.purchasedGames.add(id);
      this.salesCount.set(id, (this.salesCount.get(id) || 0) + 1);
    });

    const total = this.getCartTotal();
    this.clearCart();
    return { purchased, total, paymentMethod };
  }

  /**
   * Verifica se um jogo já foi comprado.
   * @param {string} gameId - id do jogo
   * @returns {boolean} true se já foi comprado, false caso contrário
   */
  isGameOwned(gameId) {
    return this.purchasedGames.has(gameId);
  }

  // ---------- Avaliações ----------

  /**
   * Adiciona uma avaliação (review) a um jogo.
   * @param {string} gameId - id do jogo
   * @param {number} rating - nota de 1 a 5
   * @param {string} [comment=''] - comentário opcional
   * @returns {Array<{ rating: number, comment: string }>} array com todas as reviews do jogo
   * @throws {Error} se o jogo não existir, ou rating < 1 ou > 5
   */
  addReview(gameId, rating, comment = '') {
    const game = this.getGameById(gameId);
    if (!game) throw new Error('Jogo não encontrado');
    if (rating < 1 || rating > 5) throw new Error('Nota deve ser entre 1 e 5');
    game.reviews.push({ rating, comment });
    return game.reviews;
  }

  /**
   * Calcula a média das notas de um jogo.
   * @param {string} gameId - id do jogo
   * @returns {number} média das notas (0 se o jogo não existir ou não tiver reviews)
   */
  getAverageRating(gameId) {
    const game = this.getGameById(gameId);
    if (!game || game.reviews.length === 0) return 0;
    const sum = game.reviews.reduce((acc, r) => acc + r.rating, 0);
    return +(sum / game.reviews.length).toFixed(2);
  }

  // ---------- Ranking ----------

  /**
   * Retorna os jogos mais vendidos, do maior para o menor número de vendas.
   * @param {number} [limit=5] - quantidade máxima de jogos a retornar
   * @returns {object[]} array de jogos (com campo extra `sales`), ordenado por vendas desc
   */
  getTopSellingGames(limit = 5) {
    return [...this.salesCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id, sales]) => ({ ...this.getGameById(id), sales }));
  }
}

module.exports = GameStore;
