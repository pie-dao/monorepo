import { useProxySelector } from "../store";

export const useVaultAddresses = () => {
  const addresses = useProxySelector((state) =>
    state.vault.vaults.map((v) => v.address)
  );
  return addresses;
};

export const useTokenAddresses = () => {
  return useProxySelector((state) =>
    state.vault.vaults.map((v) => v.token.address).filter((v) => !!v)
  ) as string[];
};

export const useMerkleAuthAddresses = () => {
  return useProxySelector((state) =>
    state.vault.vaults.map((v) => v.auth.address).filter((v) => !!v)
  ) as string[];
};

export const useVaultCapAddresses = () => {
  return useProxySelector((state) =>
    state.vault.vaults.map((v) => v.cap.address).filter((v) => !!v)
  ) as string[];
};