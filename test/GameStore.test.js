const GameStore = require("../src/GameStore")

test("Deve lançar um erro por id ser igual a null", () => {
  const gameStore = new GameStore()

  game = {
    title: "The Witcher 3: Wild Hunt",
    genre: "Action RPG",
    price: 159.99,
  }

  expect(() => gameStore.addGame(game)).toThrow()
})

test("Deve retornar true para o jogo já cadastrado", () => {
  const gameStore = new GameStore()

  game = {
    id: 1,
    title: "The Witcher 3: Wild Hunt",
    genre: "Action RPG",
    price: 159.99
  }

  const addResult = gameStore.addGame(game)
  const delResult = gameStore.removeGame(1)

  expect(delResult).toBe(true)
})

test("Deve retornar um jogo", () => {
  const gameStore = new GameStore()

  game = {
    id: 23,
    title: "Clair Obscur: Expedition 33",
    genre: "Turn based RPG",
    price: 199.99
  }

  const addResult = gameStore.addGame(game)
  const result = { ...game, discount: 0, reviews: [] }
  expect(gameStore.getGameById(23)).toEqual(result)
})

test("Deve retornar o jogo através do título", () => {
  const gameStore = new GameStore()

  game1 = {
    id: 2,
    title: "The Last of Us",
    genre: "Action",
    price: 349.99
  }

  gameStore.addGame(game1)

  game2 = {
    id: 3,
    title: "Naruto the last",
    genre: "Fighting",
    price: 49.99
  }

  gameStore.addGame(game2)

  game3 = {
    id: 4,
    title: "Pikimin",
    genre: "Adventure",
    price: 19.99
  }

  gameStore.addGame(game3)

  const correctResult = [{ ...game1, discount: 0, reviews: [] }, { ...game2, discount: 0, reviews: [] }]
  const result = gameStore.searchGamesByTitle("The Las")
  
  expect(result).toEqual(correctResult)
})

test("Deve retornar os jogos através do gênero", () => {
  const gameStore = new GameStore()

  game1 = {
    id: 1,
    title: "Jogo 1",
    genre: "RPG",
    price: 189.99
  }

  game2 = {
    id: 2,
    title: "Jogo 2",
    genre: "Adventure",
    price: 12.49
  }

  game3 = {
    id: 3,
    title: "Jogo 3",
    genre: "RPG",
    price: 299.99
  }

  basicResult = {
    discount: 0,
    reviews: []
  }

  gameStore.addGame(game1)
  gameStore.addGame(game2)
  gameStore.addGame(game3)

  const correctResult = [{ ...game1, ...basicResult }, { ...game3, ...basicResult }]
  const result = gameStore.filterByGenre("RPG")

  expect(result).toEqual(correctResult)
})

test("Deve filtrar os jogos dentro do intervalo de preço", () => {
  const gameStore = new GameStore()

  game1 = {
    id: 1,
    title: "Jogo 1",
    genre: "RPG",
    price: 189.99
  }

  game2 = {
    id: 2,
    title: "Jogo 2",
    genre: "Adventure",
    price: 12.49
  }

  game3 = {
    id: 3,
    title: "Jogo 3",
    genre: "RPG",
    price: 299.99
  }

  basicResult = {
    discount: 0,
    reviews: []
  }

  gameStore.addGame(game1)
  gameStore.addGame(game2)
  gameStore.addGame(game3)

  const correctResult = [{ ...game1, ...basicResult }, { ...game2, ...basicResult }]
  const result = gameStore.filterByPriceRange(10, 190)

  expect(result).toEqual(correctResult)
})

test("Deve aplicar um desconto", () => {
  const gameStore = new GameStore()

  game1 = {
    id: 1,
    title: "Jogo 1",
    genre: "RPG",
    price: 189.99
  }

  gameStore.addGame(game1)

  const correctResult = { ...game1, discount: 15, reviews: [] }
  const result = gameStore.applyDiscount(1, 15)

  expect(result).toEqual(correctResult)
})

test("Deve remover um desconto", () => {
  const gameStore = new GameStore()

  game1 = {
    id: 1,
    title: "Jogo 1",
    genre: "RPG",
    price: 189.99
  }

  gameStore.addGame(game1)

  const correctResult = { ...game1, discount: 0, reviews: [] }

  gameStore.applyDiscount(1, 15)

  const result = gameStore.removeDiscount(1)

  expect(result).toEqual(correctResult)
})

test("Deve retornar o valor do jogo com o desconto aplicado", () => {
  const gameStore = new GameStore()

  game1 = {
    id: 1,
    title: "Jogo 1",
    genre: "RPG",
    price: 189.99
  }

  game2 = {
    id: 3,
    title: "Jogo 3",
    genre: "RPG",
    price: 299.99
  }

  gameStore.addGame(game1)
  gameStore.addGame(game2)

  gameStore.applyDiscount(1, 10)
  const result1 = gameStore.getDiscountedPrice(1)
  const correctedResult1 = 170.99

  const result2 = gameStore.getDiscountedPrice(3)
  const correctedResult2 = 299.99

  expect(result1).toEqual(correctedResult1)
  expect(result2).toEqual(correctedResult2)
})

test("Deve adicionar um jogo ao carrinho", () => {
  const gameStore = new GameStore()

  game1 = {
    id: 1,
    title: "Jogo 1",
    genre: "RPG",
    price: 189.99
  }

  game2 = {
    id: 2,
    title: "Jogo 3",
    genre: "RPG",
    price: 299.99
  }

  gameStore.addGame(game1)
  gameStore.addGame(game2)

  expect(gameStore.addToCart(2)).toEqual([2])
  expect(gameStore.addToCart(1)).toEqual([2,1])
})


test("Deve remover um jogo do carrinho", () => {
  const gameStore = new GameStore()

  game1 = {
    id: 1,
    title: "Jogo 1",
    genre: "RPG",
    price: 189.99
  }

  game2 = {
    id: 2,
    title: "Jogo 3",
    genre: "RPG",
    price: 299.99
  }

  gameStore.addGame(game1)
  gameStore.addGame(game2)

  gameStore.addToCart(1)
  gameStore.addToCart(2)

  expect(gameStore.removeFromCart(1)).toBe(true)
  expect(gameStore.removeFromCart(3)).toBe(false)
})

test("Deve retornar o valor somado do carrinho", () => {
  const gameStore = new GameStore()

  game1 = {
    id: 1,
    title: "Jogo 1",
    genre: "RPG",
    price: 189.99
  }

  game2 = {
    id: 2,
    title: "Jogo 3",
    genre: "RPG",
    price: 299.99
  }

  gameStore.addGame(game1)
  gameStore.addGame(game2)

  gameStore.addToCart(1)
  gameStore.applyDiscount(1, 10)
  gameStore.addToCart(2)

  const correctResult = 170.99 + 299.99

  expect(gameStore.getCartTotal()).toEqual(correctResult)
})

test("Deve limpar o carrinho", () => {
  const gameStore = new GameStore()

  game1 = {
    id: 1,
    title: "Jogo 1",
    genre: "RPG",
    price: 189.99
  }

  game2 = {
    id: 2,
    title: "Jogo 3",
    genre: "RPG",
    price: 299.99
  }

  gameStore.addGame(game1)
  gameStore.addGame(game2)

  gameStore.addToCart(1)
  gameStore.applyDiscount(1, 10)
  gameStore.addToCart(2)

  gameStore.clearCart()

  expect(gameStore.getCartTotal()).toBe(0)
})


test("Deve adicionar um jogo a lista de desejos", () => {
  const gameStore = new GameStore()

  game1 = {
    id: 1,
    title: "Jogo 1",
    genre: "RPG",
    price: 189.99
  }

  game2 = {
    id: 2,
    title: "Jogo 3",
    genre: "RPG",
    price: 299.99
  }

  gameStore.addGame(game1)
  gameStore.addGame(game2)

  const result = gameStore.addToWishlist(2)

  expect(result).toEqual([2])
})
