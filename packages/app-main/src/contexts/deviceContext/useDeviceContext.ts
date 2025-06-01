import { useContext } from 'react'

import { DeviceContext, IDeviceContext } from '.'

export const useDeviceContext = (): IDeviceContext => {
  const context = useContext(DeviceContext)

  if (context === undefined) throw new Error('useDevice must be used within a DeviceProvider')
  return context
}
