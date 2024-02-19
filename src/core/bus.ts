import { useEventBus } from '@vueuse/core'

export const bettingBus = useEventBus<number>('betting')
