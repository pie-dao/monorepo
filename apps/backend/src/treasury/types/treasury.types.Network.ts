export interface SupportedNetwork {
  network: string;
  apps: App[];
}

interface App {
  appId: string;
  meta: Meta;
}

interface Meta {
  label: string;
  img: string;
  tags: string[];
  supportedActions: string[];
}
