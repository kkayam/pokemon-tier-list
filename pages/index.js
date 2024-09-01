import { fetchGoogleSheetsData } from '../lib/fetchGoogleSheetsData';

export default function Home({ data }) {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Extract headers and rows from the formatted data
  const types = data.headers;
  const pokemons = data.pokemons;

  return (
    <div>
      {types.map((type, index) => (
        <>
          <div key={index}>{type}</div>
          <div>
            {pokemons.filter(pokemon => pokemon.type === type).map((pokemon, index) => (
              <div key={index}>{pokemon.name} {pokemon.tier}</div>
            ))}
        </div>
          <br />
          <br />
          <br />
          <br />
        </>
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