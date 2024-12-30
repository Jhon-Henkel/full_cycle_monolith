import {Router} from "express"
import ClientRepository from "../../../modules/client-adm/repository/client.repository"
import AddClientUseCase from "../../../modules/client-adm/usecase/add-client/add-client.usecase"
import {AddClientUseCaseInputDto} from "../../../modules/client-adm/usecase/add-client/add-client.usecase.dto"

export const clientRoute = Router()

clientRoute.post("/", async (req, res) => {
    const clientRepository = new ClientRepository()
    const addClientUseCase = new AddClientUseCase(clientRepository)
    try {
        const input: AddClientUseCaseInputDto = {
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            address: req.body.street,
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode
        }
        const output = await addClientUseCase.execute(input)
        res.status(201).send(output)
    } catch (error) {
        res.status(500).send(error)
    }
})