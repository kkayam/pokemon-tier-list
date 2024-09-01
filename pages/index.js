import { fetchGoogleSheetsData } from '../lib/fetchGoogleSheetsData';

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

export default function Home({ data }) {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Extract headers and rows from the formatted data
  const types = data.headers;
  const pokemons = data.pokemons;

  return (
    <div className="p-4">
      {types.map((type, index) => (
        <div key={index} className="my-6">
          <h2 className="text-2xl font-bold mb-4">{type}</h2>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
            {pokemons
              .filter((pokemon) => pokemon.type === type)
              .map((pokemon, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg shadow-md ${typeColors[pokemon.type]} flex items-center justify-between`}
                >
                  <span className="text-lg font-semibold">{pokemon.name}</span>
                  <span className="text-sm font-medium bg-white text-gray-800 px-2 py-1 rounded-md">
                    {pokemon.tier}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ))}
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