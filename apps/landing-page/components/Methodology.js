import Image from "next/image";
import content from "../content/en_EN.json";

const Metaverse = ({}) => {
  return (
    <section className={`bg-primary w-full justify-evenly content-center text-center flex flex-row md:flex-col`}>
      <div className="flex mb-4 ml-12 mr-12">
        <div className="w-full pt-[5pc] content-center text-center">
          <h1 className="text-4xl text-highlight uppercase">Methodology <span className="font-bold">& Strategy</span></h1>
          <h2>{content.methodology.description}</h2>
        </div>
      </div>
      <div className="flex items-center justify-center h-96 text-center">
        <img src="./carousel_placeholder.svg" />                
      </div>
      <div className="content-center text-center mb-16">
        <p className="font-small text-highlight_secondary">
          For detailed information on allocation and rebalancing procedures 
          <span className="font small text-highlight"> read the prospectus.</span>
        </p>
      </div>  
    </section>
  );
};

export default Metaverse;
