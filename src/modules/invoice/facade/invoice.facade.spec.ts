import {Sequelize} from "sequelize-typescript"
import {InvoiceModel} from "../repository/invoice.model"
import {InvoiceItemModel} from "../repository/invoice-item.model"
import {AddressModel} from "../repository/address.model"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"
import Invoice from "../domain/invoice.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../value-object/address.value-object"
import InvoiceItem from "../domain/invoice-item.entity"
import InvoiceRepository from "../repository/invoice.repository"

describe('Invoice repository test', () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: {force: true},
        })

        sequelize.addModels([InvoiceModel, InvoiceItemModel, AddressModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it('should generate a invoice', async () => {
        const facade = InvoiceFacadeFactory.create()

        const input = {
            name: "test name",
            document: "test document",
            street: "test street",
            number: 1234,
            complement: "test complement",
            city: "test city",
            state: "test state",
            zipCode: "test zipCode",
            items: [
                {
                    id: "11",
                    name: "Product 1",
                    price: 100,
                },
                {
                    id: "22",
                    name: "Product 2",
                    price: 200,
                },
            ]
        }

        // @ts-ignore
        const result = await facade.generateInvoice(input)

        expect(result).toEqual({
            id: expect.any(String),
            name: "test name",
            document: "test document",
            street: "test street",
            number: 1234,
            complement: "test complement",
            city: "test city",
            state: "test state",
            zipCode: "test zipCode",
            items: [
                {
                    id: "11",
                    name: "Product 1",
                    price: 100,
                },
                {
                    id: "22",
                    name: "Product 2",
                    price: 200,
                },
            ],
            total: 2
        })
    })

    it('should get a invoice', async () => {
        const invoice = new Invoice({
            id: new Id('1'),
            name: 'Client 1',
            document: 'document 1',
            address: new Address(
                'Street 1',
                '123',
                'Complement 1',
                'City 1',
                'State 1',
                'ZipCode 1'
            ),
            items: [
                new InvoiceItem({
                    name: 'Item 1',
                    price: 100,
                }),
                new InvoiceItem({
                    name: 'Item 2',
                    price: 200,
                })
            ]
        })

        const repository = new InvoiceRepository()
        await repository.save(invoice)

        const facade = InvoiceFacadeFactory.create()
        const result = await facade.findInvoice({id: '1'})

        expect(result).toEqual({
            id: expect.any(String),
            name: "Client 1",
            document: "document 1",
            address: {
                street: "Street 1",
                number: "123",
                complement: "Complement 1",
                city: "City 1",
                state: "State 1",
                zipCode: "ZipCode 1",
            },
            items: [
                {
                    name: "Item 1",
                    price: 100,
                },
                {
                    name: "Item 2",
                    price: 200,
                },
            ],
            total: 2,
            createdAt: expect.any(String),
        })
    })
})