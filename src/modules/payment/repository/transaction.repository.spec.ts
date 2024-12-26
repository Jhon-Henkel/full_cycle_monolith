import {Sequelize} from "sequelize-typescript"
import TransactionModel from "./transaction.model"
import Transaction from "../domain/transaction"
import Id from "../../@shared/domain/value-object/id.value-object"
import TransactionRepository from "./transaction.repository"

describe('Transaction Repository', () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true},
        })

        sequelize.addModels([TransactionModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })


    it('should sava a transaction', async () => {
        const transaction = new Transaction({
            id: new Id('123'),
            amount: 100,
            orderId: '123',
        })
        transaction.approve()

        const repository = new TransactionRepository()
        const result = await repository.save(transaction)

        expect(result.id.value).toBe('123')
        expect(result.amount).toBe(100)
        expect(result.orderId).toBe('123')
    })
})