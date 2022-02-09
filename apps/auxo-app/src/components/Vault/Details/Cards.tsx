import { Vault } from "../../../store/vault/Vault"
import { chainMap } from "../../../utils/networks"

const Card = ({ children }: { children?: React.ReactNode }): JSX.Element => (
    <div className="
      p-5 rounded-lg shadow-md bg-white text-left">
      { children }
    </div>
)

export const VaultInfoCard = ({ vault }: { vault: Vault | undefined }) => {
    const chainId = vault?.network.chainId;
    const url = chainId && `${chainMap[chainId].blockExplorer}/address/${vault?.address}`;
    return (
        <Card>
        <h2 className="
            font-extrabold text-lg">Vault Info</h2>
        { 
            url && <a
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-ellipsis truncate overflow-hidden"
                >
                <p className="truncate overflow-hidden">
                    <span className="text-purple-700 underline mr-1 truncate overflow-hidden">{vault?.address}</span>
                    &#8594;
                </p>
            </a>
        }      
        </Card>
    )
} 

export const VaultExtendedInformationCard = (): JSX.Element => {
    return (
        <Card>
        <h2 className="
            font-extrabold text-lg">About this Vault</h2>
        <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda et nihil dolor eum ducimus dignissimos. Ab officia error quisquam odit? Consectetur exercitationem, impedit asperiores veritatis dignissimos officiis debitis facilis repellat?
        </p>
        </Card>
    )
}

export const VaultAssetExposureCard = () => {
    return (
        <Card>
        <h2 className="font-extrabold text-lg">Asset Exposure</h2>
        <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda et nihil dolor eum ducimus dignissimos. Ab officia error quisquam odit? Consectetur exercitationem, impedit asperiores veritatis dignissimos officiis debitis facilis repellat?
        </p>
        </Card>
    )
}
  