import Button from "../components/Button";
import content from "../content/en_EN.json";

const Ovens = () => {
  return (
    <section className="bg-highlight w-full mt-5 mb-28">
      <div className="container mx-auto text-center py-12 relative px-6 flex flex-col items-center">
        <h3 className="text-black uppercase text-4xl md:text-5xl mb-4">
          {content.ovens.title.first}
          <br />
          <span className="font-bold">{content.ovens.title.highlighted}</span>
        </h3>
        <p className="max-w-[70%] mx-auto text-sm md:text-xl">
          {content.ovens.description.first}{" "}
          <span className="font-bold">
            {content.ovens.description.highlighted}
          </span>
        </p>
        <div className="absolute -bottom-8">
          <Button
            className="uppercase px-8 mx-auto w-[200px] flex flex-col"
            gradient
            target="_blank"
            rel="noreferrer noopener"
            href="https://www.piedao.org/#/oven"
            data-ga="btn-oven"
          >
            <>
              {content.ovens.call_to_action.title}
              <br />
              <span className="font-light">
                {content.ovens.call_to_action.subtitle}
              </span>
            </>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Ovens;
