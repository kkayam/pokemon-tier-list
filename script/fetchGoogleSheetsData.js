const axios = require('axios');
const fs = require('fs');

// Define the Google Sheet ID
const SHEET_ID = '18HAt9eCxOxf6E5xkhx3twTlmBSTPyNszAZBOAQiik7Q';
const APIKEY = ""
// Function to fetch all sheet names from the Google Sheet
async function fetchSheetNames() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${APIKEY}`;

  try {
    const response = await axios.get(url);
    const sheets = response.data.sheets;

    // Extract and return sheet names
    return sheets.map(sheet => sheet.properties.title);
  } catch (error) {
    console.error('Error fetching sheet names from Google Sheets:', error);
    return [];
  }
}

// Function to fetch Pokémon data from the Google Sheets
async function fetchGoogleSheetsData() {
  try {
    // Get all the sheet names (which represent tiers)
    const sheetNames = (await fetchSheetNames()).slice(1);

    const allPokemons = [];

    // Loop through each sheet (each sheet represents a tier)
    for (let sheetName of sheetNames) {
      const RANGE = `'${sheetName}'!A2:B100`; // Assuming Pokémon names are in column A starting from row 2
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${APIKEY}`;

      const response = await axios.get(url);

      const rows = response.data.values;

      // Skip if no data
      if (!rows || rows.length === 0) continue;

      // Process Pokémon names, assigning them to the current tier (sheet name)
      for (let row of rows) {
        if (row[0]) { // If the cell is not empty, it contains a Pokémon name
          allPokemons.push({ tier: row[0], name: row[1], type: sheetName });
        }
      }
      if (sheetName == "Water") break;
    }

    return {
      headers: sheetNames,
      pokemons: allPokemons
    };

  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return [];
  }
}


(async () => {
  const data = (await fetchGoogleSheetsData()).pokemons;
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf-8');
  console.log('Data saved to data.json');
})();