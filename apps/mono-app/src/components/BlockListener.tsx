import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useState } from "react"

const BlockListener = (): JSX.Element => {
  const { library } = useWeb3React<Web3Provider>();
  const [block, setBlock] = useState(0)
  library && library.on('block', newblock => {
    setBlock(newblock)
  })
  return <div>Block Number: {block}</div>
}

export default BlockListener