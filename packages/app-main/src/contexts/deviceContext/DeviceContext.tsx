import { createContext, useEffect, useState } from 'react'
import { v4 } from 'uuid'

export interface IDeviceContext {
  deviceId: string
}

export const DeviceContext = createContext<IDeviceContext | undefined>(undefined)

export const DeviceContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [deviceId, setDeviceId] = useState<string>('')

  useEffect(() => {
    const storedDeviceId = localStorage.getItem('device_id')

    if (storedDeviceId) setDeviceId(storedDeviceId)
    else {
      const newDeviceId = v4()
      localStorage.setItem('device_id', newDeviceId)
      setDeviceId(newDeviceId)
    }
  }, [])

  return <DeviceContext.Provider value={{ deviceId }}>{children}</DeviceContext.Provider>
}
