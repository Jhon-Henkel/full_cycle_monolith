import ProductAdmFacadeInterface, {
    AddProductFacadeInputDTO,
    CheckStockFacadeInputDTO, CheckStockFacadeOutputDTO
} from "./product-adm.facade.interface"
import UseCaseInterface from "../../@shared/usecase/use-case.interface"

export interface UseCasesProps {
    addUseCase: UseCaseInterface;
    checkStockUseCase: any;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
    private _addUseCade: UseCaseInterface;
    private _checkStockUseCade: UseCaseInterface;

    constructor(useCasesProps: UseCasesProps) {
        this._addUseCade = useCasesProps.addUseCase;
        this._checkStockUseCade = useCasesProps.checkStockUseCase;
    }

    async addProduct(product: AddProductFacadeInputDTO): Promise<void> {
        return this._addUseCade.execute(product);
    }

    async checkStock(id: CheckStockFacadeInputDTO): Promise<CheckStockFacadeOutputDTO> {
        return this._checkStockUseCade.execute(id);
    }
}