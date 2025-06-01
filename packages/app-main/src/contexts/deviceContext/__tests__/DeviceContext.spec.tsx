import { render, renderHook } from '@testing-library/react'
import { DeviceContextProvider, useDeviceContext } from '..'

declare global {
  var window: Window & typeof globalThis
  interface Window {
    localStorage: {
      getItem: jest.Mock
      setItem: jest.Mock
    }
  }
}

describe('[Context] Device Context', () => {
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  }
  
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  describe('DeviceContextProvider', () => {
    it('should create a new device ID if none exists in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      render(
        <DeviceContextProvider>
          <div>Test Child</div>
        </DeviceContextProvider>
      )

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('device_id')
      expect(mockLocalStorage.setItem).toHaveBeenCalled()
      expect(mockLocalStorage.setItem.mock.calls[0][0]).toBe('device_id')
      // Check that the stored value is a valid UUID
      expect(mockLocalStorage.setItem.mock.calls[0][1]).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    })

    it('should use existing device ID from localStorage', () => {
      const existingDeviceId = '123e4567-e89b-12d3-a456-426614174000'
      mockLocalStorage.getItem.mockReturnValue(existingDeviceId)

      render(
        <DeviceContextProvider>
          <div>Test Child</div>
        </DeviceContextProvider>
      )

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('device_id')
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
    })
  })

  describe('useDeviceContext', () => {
    it('should throw error when used outside of DeviceContextProvider', () => {
      expect(() => {
        renderHook(() => useDeviceContext())
      }).toThrow('useDevice must be used within a DeviceProvider')
    })

    it('should return device ID when used within DeviceContextProvider', () => {
      const existingDeviceId = '123e4567-e89b-12d3-a456-426614174000'
      mockLocalStorage.getItem.mockReturnValue(existingDeviceId)

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <DeviceContextProvider>{children}</DeviceContextProvider>
      )

      const { result } = renderHook(() => useDeviceContext(), { wrapper })

      expect(result.current.deviceId).toBe(existingDeviceId)
    })
  })
}) 