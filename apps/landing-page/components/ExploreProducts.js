import PieCardPlain from './PieCardPlain';
import content from '../content/en_EN.json';

const ExploreProducts = ({ morePies }) => {
  return (
    <section
      className={`bg-primary w-full justify-evenly flex-col content-center text-center flex md:flex-col overflow-hidden mb-20`}
    >
      <div className="flex ml-12 mr-12">
        <div className="w-full mb-10 content-center text-center">
          <h3 className="text-highlight uppercase text-4xl md:text-5xl mb-4">
            {content.explore_products.title.first}{' '}
            <span className="text-highlight font-bold">
              {content.explore_products.title.highlighted}
            </span>
          </h3>
        </div>
      </div>
      <div className="container mx-auto px-6 gap-x-10 gap-y-16 w-full flex flex-col lg:flex-row items-center justify-center">
        {morePies.map((singlePie) => {
          const { history, pie } = singlePie;
          return (
            <PieCardPlain key={pie.symbol} pieInfo={pie} pieHistory={history} />
          );
        })}
      </div>
    </section>
  );
};

export default ExploreProducts;
