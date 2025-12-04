import { describe, it, expect } from 'vitest'
import { replaceCssText, replaceJsText } from './index'

describe('replaceCssText', () => {
    it('should replace css url with base64', () => {
        const input = 'background-image: url(https://example.com/assets/shadow-grey.png);'
        const color = 'shadow-grey.png'
        const replaceColor = 'data:image/png;base64,test'

        const result = replaceCssText(input, color, replaceColor)
        expect(result).toBe('background-image: url(data:image/png;base64,test);')
    })

    it('should not replace if color does not match', () => {
        const input = 'background-image: url(https://example.com/assets/other.png);'
        const color = 'shadow-grey.png'
        const replaceColor = 'data:image/png;base64,test'

        const result = replaceCssText(input, color, replaceColor)
        expect(result).toBe(input)
    })
})

describe('replaceJsText', () => {
    it('should replace js src with base64', () => {
        const input = 'src:"https://"+e+"/static/img/shadow-grey.png"'
        const color = 'shadow-grey.png'
        const replaceColor = 'data:image/png;base64,test'

        const result = replaceJsText(input, color, replaceColor)
        expect(result).toBe('src:"data:image/png;base64,test"')
    })

    it('should handle variable names and whitespace', () => {
        const input = 'src : "https://" + someVar + "/path/to/shadow-grey.png"'
        const color = 'shadow-grey.png'
        const replaceColor = 'data:image/png;base64,test'

        const result = replaceJsText(input, color, replaceColor)
        expect(result).toBe('src:"data:image/png;base64,test"')
    })

    it('should not replace if pattern does not match', () => {
        const input = 'src="https://example.com/shadow-grey.png"'
        const color = 'shadow-grey.png'
        const replaceColor = 'data:image/png;base64,test'

        const result = replaceJsText(input, color, replaceColor)
        expect(result).toBe(input)
    })
})
