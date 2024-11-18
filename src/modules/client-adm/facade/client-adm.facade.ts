import ClientAdmFacadeInterface from "./client-adm.facade.interface"
import FindClientUseCase from "../usecase/find-client/find-client.usecase"
import AddClientUseCase from "../usecase/add-client/add-client.usecase"

export interface UseCaseProps {
    findUseCase: FindClientUseCase,
    addUseCase: AddClientUseCase
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
    private _findUseCase: FindClientUseCase
    private _addUseCase: AddClientUseCase

    constructor(useCaseProps: UseCaseProps) {
        this._findUseCase = useCaseProps.findUseCase
        this._addUseCase = useCaseProps.addUseCase
    }

    async add(input: any): Promise<void> {
        await this._addUseCase.execute(input)
    }

    async find(input: any): Promise<any> {
        return await this._findUseCase.execute(input)
    }
}