# DeadZone - Database Models

- `User`: `id`, `name`, `email`, `profileImage`, `createdAt`
- `Building`: `id`, `name`, `code`, `description`, `totalFloors`, `overallStatus` ('good' | 'moderate' | 'busy')
- `Floor`: `id`, `buildingId`, `floorNumber`, `status` ('good' | 'moderate' | 'busy')
- `Spot`: `id`, `floorId`, `buildingId`, `buildingName`, `floorNumber`, `name`, `type`, `wifiSpeed` (Mbps), `noiseLevel` (dB), `noiseLabel` ('Quiet' | 'Moderate' | 'Loud'), `availableOutlets`, `totalOutlets`, `availableSeats`, `totalSeats`, `hasAC` (boolean), `tags` (string[])
- `Report`: `id`, `spotId`, `userId`, `noiseLevel`, `crowdLevel`, `wifiRating` (1-5), `createdAt`
- `SavedSpot`: `userId`, `spotId`, `createdAt`
