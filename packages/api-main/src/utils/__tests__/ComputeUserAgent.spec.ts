import { computeUserAgent } from '../ComputeUserAgent'

describe('computeUserAgent', () => {
  it('should correctly parse Chrome user agent', () => {
    const chromeUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    
    const result = computeUserAgent(chromeUserAgent)
    
    expect(result).toEqual({
      browser: 'Chrome',
      version: '122.0.0.0',
      os: 'Mac OS X',
      platform: 'Mac',
      source: chromeUserAgent
    })
  })

  it('should correctly parse Firefox user agent', () => {
    const firefoxUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0'
    
    const result = computeUserAgent(firefoxUserAgent)
    
    expect(result).toEqual({
      browser: 'Firefox',
      version: '123.0',
      os: 'Windows',
      platform: 'PC',
      source: firefoxUserAgent
    })
  })

  it('should correctly parse Safari user agent', () => {
    const safariUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Safari/605.1.15'
    
    const result = computeUserAgent(safariUserAgent)
    
    expect(result).toEqual({
      browser: 'Safari',
      version: '17.3.1',
      os: 'Mac OS X',
      platform: 'Mac',
      source: safariUserAgent
    })
  })

  it('should correctly parse mobile user agent', () => {
    const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/604.1'
    
    const result = computeUserAgent(mobileUserAgent)
    
    expect(result).toEqual({
      browser: 'Safari',
      version: '17.3.1',
      os: 'iOS',
      platform: 'iPhone',
      source: mobileUserAgent
    })
  })

  it('should handle empty user agent string', () => {
    const emptyUserAgent = ''
    
    const result = computeUserAgent(emptyUserAgent)
    
    expect(result).toEqual({
      browser: 'Other',
      version: '0.0.0',
      os: 'Other',
      platform: 'Other',
      source: emptyUserAgent
    })
  })
}) 