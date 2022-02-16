import { Vault } from "../../../store/vault/Vault"
import { chainMap } from "../../../utils/networks"

const Card = ({ children, title }: { children?: React.ReactNode, title?: string }): JSX.Element => (
    <div className="
      p-5 rounded-lg shadow-md bg-white text-left text-xs sm:text-sm text-gray-600">
    <h2 className="font-extrabold text-lg sm:text-xl mb-2">{title}</h2>
      { children }
    </div>
)

export const VaultInfoCard = ({ vault }: { vault: Vault | undefined }) => {
    const chainId = vault?.network.chainId;
    const url = chainId && `${chainMap[chainId].blockExplorer}/address/${vault?.address}`;
    return (
        <Card title="Vault Info">
        { 
            url &&
            <div className="flex justify-between w-full flex-wrap">
                <p className="font-bold">Contract:</p>
                    <a
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-ellipsis truncate overflow-hidden"
                    >
                    <p className="truncate overflow-hidden">
                        <span className="text-baby-blue-dark underline mr-1 truncate overflow-hidden">{vault?.address}</span>
                        &#8594;
                    </p>
                </a>
            </div>
        }      
        </Card>
    )
} 

export const VaultExtendedInformationCard = (): JSX.Element => {
    return (
        <Card title='About this Vault'>
        <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda et nihil dolor eum ducimus dignissimos. Ab officia error quisquam odit? Consectetur exercitationem, impedit asperiores veritatis dignissimos officiis debitis facilis repellat?
        </p>
        </Card>
    )
}

export const VaultAssetExposureCard = () => {
    return (
        <Card title='Asset Exposure'>
        <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda et nihil dolor eum ducimus dignissimos. Ab officia error quisquam odit? Consectetur exercitationem, impedit asperiores veritatis dignissimos officiis debitis facilis repellat?
        </p>
        </Card>
    )
}
  