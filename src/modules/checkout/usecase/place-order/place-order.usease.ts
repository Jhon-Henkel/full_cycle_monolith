import UseCaseInterface from "../../../@shared/usecase/use-case.interface"
import {PlaceOrderInputDTO, PlaceOrderOutputDTO} from "./place-order.dto"
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface"
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface"
import Product from "../../domain/product.entity"
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Client from "../../domain/client.entity"
import Order from "../../domain/order.entity"
import CheckoutGateway from "../../gateway/checkout.gateway"
import IInvoiceFacade from "../../../invoice/facade/facade.interface"
import IPaymentFacade from "../../../payment/facade/facade.interface"

export default class PlaceOrderUseCase implements UseCaseInterface {
    private _clientFacade: ClientAdmFacadeInterface
    private _productFacade: ProductAdmFacadeInterface
    private _catalogFacade: StoreCatalogFacadeInterface
    private _repository: CheckoutGateway
    private _invoiceFacade : IInvoiceFacade
    private _paymentFacade: IPaymentFacade

    constructor(
        clientFacade: ClientAdmFacadeInterface,
        productFacade: ProductAdmFacadeInterface,
        catalogFacade: StoreCatalogFacadeInterface,
        repository: CheckoutGateway,
        invoiceFacade: IInvoiceFacade,
        paymentFacade: IPaymentFacade
    ) {
        this._clientFacade = clientFacade
        this._productFacade = productFacade
        this._catalogFacade = catalogFacade
        this._repository = repository
        this._invoiceFacade = invoiceFacade
        this._paymentFacade = paymentFacade
    }

    async execute(input: PlaceOrderInputDTO): Promise<PlaceOrderOutputDTO> {
        const client = await this._clientFacade.find({id: input.clientId})
        if (!client) {
            throw new Error('Client not found')
        }
        await this.validateProducts(input)
        const products: Product[] = await Promise.all(input.products.map(p => this.getProduct(p.productId)))
        const myClient = new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            address: client.street,
            document: client.document,
            street: client.street,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            number: client.number,
            complement: client.complement,
        })
        const order = new Order({
            client: myClient,
            products,
        })

        const payment = await this._paymentFacade.process({
            orderId: order.id.value,
            amount: order.total,
        })

        const invoice = payment.status === 'approved' ? await this._invoiceFacade.generateInvoice({
            name: client.name,
            document: client.document,
            street: client.street,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            number: client.number,
            complement: client.complement,
            items: products.map(p => ({
                id: p.id.value,
                name: p.name,
                price: p.salesPrice,
            }))
        }) : null

        // tslint:disable-next-line:no-unused-expression
        payment.status === 'approved' && order.approve()
        await this._repository.addOrder(order)

        return {
            orderId: order.id.value,
            invoiceId: payment.status === 'approved' ? invoice.id : null,
            status: order.status,
            total: order.total,
            products: order.products.map(p => ({
                productId: p.id.value,
            }))
        }
    }

    private async validateProducts(input: PlaceOrderInputDTO) {
        if (!input.products.length) {
            throw new Error('No Products Selected')
        }

        for (const p of input.products) {
            const product = await this._productFacade.checkStock({productId: p.productId})
            if (product.stock <= 0) {
                throw new Error(`Product ${product.id} is not available in stock`)
            }
        }
    }

    private async getProduct(productId: string): Promise<Product> {
        const product = await this._catalogFacade.find({id: productId})
        if (!product) {
            throw new Error('Product not found')
        }
        return new Product({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        })
    }
}