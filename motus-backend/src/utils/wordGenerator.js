const axios = require('axios');

const DIFFICULTY_MAP = {
  easy: 5,
  medium: 7,
  hard: 9
};

const normalizeWord = (word) => {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toLowerCase();
};

const fetchFrenchWord = async (difficulty) => {
  const length = DIFFICULTY_MAP[difficulty];

  try {
    let response = await axios.get(`https://trouve-mot.fr/api/size/${length}`);

    const word = response.data[0].name;

    return normalizeWord(word);

  } catch (error) {
    console.error('erreur trouvemot API:', error.message);
  }
};

module.exports = { fetchFrenchWord };
