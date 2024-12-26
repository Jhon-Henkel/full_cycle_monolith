import InvoiceGateway from "../../gateway/invoice.gateway"
import {GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto} from "./generate-invoice.dto"
import Id from "../../../@shared/domain/value-object/id.value-object"

export default class GenerateInvoiceUseCase {
    private _invoiceRepository: InvoiceGateway

    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository
    }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        const props  = {
            id: new Id(),
            name : input.name,
            document: input.document,
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,
            items: input.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
            })),
        }

        // @ts-ignore
        await this._invoiceRepository.save(props)

        return {
            id: props.id.value,
            name: props.name,
            document: props.document,
            street: props.street,
            number: props.number,
            complement: props.complement,
            city: props.city,
            state: props.state,
            zipCode: props.zipCode,
            items: props.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
            })),
            total: props.items.length
        }
    }
}