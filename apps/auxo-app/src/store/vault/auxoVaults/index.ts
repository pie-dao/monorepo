import { Vault } from '../Vault';
import { FTM } from './FTM';
import { Polygon } from './POLYGON';

export const vaults: Vault[] = [...FTM, ...Polygon];
