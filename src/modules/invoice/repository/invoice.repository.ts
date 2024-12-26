import InvoiceGateway from "../gateway/invoice.gateway"
import Invoice from "../domain/invoice.entity"
import {InvoiceModel} from "./invoice.model"
import {AddressModel} from "./address.model"
import {InvoiceItemModel} from "./invoice-item.model"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../value-object/address.value-object"

export default class InvoiceRepository implements InvoiceGateway {
    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({where: {id}, raw: true})
        if (!invoice) {
            throw new Error('Invoice not found')
        }

        const address = await AddressModel.findOne({where: {invoiceId: invoice.id}, raw: true})
        if (!address) {
            throw new Error('Address not found')
        }

        const invoiceItems = await InvoiceItemModel.findAll({where: {invoiceId: invoice.id}, raw: true})
        if (!invoiceItems) {
            throw new Error('invoiceItems not found')
        }

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            // @ts-ignore
            address,
            // @ts-ignore
            items: invoiceItems,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        })
    }

    async save(invoice: Invoice): Promise<void> {
        const now = new Date()
        await InvoiceModel.create({
            id: invoice.id.value,
            name: invoice.name,
            document: invoice.document,
            createdAt: now,
            updatedAt: now
        })

        let address = {}
        if (invoice.address instanceof Address) {
            address = invoice.address.value
        } else {
            address = new Address(
                // @ts-ignore
                invoice.street,
                // @ts-ignore
                invoice.number,
                // @ts-ignore
                invoice.complement,
                // @ts-ignore
                invoice.city,
                // @ts-ignore
                invoice.state,
                // @ts-ignore
                invoice.zipCode
            )
        }
        await AddressModel.create({
            id: new Id().value,
            invoiceId: invoice.id.value,
            // @ts-ignore
            street: address.street,
            // @ts-ignore
            number: address.number,
            // @ts-ignore
            complement: address.complement,
            // @ts-ignore
            city: address.city,
            // @ts-ignore
            state: address.state,
            // @ts-ignore
            zipCode: address.zipCode
        })

        for (const invoiceItem of invoice.items) {
            await InvoiceItemModel.create({
                id: new Id().value,
                invoiceId: invoice.id.value,
                name: invoiceItem.name,
                price: invoiceItem.price,
            })
        }
    }
}