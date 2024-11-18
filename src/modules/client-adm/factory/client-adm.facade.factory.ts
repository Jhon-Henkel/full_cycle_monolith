import FindClientUseCase from "../usecase/find-client/find-client.usecase"
import AddClientUseCase from "../usecase/add-client/add-client.usecase"
import ClientAdmFacade from "../facade/client-adm.facade"
import ClientRepository from "../repository/client.repository"

export default class ClientAdmFacadeFactory {
    static create() {
        const repository = new ClientRepository()
        const findUseCase = new FindClientUseCase(repository)
        const addUseCase = new AddClientUseCase(repository)
        return new ClientAdmFacade({ findUseCase, addUseCase })
    }
}