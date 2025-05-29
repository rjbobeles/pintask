import useragent from 'useragent'

export const computeUserAgent = (
  userAgent: string,
): {
  browser: string
  version: string
  os: string
  platform: string
  source: string
} => {
  const parsedUserAgent = useragent.parse(userAgent)

  return {
    browser: parsedUserAgent.family,
    version: parsedUserAgent.toVersion(),
    os: parsedUserAgent.os.family,
    platform: parsedUserAgent.device.family,
    source: userAgent,
  }
}
