import Head from 'next/head'
import styles from "../styles/Home.module.css";
import content from "../content/en_EN.json";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="PieDAO Metaverse - Home Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-white grid place-items-center bg-no-repeat bg-contain bg-center bg-[url('/bg_lines.svg')] h-[634px]">
        
        {/* Hero Section */}
        <section className={`${styles.hero} w-full justify-evenly content-center text-center`}>
          <div class="pb-16">
            <h2 class="uppercase text-xl">{content.hero.sub_title}</h2>
            <h1 class="uppercase text-4xl">{content.hero.title}</h1>
            <p class="font-bold">{content.hero.content_highlight}</p>
            <p>{content.hero.content_text}</p>            
          </div>
          <div class="">
            <button class="pl-1 pr-1 pt-4 pb-4 rounded-md bg-gradient-to-tr from-red-500 to-blue-500">
              <span class="rounded-md bg-primary p-4">{content.hero.call_to_action}</span>
            </button>
            <div class="p-2 flex justify-center">
              <p class="pr-2">{content.hero.call_to_text}</p>
              <img src="/green_arrow.svg" />
            </div>
          </div>
        </section>
      </div>

    </div>
  )
}
