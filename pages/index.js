import { useState } from 'react';
import fs from 'fs';
import path from 'path';

// Define type colors mapping
const typeColors = {
  Fire: 'bg-red-500',
  Water: 'bg-blue-500',
  Grass: 'bg-green-500',
  Electric: 'bg-yellow-400',
  Psychic: 'bg-purple-500',
  Ice: 'bg-blue-200',
  Dragon: 'bg-indigo-600',
  Dark: 'bg-gray-800 text-white',
  Fairy: 'bg-pink-400',
  Normal: 'bg-gray-200',
  Fighting: 'bg-red-700',
  Flying: 'bg-blue-300',
  Poison: 'bg-purple-300',
  Ground: 'bg-yellow-700',
  Rock: 'bg-gray-600',
  Bug: 'bg-green-600',
  Ghost: 'bg-purple-700',
  Steel: 'bg-gray-500',
};

// Define tier colors mapping with + and - cases for every tier
const tierColors = {
  S: 'bg-red-500 text-white',
  'S-': 'bg-red-400 text-white',
  'A+': 'bg-orange-600 text-white',
  A: 'bg-orange-500 text-white',
  'A-': 'bg-orange-400 text-white',
  'B+': 'bg-yellow-600 text-black',
  B: 'bg-yellow-500 text-black',
  'B-': 'bg-yellow-400 text-black',
  'C+': 'bg-green-600 text-white',
  C: 'bg-green-500 text-white',
  'C-': 'bg-green-400 text-white',
  'D+': 'bg-blue-600 text-white',
  D: 'bg-blue-500 text-white',
  'D-': 'bg-blue-400 text-white',
  'E+': 'bg-indigo-600 text-white',
  E: 'bg-indigo-500 text-white',
  'E-': 'bg-indigo-400 text-white',
  F: 'bg-gray-500 text-white',
};

// Define exceptions for specific Pokémon names
const nameExceptions = {
  'Necrozma-DM': 'dawn-wings-necrozma',
  'Dialga-A': 'dialga',
  'Dialga-O': 'dialga-origin-forme',
  'Palkia-A': 'palkia',
  'Palkia-O': 'palkia-origin-forme',
  Enamorous: 'enamorous-incarnate-forme',
};
const extractUniqueTiers = (pokemons) => {
  // Use a Set to store unique tier values
  const uniqueTiers = new Set();

  pokemons.forEach((pokemon) => {
    uniqueTiers.add(pokemon.tier);
  });

  // Convert the Set to an array and return it
  return Array.from(uniqueTiers);
};

export default function Home({ pokemonData }) {
  const [searchTerm, setSearchTerm] = useState(''); // State to handle search term
  const [selectedTiers, setSelectedTiers] = useState([]); // State to handle multiple selected tiers
  const [selectedVersions, setSelectedVersions] = useState([]); // State to handle selected versions
  const [showMore, setShowMore] = useState({});

  // Extract headers and rows from the formatted data
  const types = Object.keys(typeColors);
  const pokemons = pokemonData;
  const uniqueTiers = extractUniqueTiers(pokemons);
  const pokemon_versions = ["Shadow", "Mega", "Normal"];

  // Filtered Pokémon based on search term, selected tiers, and selected versions
  const filteredPokemons = pokemons.filter((pokemon) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearchTerm =
      pokemon.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      pokemon.type.toLowerCase().includes(lowerCaseSearchTerm);

    // Check if Pokémon matches selected tiers
    const matchesTier = selectedTiers.length ? selectedTiers.includes(pokemon.tier) : true;

    // Check if Pokémon matches selected versions
    const matchesVersion = selectedVersions.length ? selectedVersions.includes(pokemon.version) : true;

    return matchesSearchTerm && matchesTier && matchesVersion;
  });

  // Function to toggle tier selection
  const toggleTierSelection = (tier) => {
    setSelectedTiers((prevSelectedTiers) =>
      prevSelectedTiers.includes(tier)
        ? prevSelectedTiers.filter((selectedTier) => selectedTier !== tier) // Remove tier if already selected
        : [...prevSelectedTiers, tier] // Add tier if not selected
    );
  };

  // Function to toggle version selection
  const toggleVersionSelection = (version) => {
    setSelectedVersions((prevSelectedVersions) =>
      prevSelectedVersions.includes(version)
        ? prevSelectedVersions.filter((selectedVersion) => selectedVersion !== version) // Remove version if already selected
        : [...prevSelectedVersions, version] // Add version if not selected
    );
  };

  const handleSeeMore = (type) => {
    setShowMore((prevShowMore) => ({
      ...prevShowMore,
      [type]: !prevShowMore[type],
    }));
  };

  // Function to clear all selected tiers
  const clearSelectedTiers = () => {
    setSelectedTiers([]);
  };

  // Function to clear all selected versions
  const clearSelectedVersions = () => {
    setSelectedVersions([]);
  };

  return (
    <div className="p-4">
      {/* Search Bar */}
      <h1 className="text-4xl md:text-6xl font-bold mb-16 mt-16">The Definite Pokemon GO Tier List</h1>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search Pokémon by name or type..."
          className="w-full text-lg md:text-2xl p-4 border rounded-md text-black bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="absolute right-6 text-lg md:text-2xl top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setSearchTerm('')}
          >
            X
          </button>
        )}
      </div>

      {/* Tier Filter Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        {Object.keys(tierColors).map((tier) => {
          return uniqueTiers.includes(tier) && (
            <button
              key={tier}
              className={`py-1 px-5 text-black rounded-2xl shadow-sm ${selectedTiers.includes(tier) ? 'bg-white ' : 'bg-gray-500'} hover:bg-gray-300`}
              onClick={() => toggleTierSelection(tier)}
            >
              {tier}
            </button>
          );
        })}
        {/* Clear Tiers Button */}
        <button
          className="py-1 px-5 rounded-2xl shadow-sm bg-white text-black hover:bg-gray-300"
          onClick={clearSelectedTiers}
        >
          Clear Tiers
        </button>
      </div>

      {/* Version Filter Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        {pokemon_versions.map((version) => {
          return (
            <button
              key={version}
              className={`py-1 px-5 text-black rounded-2xl shadow-sm ${selectedVersions.includes(version) ? 'bg-white ' : 'bg-gray-500'} hover:bg-gray-300`}
              onClick={() => toggleVersionSelection(version)}
            >
              {version}
            </button>
          );
        })}
        {/* Clear Versions Button */}
        <button
          className="py-1 px-5 rounded-2xl shadow-sm bg-white text-black hover:bg-gray-300"
          onClick={clearSelectedVersions}
        >
          Clear Versions
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {types.map((type, typeIndex) => {
          // Filter Pokémon by type and search term
          const pokemonsByType = filteredPokemons.filter((pokemon) => pokemon.type === type);

          // If no Pokémon match the current type and search term, skip rendering this type
          if (pokemonsByType.length === 0) {
            return null;
          }

          // Determine the number of Pokémon to display
          const pokemonsToDisplay = showMore[type] ? pokemonsByType : pokemonsByType.slice(0, 20);

          return (
            <div key={typeIndex} className={`p-4 rounded-lg shadow-md ${typeColors[type]} relative pb-16`}>
              <h2 className="text-2xl font-bold mb-4 text-white">{type}</h2>
              <div className="flex flex-wrap gap-4">
                {pokemonsToDisplay.map((pokemon, index) => {
                  // Check if the Pokémon name is an exception
                  const formattedName = nameExceptions[pokemon.name]
                    ? nameExceptions[pokemon.name]
                    : pokemon.name.toLowerCase().replace(/\s+/g, '-');

                  const pokemonLink = `https://pokemongo.gamepress.gg/c/pokemon/${formattedName}`;

                  return (
                    <a
                      key={index}
                      href={pokemonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-black p-2 rounded-md shadow-sm flex items-center justify-between transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-300"
                    >
                      <span className="text-lg font-semibold mr-4">{pokemon.name}</span>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-md ${tierColors[pokemon.tier]}`}
                      >
                        {pokemon.tier}
                      </span>
                    </a>
                  );
                })}
              </div>
              {pokemonsByType.length > 20 && (

                <button
                  onClick={() => handleSeeMore(type)}
                  className="absolute bottom-0 left-0 w-full py-2 font-bold bg-white/30 text-white text-center rounded-b-lg"
                >
                  {showMore[type] ? 'Show Less' : 'See More'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="mt-16 p-4 rounded-lg shadow-md bg-blue-500 text-white">
        <h2 className="text-2xl font-bold mb-4">Info</h2>
        <div className="flex flex-wrap gap-4">
          {/* Data Source Link */}
          <a
            href="https://docs.google.com/spreadsheets/d/18HAt9eCxOxf6E5xkhx3twTlmBSTPyNszAZBOAQiik7Q/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black p-2 rounded-md shadow-sm flex items-center justify-between transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-300"
          >
            <span className="text-lg font-semibold">Tier List Data Source</span>
          </a>
          {/* GitHub Repo Link */}
          <a
            href="https://github.com/kkayam/pokemon-tier-list"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black p-2 rounded-md shadow-sm flex items-center justify-between transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-gray-300"
          >
            <span className="text-lg font-semibold">Contribute on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  // Path to the public directory
  const dataDirectory = path.join(process.cwd(), 'data');

  // Read all files in the public directory
  const files = fs.readdirSync(dataDirectory);

  // Initialize an empty array to store the combined JSON content
  let combinedData = [];

  // Define tier ranking, S being the highest
  const tierRanking = {
    'S+': 1,
    'S': 2,
    'S-': 3,
    'A+': 4,
    'A': 5,
    'A-': 6,
    'B+': 7,
    'B': 8,
    'B-': 9,
    'C+': 10,
    'C': 11,
    'C-': 12,
    'D+': 13,
    'D': 14,
    'D-': 15,
    'E+': 16,
    'E': 17,
    'E-': 18,
    'F+': 19,
    'F': 20,
    'F-': 21,
  };

  // Loop through all the files and filter only JSON files
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(dataDirectory, file);

      // Read and parse the content of each JSON file
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);

      jsonData.forEach(pokemon => {
        const pokemonNameLower = pokemon.name.toLowerCase();
        if (/\bshadow\b/.test(pokemonNameLower)) {
          pokemon.version = "Shadow";
        } else if (/\b(mega|primal)\b/.test(pokemonNameLower)) {
          pokemon.version = "Mega";
        } else {
          pokemon.version = "Normal";
        }
      });

      // Combine the JSON data into a single array
      combinedData = combinedData.concat(jsonData);
    }
  }

  // Sort the combined data by tier using the defined ranking
  combinedData.sort((a, b) => {
    // Get the ranking for each Pokémon's tier
    const rankA = tierRanking[a.tier] || 999;  // Default to a large number if tier is undefined
    const rankB = tierRanking[b.tier] || 999;  // Default to a large number if tier is undefined

    return rankA - rankB;  // Sort ascending, so lower rank comes first
  });

  // Return the combined data as props
  return {
    props: {
      pokemonData: combinedData,
    },
  };
}