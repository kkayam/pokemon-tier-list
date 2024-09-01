import axios from 'axios';

const SHEET_ID = '1m6Zmt3AUA_ZGoX88MgoQ0PngtSS55caFevg_nKH4rV0';
const RANGE = "'Tier List'!B2:S47";

export async function fetchGoogleSheetsData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${process.env.NEXT_PUBLIC_API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data.values;

    // Assuming the first row is the header
    var headers = data[0];
    const rows = data.slice(1);

    var currentTier = "";
    var pokemons = [];

    for (let row of rows) {

      if (row[0] !== "") {
        currentTier = row[0];
      }
      for (let column = 1; column < row.length; column++) {
        if (row[column] !== "") {
          pokemons.push({ type: headers[column], name: row[column], tier: currentTier });
        }
      }
    }
    headers = headers.slice(1);
    return {
      headers,
      pokemons
    };

  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return [];
  }
}