export enum ShipmentStatus {
  RECEIVED_FIRST_TIME_AT_CARRIER = 'received_first_time_at_carrier', // (Recebida pela primeira vez na transportadora)
  AWAITING_PICKUP = 'awaiting_pickup', // (Aguardando/Disponível para retirada)
  PICKED_UP = 'picked_up', // (Retirada)
  DELIVERED = 'delivered', // (Entregue)
  RETURNED = 'returned' // (Devolvida)
}