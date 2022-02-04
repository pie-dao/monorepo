import Button from "../components/Button";
import content from "../content/en_EN.json";

const Ovens = () => {
  return (
    <section className="bg-highlight w-full mt-5 mb-28">
      <div className="container mx-auto text-center py-12 relative">
        <h2 className="text-black text-xl md:text-4xl uppercase mb-6">
          {content.ovens.title.first}
          <br />
          <span className="font-bold">{content.ovens.title.highlighted}</span>
        </h2>
        <p className="max-w-[70%] mx-auto">
          {content.ovens.description.first}{" "}
          <span className="font-bold">
            {content.ovens.description.highlighted}
          </span>
        </p>
        <div className="w-full absolute mt-4">
          <Button
            className="uppercase px-8 mx-auto w-[200px] flex flex-col"
            gradient
          >
            {content.ovens.call_to_action.title}
            <br />
            <span className="font-light">
              {content.ovens.call_to_action.subtitle}
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Ovens;
