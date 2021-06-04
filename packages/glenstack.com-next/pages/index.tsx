import { AmpList, AmpImg } from "react-amphtml";
import lol from "components/landing/assets/collaborate.png";

export const config = { amp: true };

const Home = () => {
  return (
    <div>
      <main>
        <AmpList
          specName="default"
          width="auto"
          height="300"
          src={`https://rickandmortyapi.com/graphql?query=${encodeURIComponent(
            `{ episodes { results { name episode } } }`
          )}`}
          items="data.episodes.results"
        >
          <template
            type="amp-mustache"
            dangerouslySetInnerHTML={{
              __html: `<div>{{ episode }}: {{ name }}</div>`,
            }}
          />
        </AmpList>
        <AmpImg src={lol} specName="default" width={200} height={300} />
      </main>
    </div>
  );
};

export default Home;
