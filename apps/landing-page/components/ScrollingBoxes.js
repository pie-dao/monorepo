import Image from "next/image";
import content from "../content/en_EN.json";

const ScrollingBoxes = ({}) => {
  return (
    <section className={`w-full justify-evenly content-left text-left`}>
      <div className="bg-secondary p-10 pb-16">
        <p className="uppercase text-4xl">Easy access to<br />
          <span className="font-bold">the metaverse</span>
        </p>
        <p className="w-1/2 pt-4">{content.scrolling_boxes.description}</p>            
      </div>
      <div className="flex mb-4">
        <div className="w-1/2"></div>
        <div className="w-1/2 m-8">
          {content.scrolling_boxes.boxes.map(box => {
            return(
              <div ckey={box.id} lassName="p-1 rounded-md bg-gradient-to-tr from-red-500 to-blue-500 mb-4">
                <div className="w-full rounded-md bg-primary p-4 flex flex-col items-center justify-center text-center">
                  <img src="/play_hand.svg" className="w-1/4"/>
                  <p className="text-4xl text-highlight p-4">{box.title}</p>
                  <p className="p-2">{box.description}</p>
                </div>
              </div>              
            )
          })}        
        </div>
      </div>      
    </section>
  );
};

export default ScrollingBoxes;
