import InvoiceRepository from "../repository/invoice.repository"
import IInvoiceFacade from "../facade/facade.interface"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase"
import InvoiceFacade from "../facade/invoice.facade"
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase"

export default class InvoiceFacadeFactory {
    static create(): IInvoiceFacade {
        const repository = new InvoiceRepository()
        return new InvoiceFacade(new GenerateInvoiceUseCase(repository), new FindInvoiceUseCase(repository))
    }
}