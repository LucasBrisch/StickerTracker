export const countries = [
  'MEX',
  'RSA',
  'KOR',
  'CZE',

  'CAN',
  'BIH',
  'QAT',
  'SUI',

  'BRA',
  'MAR',
  'HAI',
  'SCO',

  'USA',
  'PAR',
  'AUS',
  'TUR',

  'GER',
  'CUW',
  'CIV',
  'ECU',

  'NED',
  'JPN',
  'SWE',
  'TUN',

  'BEL',
  'EGY',
  'IRN',
  'NZL',

  'ESP',
  'CPV',
  'KSA',
  'URU',

  'FRA',
  'SEN',
  'IRQ',
  'NOR',

  'ARG',
  'ALG',
  'AUT',
  'JOR',

  'POR',
  'COD',
  'UZB',
  'COL',

  'ENG',
  'CRO',
  'GHA',
  'PAN',
]

const cokePlayers = [
  'Gabriel Magalhaes',
  'Lamine Yamal',
  'Harry Kane',
  'Virgil van Dijk',
  'Lautaro Martinez',
  'Emiliano Martinez',
  'Alphonso Davies',
  'Joshua Kimmich',
  'Federico Valverde',
  'Josko Gvardiol',
  'Santiago Gimenez',
  'Raul Jimenez',
  'Jefferson Lerma',
  'Enner Valencia',
]

export const stickers = []

stickers.push({
    code: '00',
    category: 'special',
    shiny: true
  
})

// FWC 
for (let i = 1; i <= 19; i++) {
  stickers.push({
    code: `FWC${i}`,
    category: 'FWC',
    shiny: true,
  })
}

// Países
countries.forEach((country) => {
  for (let i = 1; i <= 20; i++) {
    stickers.push({
      code: `${country}${i}`,
      category: country,
      shiny: i === 1,
      is_squad: i === 13,
    })
  }
})

//coca-cola
cokePlayers.forEach(player => {
  stickers.push({
    code: player,
    category: 'COKE',

    shiny: false,

    is_squad: false,
  })
})