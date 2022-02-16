const FancyTitle = () => (
    <section className="flex flex-col">
        <h1 className="font-primary text-2xl sm:text-3xl md:text-4xl flex flex-wrap items-center text-center text-gray-700 justify-center">
            <span >Cross Chain & Layer 2 </span> 
            <span className="text-baby-blue-dark my-2 mx-5 font-semibold">Easy as 🥧</span>
        </h1>
    </section>
)

// const DisclosurePanel = () => {
//   return (
//     <Disclosure>
//       <Disclosure.Button>What are Auxo Vaults?</Disclosure.Button>
//       <Transition
//         enter="transition duration-100 ease-out"
//         enterFrom="transform scale-95 opacity-0"
//         enterTo="transform scale-100 opacity-100"
//         leave="transition duration-75 ease-out"
//         leaveFrom="transform scale-100 opacity-100"
//         leaveTo="transform scale-95 opacity-0"
//       >
//         <Disclosure.Panel><AuxoDetails /></Disclosure.Panel>
//       </Transition>
//     </Disclosure>
//   )
// }

// const AuxoDetails = () => (
//     <div className="
//     p-5
//     w-full
//     flex flex-col
//     items-center
//     justify-center
//     ">
//         <p className="sm:w-3/4 md:w-1/2 text-sm">
//             {DESCRIPTIONS.BANNER}
//         </p>
//         <ExternalUrl to={AUXO_HELP_URL}>
//             <p className="underline text-baby-blue-dark text-sm underline-offset-2 mt-3">
//                 Learn more about Auxo Vaults
//             </p>
//         </ExternalUrl>
//     </div>
// )

const Callout = (): JSX.Element => {
    return (
        <section className={`
            w-full
            pb-5
        `}>
            <div className="
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    h-48
                    mx-1 sm:mx-0
                    bg-baby-blue-light
                "
            >
                <FancyTitle />
            </div>
            {/* <div className="
                border-gradient
                rounded-lg
                relative
                shadow-lg
                w-1/3
                -top-10
                font-primary
            ">  
                <div className="w-full">
                <DisclosurePanel />
                </div>

            </div> */}
        </section>
    )
}

export default Callout

