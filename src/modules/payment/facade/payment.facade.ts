import IPaymentFacade, { IPaymentFacadeInputDto, IPaymentFacadeOutputDto } from "./facade.interface"
import UseCaseInterface from "../../@shared/usecase/use-case.interface"

export default class PaymentFacade implements IPaymentFacade {
    constructor(private processPaymentUseCase: UseCaseInterface) {}

    process(input: IPaymentFacadeInputDto): Promise<IPaymentFacadeOutputDto> {
        return this.processPaymentUseCase.execute(input)
    }
}