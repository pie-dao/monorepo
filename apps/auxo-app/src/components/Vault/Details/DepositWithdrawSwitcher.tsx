import { Tab } from "@headlessui/react"
import { Fragment } from "react"

const DepositWithdrawSwitcher = () => {
    return (
      <div className="
        w-full h-full">
      <Tab.Group>
        <Tab.List className="
          flex justify-evenly items-center">
        {['OPT-IN', 'DEPOSIT', 'WITHDRAW'].map((t, i) => (<Tab key={i} as={Fragment}>
            {({ selected }) => (
              <button
                className={
                    `
                ${selected ? 'text-black border-purple-700' : 'text-gray-300 border-gray-300'} border-b-2  w-full py-2 font-semibold`}
              >
                {t}
              </button>
            )}
          </Tab>))}
        </Tab.List>
        <Tab.Panels className="
          flex items-center justify-center h-[80%]">
          <Tab.Panel>Here we show veDOUGH opt in</Tab.Panel>
          <Tab.Panel>Here is the approve/deposit button</Tab.Panel>
          <Tab.Panel>Here is the enter BB/exit bb</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      </div>
    )
  }

  export default DepositWithdrawSwitcher