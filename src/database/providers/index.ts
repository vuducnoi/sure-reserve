import { carParkProviders } from './car-park.providers'
import { parkingLotProviders } from './parking-lot.providers'
import { reservationProviders } from './reservation.providers'

export const PROVIDERS = [
    ...carParkProviders,
    ...parkingLotProviders,
    ...reservationProviders
]