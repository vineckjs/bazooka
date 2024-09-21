import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel('Store')
    private readonly storeModel,
  ) {}

  roundCoordinates(
    lat: number,
    lng: number,
  ): { roundedLat: number; roundedLng: number } {
    const precision = 3; // Arredonda para 3 casas decimais (~1 km² de precisão)
    const roundedLat = parseFloat(lat.toFixed(precision));
    const roundedLng = parseFloat(lng.toFixed(precision));
    return { roundedLat, roundedLng };
  }

  async getStoresInRadius(
    { lat, lng }: { lat: number; lng: number },
    radiusKm: number = 10,
  ) {
    const radiusMeters = radiusKm * 1000;

    const nearbyStores = this.storeModel
      .find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            $maxDistance: radiusMeters,
          },
        },
      })
      .lean();

    return nearbyStores;
  }
}
