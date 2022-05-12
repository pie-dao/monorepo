import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import './tailwind-imports.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'centered',
};

export default function getLibrary(provider) {
  /**
   * Pass in the root of the application to make the Web3-react
   * hook available to the application
   */
  const library = new Web3Provider(
    provider,
    typeof provider.chainId === 'number'
      ? provider.chainId
      : typeof provider.chainId === 'string'
      ? parseInt(provider.chainId)
      : 'any',
  );
  return library;
}

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'auxo',
    toolbar: {
      icon: 'circlehollow',
      items: ['landing', 'auxo'],
      showName: true,
    },
  },
};

export const decorators = [
  (Story, context) => (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div data-theme={context.globals.theme} id="storybook-portal">
        <Story />
      </div>
    </Web3ReactProvider>
  ),
];
