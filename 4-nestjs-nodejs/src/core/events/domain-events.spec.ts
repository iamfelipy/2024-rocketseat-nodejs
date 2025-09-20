import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

// evento
class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  // precisei desativar o erro pois CustomAggregate precisa ser declado la embaixo
  private aggregate: CustomAggregate //eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

// entidade
class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // Subscriber cadastrado (ouvindo o evento de "resposta criada")
    // vai ser colocado dentro do subdominio de notificação
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // esses 3 vao estar dentro do subdominio do forum
    // Estou criadndo uma resposta porém SEM salvar no banco
    const aggregate = CustomAggregate.create()
    // estou assegurando que o evento foi criado porem não foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)
    // Estou salvando a resposta no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // o subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
