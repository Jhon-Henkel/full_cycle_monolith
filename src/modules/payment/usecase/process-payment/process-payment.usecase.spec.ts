import Transaction from "../../domain/transaction"
import Id from "../../../@shared/domain/value-object/id.value-object"
import ProcessPaymentUseCase from "./process-payment.usecase"

const transaction = new Transaction({
    id: new Id('123'),
    amount: 99,
    orderId: '123'
})

const mockRepository = () => {
    return {
        save: jest.fn().mockResolvedValue(Promise.resolve(transaction))
    }
}

describe('Process Payment Use Case', () => {
    it('Should process payment', async () => {
        const paymentRepository = mockRepository()
        const useCase = new ProcessPaymentUseCase(paymentRepository)
        const result = await useCase.execute({
            amount: 100,
            orderId: '123'
        })

        expect(result.transactionId).toBe('123')
        expect(paymentRepository.save).toHaveBeenCalled()
        expect(result.status).toBe('approved')
        expect(result.amount).toBe(100)
        expect(result.orderId).toBe('123')
    })
})
