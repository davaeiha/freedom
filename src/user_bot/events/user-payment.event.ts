export class UserPaymentEvent {
  constructor(
    public user_id: number,
    public admin_id: number,
    public amount: number = 0,
    public payment_id: number,
    public type: 'APPROVE' | 'REJECT',
  ) {}
}
