import IInvoiceFacade, {
    IFindInvoiceFacadeInputDTO,
    IFindInvoiceFacadeOutputDTO,
    IGenerateInvoiceFacadeInputDTO,
} from "./facade.interface"
import UseCaseInterface from "../../@shared/usecase/use-case.interface"

export default class InvoiceFacade implements IInvoiceFacade {
    constructor(
        private generateInvoiceUseCase: UseCaseInterface,
        private findInvoiceUseCase: UseCaseInterface
    ) {}

    generateInvoice(input: IGenerateInvoiceFacadeInputDTO): Promise<void> {
        return this.generateInvoiceUseCase.execute(input)
    }

    findInvoice(input: IFindInvoiceFacadeInputDTO): Promise<IFindInvoiceFacadeOutputDTO> {
        return this.findInvoiceUseCase.execute(input)
    }
}