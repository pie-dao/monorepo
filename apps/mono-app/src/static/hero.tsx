import { scrollTo } from "../utils/scroll";
import { ReactComponent as Logo } from '../logo.svg';

/**
 * This file is intended to be moved to a parent repository delivered to the user
 * through SSR, it is included here as a placeholder
 */

const Hero = (): JSX.Element => (
  <section
    className="
    h-screen
    flex flex-col align-middle justify-center
    "
  >
    <h1 className="text-xl mb-5">Simple, High Yield DeFi</h1>
    <section
      className="
      actions
      flex flex-col justify-around items-center
    "
    >
      <section>
        <button
          className="
          bg bg-pink-300 rounded-md hover:bg-pink-400
          p-2 m-1
          min-w-[150px]
          my-2
          sm:my-1
          "
          onClick={() => scrollTo('content', 100)}
        >
          Get Started
        </button>
        <button
          className="
          bg bg-pink-300 rounded-md hover:bg-pink-400 
          p-2 m-1
          min-w-[150px]
          "
        >
          Learn More
        </button>
      </section>
      <Logo
        className="h-10 w-10 absolute bottom-10 animate-bounce"
        onClick={() => scrollTo('content', 100)}
      />
    </section>
  </section>
);

export default Hero;