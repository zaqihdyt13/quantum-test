import { useEffect, useState } from 'react'

export function useLiveClock() {
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const updateClock = () => setCurrentTime(new Date().toLocaleTimeString('id-ID'))
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  return currentTime
}
