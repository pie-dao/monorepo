import { logoSwitcher } from "../logos";
import { render, screen } from '@testing-library/react'

describe('Testing the logo switcher', () => {
    
    const checkLogoSwitcher = (input: string) => {
        const { container } = render(logoSwitcher(input));
        const svgEl = container.querySelector('.logo')
        expect(svgEl).toBeVisible()
        return svgEl
    }
    
    it('Switches as expected', () => {
        [
            ['MATIC', 'matic-logo'],
            ['ETH', 'ethereum-logo'],
            ['FTM', 'ftm-logo'],
            ['FRAX', 'frax-logo'],
            ['Polygon', 'matic-logo'],
            ['auxo', 'auxo-logo'],
            ['mim', 'mim-logo'],
        ].forEach(([currency, id]) => {
            const svgEl = checkLogoSwitcher(currency);
            expect(svgEl?.id).toEqual(id)
        }) 
    });
    
    it('Defaults to Auxo', () => {
        render(logoSwitcher(undefined));
        const component = screen.getByRole('img', { name: 'auxo-logo' });
        expect(component).toBeVisible()
    });
})