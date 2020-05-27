
## Sure Reserve
#### Author: Noi Vu Duc
### Tech Stacks
- API
    - Nest.js
- Frontend
    - Nuxt.js
    - Vuetify
- Database
    - MongoDB
- Deployment Server
    - Heroku

### Backend
- [Github Repo](https://github.com/noivuduc/sure-reserve)
- [API URL](https://sure-reserve.herokuapp.com/)

### Frontend
- [Github Repository](https://github.com/noivuduc/sure-reserve-frontend)
- [Frontend URL](https://sure-reserve-frontend.herokuapp.com/)
- [Admin](https://sure-reserve-frontend.herokuapp.com/admin)
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Approach explanation
### Database design

```aidl
Table carparks {
  id objectId
  name varchar
  code varchar
  iamge varchar
  created_at timestamp
}

Table parkinglots {
  id objectId [pk]
  name varchar
  code varchar
  carParkId objectId [ref: > carparks.id]
  created_at timestamp
}

Table reservations {
  id objectId
  parkingLotId objectId [ref: > parkinglots.id]
  start_time varchar
  end_time varchar
  timeSpan array 
  created_at timestamp
}
```
## Application structure
```
.eslintrc.js
.gitignore
.prettierrc
Procfile
README.md
nest-cli.json
package-lock.json
package.json
src
   |-- app.controller.spec.ts
   |-- app.controller.ts
   |-- app.module.ts
   |-- app.service.ts
   |-- car-park
   |   |-- car-park.controller.ts
   |   |-- car-park.module.ts
   |   |-- dto
   |   |   |-- car-park.dto.ts
   |   |-- interfaces
   |   |   |-- car-park.interface.ts
   |   |-- schemas
   |   |   |-- car-park.schema.ts
   |-- config
   |   |-- constants.ts
   |   |-- index.ts
   |-- database
   |   |-- database.module.ts
   |   |-- database.provider.ts
   |   |-- providers
   |   |   |-- car-park.providers.ts
   |   |   |-- index.ts
   |   |   |-- parking-lot.providers.ts
   |   |   |-- reservation.providers.ts
   |   |-- services
   |   |   |-- car-park.service.ts
   |   |   |-- index.ts
   |   |   |-- parking-lot.service.ts
   |   |   |-- reservation.service.ts
   |-- main.ts
   |-- middlewares
   |   |-- logger.middleware.ts
   |-- parking-lot
   |   |-- dto
   |   |   |-- parking-lot.dto.ts
   |   |-- interfaces
   |   |   |-- parking-lot.interface.ts
   |   |-- parking-lot.controller.ts
   |   |-- parking-lot.module.ts
   |   |-- schemas
   |   |   |-- parking-lot.schema.ts
   |-- reservation
   |   |-- dto
   |   |   |-- reservation-check.dto.ts
   |   |   |-- reservation.dto.ts
   |   |-- interfaces
   |   |   |-- reservation.interface.ts
   |   |-- reservation.controller.ts
   |   |-- reservation.module.ts
   |   |-- schemas
   |   |   |-- reservation.schema.ts
   |   |-- services
   |   |   |-- reservation.local.service.ts
   |-- services
   |   |-- services.module.ts
   |   |-- utils.service.ts
test
   |-- app.e2e-spec.ts
   |-- jest-e2e.json
tsconfig.build.json
tsconfig.json
```
## Use case
### Reserve a parking slot

- User send request for reservation
```bash
body {
    "start_time": "2020-05-26 02:00",
    "carParkId": "5ec8e06fde24300d062a7d42"
}
```
- System will check the validity of requested time
```bash
    const startTime = reservationDto.start_time;
    if (moment().isAfter(startTime)) {
    throw new HttpException('Booking time is in past', HttpStatus.NOT_ACCEPTABLE)
```
- If requested time is invalid --> throw error
- Get an available slot of requested car park
- If the car park is available for booking -> process to booking
- If there aren't free slot -> [find best options of requested time](#Find-best-options-of-requested-time)

### Find best options of requested time
- The idea is that, we start from requested time with 2 pointers. First pointer will run backward until found the empty slot or reach current time while the second pointer will run toward until found the empty slot.
- Once we have 2 empty slots, we compare the time distances between 2 empty slots with the requested time and get the closest one.

### Concurrency booking solution
- Sometime we face some situation that many users select same booking time and car park. That will lead to the duplicated booking. In my solution, I added a new field `timeSpan` contains the range of time from `start_time` to `end_time` and create a compound index of `parkingLotId` and `timeSpan`.
- This way will prevent the duplicated records in database, and if multiple booking (same car park, same booking time) coming at the same time, there are only 1 booking success, the rest will be fail to create.
- Example of `timeSpan`:
    - `start_time` = `2020-05-26 02:00`
    - `end_time`   = `2020-05-26 05:00`
    - `timeSpan`   = `["2020-05-26 02:00", "2020-05-26 02:15", "2020-05-26 02:30", "2020-05-26 02:45", "2020-05-26 03:00", "2020-05-26 03:15", "2020-05-26 03:30", "2020-05-26 03:45", "2020-05-26 04:00", "2020-05-26 04:15", "2020-05-26 04:30", "2020-05-26 04:45", "2020-05-26 05:00"]`

