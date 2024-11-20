import UseCaseInterface from "../../../@shared/usecase/use-case.interface"
import {ProcessPaymentInputDto, ProcessPaymentOutputDto} from "./process-payment.dto"
import PaymentGateway from "../../gateway/payment.gateway"
import Transaction from "../../domain/transaction"

export default class ProcessPaymentUseCase implements UseCaseInterface {
    constructor(
        private transactionRepository: PaymentGateway
    ) {}

    async execute(input: ProcessPaymentInputDto): Promise<ProcessPaymentOutputDto> {
        const transaction = new Transaction({
            amount: input.amount,
            orderId: input.orderId
        })

        transaction.process()

        return await this.transactionRepository.save(transaction).then((transactionPersisted) => {
            return {
                transactionId: transactionPersisted.id.value,
                status: transaction.status,
                amount: transaction.amount,
                orderId: transactionPersisted.orderId,
                createdAt: transactionPersisted.createdAt,
                updatedAt: transactionPersisted.updatedAt
            }
        })
    }
}