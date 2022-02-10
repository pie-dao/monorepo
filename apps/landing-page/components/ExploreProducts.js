import ParentSize from "@visx/responsive/lib/components/ParentSize";
import PieCard from "./PieCard";
import content from "../content/en_EN.json";

const ExploreProducts = ({ pies }) => {
  return (
    <section
      className={`bg-primary w-full justify-evenly flex-col content-center text-center flex md:flex-col overflow-hidden`}
    >
      <div className="flex ml-12 mr-12">
        <div className="w-full mb-10 content-center text-center">
          <h3 className="text-highlight uppercase text-4xl md:text-5xl mb-4">
            {content.explore_products.title.first}{" "}
            <span className="text-highlight font-bold">
              {content.explore_products.title.highlighted}
            </span>
          </h3>
        </div>
      </div>
      <div className="container mx-auto gap-10 w-full flex flex-col lg:flex-row items-center justify-center">
        {pies.map((pie) => {
          return (
            <div
              key={pie.symbol}
              className="h-[320px] w-full max-w-[425px] mb-2 rounded-lg relative"
            >
              <ParentSize>
                {({ width, height }) => (
                  <PieCard pieData={pie} height={height} width={width} />
                )}
              </ParentSize>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExploreProducts;
