import InvoiceGateway from "../../gateway/invoice.gateway"
import {FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO} from "./find-invoice.dto"

export default class FindInvoiceUseCase {
    private _invoiceRepository: InvoiceGateway

    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository
    }

    async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {

        const invoice = await this._invoiceRepository.find(input.id)

        return {
            id: invoice.id.value,
            name: invoice.name,
            document: invoice.document,
            address: {
                // @ts-ignore
                street: invoice.address.street,
                // @ts-ignore
                number: invoice.address.number,
                // @ts-ignore
                complement: invoice.address.complement,
                // @ts-ignore
                city: invoice.address.city,
                // @ts-ignore
                state: invoice.address.state,
                // @ts-ignore
                zipCode: invoice.address.zipCode
            },
            // @ts-ignore
            items: invoice.items.map(item => ({
                name: item.name,
                price: item.price,
            })),
            total: invoice.items.length,
            createdAt: invoice.createdAt
        }
    }
}