import {Router} from "express"
import {PlaceOrderInputDTO} from "../../../modules/checkout/usecase/place-order/place-order.dto"
import CheckoutPlaceOrderUseCaseFactory from "../../../modules/checkout/factory/checkout-place-order.usecase.factory"

export const checkoutRoute = Router()

checkoutRoute.post("/", async (req, res) => {
    const placeOrderUseCase = CheckoutPlaceOrderUseCaseFactory.create()
    try {
        const input: PlaceOrderInputDTO = {
            clientId: req.body.clientId,
            products: req.body.products.map((p: { productId: string }) => ({
                productId: p.productId,
            })),
        }
        const output = await placeOrderUseCase.execute(input)
        res.status(201).send(output)
    } catch (error) {
        res.status(500).send(error)
    }
})