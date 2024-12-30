import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory"
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory"
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory"
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory"
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory"
import CheckoutRepository from "../repository/checkout.repository"
import PlaceOrderUseCase from "../usecase/place-order/place-order.usease"

export default class CheckoutPlaceOrderUseCaseFactory {
    static create() {
        return new PlaceOrderUseCase(
            ClientAdmFacadeFactory.create(),
            ProductAdmFacadeFactory.create(),
            StoreCatalogFacadeFactory.create(),
            new CheckoutRepository(),
            InvoiceFacadeFactory.create(),
            PaymentFacadeFactory.create(),
        )
    }
}