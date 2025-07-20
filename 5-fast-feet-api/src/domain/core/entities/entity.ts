import { UniqueEntityID } from "./unique-entity-id"

export class Entity<Props> {
  protected props: Props
  private _id: UniqueEntityID
  
  constructor(props: Props, id?: string) {
    this.props = props
    this._id = new UniqueEntityID(id)
  }

  get id() {
    return this._id
  }
}