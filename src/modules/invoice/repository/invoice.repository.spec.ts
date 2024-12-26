import {Sequelize} from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object"
import {InvoiceModel} from "./invoice.model"
import {InvoiceItemModel} from "./invoice-item.model"
import {AddressModel} from "./address.model"
import Invoice from "../domain/invoice.entity"
import InvoiceRepository from "./invoice.repository"
import Address from "../value-object/address.value-object"
import InvoiceItem from "../domain/invoice-item.entity"

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

    it('should add a invoice', async () => {
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

        const result = await InvoiceModel.findOne({where: {id: '1'}, raw: true})

        expect(result).not.toBeNull()
        expect(result.id).toBe(invoice.id.value)
        expect(result.name).toBe(invoice.name)
        expect(result.document).toBe(invoice.document)

        const address = await AddressModel.findOne({where: {invoiceId: '1'}, raw: true})
        expect(address).not.toBeNull()
        // @ts-ignore
        expect(address.city).toBe(invoice.address.city)
        // @ts-ignore
        expect(address.state).toBe(invoice.address.state)
        // @ts-ignore
        expect(address.street).toBe(invoice.address.street)
        // @ts-ignore
        expect(address.zipCode).toBe(invoice.address.zipCode)

        const items = await InvoiceItemModel.findAll({where: {invoiceId: '1'}, raw: true})
        expect(items).toHaveLength(2)
        expect(items[0].name).toBe(invoice.items[0].name)
        expect(items[0].price).toBe(invoice.items[0].price)
        expect(items[1].name).toBe(invoice.items[1].name)
        expect(items[1].price).toBe(invoice.items[1].price)
    })

    it('should find a invoice', async () => {
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

        const result = await repository.find('1')

        expect(result).not.toBeNull()
        expect(result.id.value).toBe(invoice.id.value)
        expect(result.name).toBe(invoice.name)
        expect(result.document).toBe(invoice.document)
        // @ts-ignore
        expect(result.address.city).toBe(invoice.address.city)
        // @ts-ignore
        expect(result.address.state).toBe(invoice.address.state)
        // @ts-ignore
        expect(result.address.street).toBe(invoice.address.street)
        // @ts-ignore
        expect(result.address.zipCode).toBe(invoice.address.zipCode)
        expect(result.items).toHaveLength(2)
        expect(result.items[0].name).toBe(invoice.items[0].name)
        expect(result.items[0].price).toBe(invoice.items[0].price)
        expect(result.items[1].name).toBe(invoice.items[1].name)
        expect(result.items[1].price).toBe(invoice.items[1].price)
    })
})