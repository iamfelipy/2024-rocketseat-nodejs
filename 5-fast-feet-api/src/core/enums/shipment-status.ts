export enum ShipmentStatus {
  RECEIVED_FIRST_TIME_AT_CARRIER = 'RECEIVED_FIRST_TIME_AT_CARRIER', // (Recebida pela primeira vez na transportadora)
  AWAITING_PICKUP = 'AWAITING_PICKUP', // (Aguardando/Disponível para retirada)
  PICKED_UP = 'PICKED_UP', // (Retirada)
  DELIVERED = 'DELIVERED', // (Entregue)
  RETURNED = 'RETURNED' // (Devolvida)
}