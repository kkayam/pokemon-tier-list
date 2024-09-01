import { useState } from 'react';
import { fetchGoogleSheetsData } from '../lib/fetchGoogleSheetsData';

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

// Define tier colors mapping
const tierColors = {
  'S+': 'bg-red-600 text-white',
  S: 'bg-red-500 text-white',
  'S-': 'bg-red-400 text-white',
  A: 'bg-orange-500 text-white',
  B: 'bg-yellow-500 text-black',
  C: 'bg-green-500 text-white',
  D: 'bg-blue-500 text-white',
  E: 'bg-indigo-500 text-white',
  F: 'bg-purple-500 text-white',
};

// Define exceptions for specific Pokémon names
const nameExceptions = {
  'Necrozma-DM': 'dawn-wings-necrozma',
  'Dialga-A': 'dialga',
  'Dialga-O': 'dialga-origin-forme',
  'Palkia-A': 'palkia',
  'Palkia-O': 'palkia-origin-forme',
  'Enamorus-I': 'enamorus-incarnate-forme',
};

export default function Home({ data }) {
  const [searchTerm, setSearchTerm] = useState(''); // State to handle search term

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Extract headers and rows from the formatted data
  const types = data.headers;
  const pokemons = data.pokemons;

  // Filtered Pokémon based on search term
  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Pokémon..."
          className="w-full p-2 border rounded-md text-black bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid layout for types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {types.map((type, index) => {
          // Filter Pokémon by type and search term
          const pokemonsByType = filteredPokemons.filter((pokemon) => pokemon.type === type);

          // If no Pokémon match the current type and search term, skip rendering this type
          if (pokemonsByType.length === 0) {
            return null;
          }

          return (
            <div key={index} className={`p-4 rounded-lg shadow-md ${typeColors[type]}`}>
              <h2 className="text-2xl font-bold mb-4 text-white">{type}</h2>
              <div className="flex flex-wrap gap-4">
                {pokemonsByType.map((pokemon, index) => {
                  // Check if the Pokémon name is an exception
                  const formattedName = nameExceptions[pokemon.name]
                    ? nameExceptions[pokemon.name]
                    : pokemon.name.toLowerCase().replace(/\s+/g, '-');

                  const pokemonLink = `https://pokemongo.gamepress.gg/c/pokemon/${formattedName}`;

                  return (
                    <div
                      key={index}
                      className="bg-white text-black p-2 rounded-md shadow-sm flex items-center justify-between"
                    >
                      <a href={pokemonLink} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold mr-4 hover:underline">
                        {pokemon.name}
                      </a>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-md ${tierColors[pokemon.tier]}`}
                      >
                        {pokemon.tier}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const data = await fetchGoogleSheetsData();

  return {
    props: {
      data,
    },
  };
}