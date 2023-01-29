export enum Roles_Enum {
  SUPER_ADMIN = 1,
  VENDOR = 2,
  RIDER = 3,
  CONSUMER = 4,
}
export enum Gender_Enum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
export enum Order_Status_Enum {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  CANCELLED = 'cancelled',
  PICKED_FROM_CONSUMER = 'picked_from_consumer',
  DELIVERED_TO_VENDOR = 'delivered_to_vendor',
  PICKED_FROM_VENDOR = 'picked_from_vendor',
  DELIVERED_TO_CONSUMER = 'delivered_to_consumer',
  IN_PROCESS = 'in_process',
}
export enum Cart_Status_Enum {
  COMPLETED = 'completed',
  DISCARDED = 'discarded',
  OPEN = 'open',
}
