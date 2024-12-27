import IInvoiceFacade, {
    IFindInvoiceFacadeInputDTO,
    IFindInvoiceFacadeOutputDTO,
    IGenerateInvoiceFacadeInputDTO,
} from "./facade.interface"
import UseCaseInterface from "../../@shared/usecase/use-case.interface"
import {GenerateInvoiceUseCaseOutputDto} from "../usecase/generate-invoice/generate-invoice.dto"

export default class InvoiceFacade implements IInvoiceFacade {
    constructor(
        private generateInvoiceUseCase: UseCaseInterface,
        private findInvoiceUseCase: UseCaseInterface
    ) {}

    generateInvoice(input: IGenerateInvoiceFacadeInputDTO): Promise<GenerateInvoiceUseCaseOutputDto> {
        return this.generateInvoiceUseCase.execute(input)
    }

    findInvoice(input: IFindInvoiceFacadeInputDTO): Promise<IFindInvoiceFacadeOutputDTO> {
        return this.findInvoiceUseCase.execute(input)
    }
}