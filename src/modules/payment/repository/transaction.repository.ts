import PaymentGateway from "../gateway/payment.gateway"
import Transaction from "../domain/transaction"
import TransactionModel from "./transaction.model"
import Id from "../../@shared/domain/value-object/id.value-object"

export default class TransactionRepository implements PaymentGateway {
    async save(input: Transaction): Promise<Transaction> {
        await TransactionModel.create({
            id: input.id.value,
            amount: input.amount,
            orderId: input.orderId,
            status: input.status,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt
        })

        return new Transaction({
            id: new Id(input.id.value),
            amount: input.amount,
            orderId: input.orderId,
            status: input.status,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt
        })
    }
}