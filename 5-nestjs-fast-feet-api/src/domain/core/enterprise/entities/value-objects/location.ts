import { ValueObject } from "@/core/entities/value-object"

export interface LocationProps {
  address: string
  latitude: number
  longitude: number
}

export class Location extends ValueObject<LocationProps> {

  get address() {
    return this.props.address
  }

  get latitude() {
    return this.props.latitude
  }

  get longitude() {
    return this.props.longitude
  }

  static create(props: LocationProps) {
    return new Location(props)
  }
}
