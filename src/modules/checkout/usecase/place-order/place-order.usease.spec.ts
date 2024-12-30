import PlaceOrderUseCase from "./place-order.usease"
import {PlaceOrderInputDTO} from "./place-order.dto"
import Product from "../../domain/product.entity"
import Id from "../../../@shared/domain/value-object/id.value-object"

const mockDate = new Date(2000, 1, 1)

describe('PlaceOrderUseCase unit test', () => {
    describe('execute method', () => {
        beforeAll(() => {
            jest.useFakeTimers("modern")
            jest.setSystemTime(mockDate)
        })

        afterAll(() => {
            jest.useRealTimers()
        })

        it('should throw error when client not found', async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null)
            }
            // @ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase()
            // @ts-expect-error - force set clientFacade
            placeOrderUseCase._clientFacade = mockClientFacade
            const input: PlaceOrderInputDTO = {
                clientId: "123",
                products: []
            }
            await expect(placeOrderUseCase.execute(input)).rejects.toThrowError('Client not found')
        })

        it('should throw an error when products are not valid', async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true)
            }
            // @ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase()
            // @ts-expect-error - force set clientFacade
            placeOrderUseCase._clientFacade = mockClientFacade

            const mockValidateProducts = jest
                // @ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, 'validateProducts')
                // @ts-expect-error - not return never
                .mockRejectedValue(new Error('No Products Selected'))

            const input: PlaceOrderInputDTO = {
                clientId: "123",
                products: []
            }

            await expect(placeOrderUseCase.execute(input)).rejects.toThrowError('No Products Selected')
            expect(mockValidateProducts).toBeCalledTimes(1)
        })

        describe('place an order', () => {
            const clientProps = {
                id: "1c",
                name: "Client 0",
                document: "0000",
                email: "client@user.com",
                street: "some address",
                city: "some city",
                state: "some state",
                zip: "000"
            }

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(clientProps)
            }

            const mockPaymentFacade = {
                process: jest.fn()
            }

            const mockCheckoutRepository = {
                addOrder: jest.fn()
            }

            const mockInvoiceFacade = {
                generateInvoice: jest.fn().mockResolvedValue({id: '1i'})
            }

            const placeOrderUseCase = new PlaceOrderUseCase(
                mockClientFacade as any,
                null,
                null,
                mockCheckoutRepository as any,
                mockInvoiceFacade as any,
                mockPaymentFacade as any
            )

            const products = {
                "1": new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "some description",
                    price: 40
                }),
                "2": new Product({
                    id: new Id("2"),
                    name: "Product 2",
                    description: "some description",
                    price: 30
                })
            }

            const mockValidateProducts = jest
                // @ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, 'validateProducts')
                // @ts-expect-error - spy on private method
                .mockResolvedValue(null)

            const mockGetProduct = jest
                // @ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, 'getProduct')
                // @ts-expect-error - not return never
                .mockImplementation((productId: keyof typeof products) => {
                    return products[productId]
                })

            it('should not be approved', async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "error",
                    createdAt: new Date(),
                    updatedAt: new Date()
                })

                const input: PlaceOrderInputDTO = {
                    clientId: "1c",
                    products: [{productId: "1"}, {productId: "2"}]
                }

                const output = await placeOrderUseCase.execute(input)

                expect(output.invoiceId).toBeNull()
                expect(output.total).toBe(70)
                expect(output.products).toStrictEqual([{productId: "1"}, {productId: "2"}])
                expect(mockClientFacade.find).toBeCalledTimes(1)
                expect(mockClientFacade.find).toBeCalledWith({id: "1c"})
                expect(mockValidateProducts).toBeCalledTimes(1)
                expect(mockValidateProducts).toBeCalledWith(input)
                expect(mockGetProduct).toBeCalledTimes(2)
                expect(mockCheckoutRepository.addOrder).toBeCalledTimes(1)
                expect(mockPaymentFacade.process).toBeCalledTimes(1)
                expect(mockPaymentFacade.process).toBeCalledWith({
                    orderId: output.orderId,
                    amount: output.total
                })
                expect(mockInvoiceFacade.generateInvoice).toBeCalledTimes(0)
            })

            it('should be approved', async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "approved",
                    createdAt: new Date(),
                    updatedAt: new Date()
                })

                const input: PlaceOrderInputDTO = {
                    clientId: "1c",
                    products: [{productId: "1"}, {productId: "2"}]
                }

                const output = await placeOrderUseCase.execute(input)

                expect(output.invoiceId).toBe("1i")
                expect(output.total).toBe(70)
                expect(output.products).toStrictEqual([{productId: "1"}, {productId: "2"}])
                expect(mockClientFacade.find).toBeCalledTimes(1)
                expect(mockClientFacade.find).toBeCalledWith({id: "1c"})
                expect(mockValidateProducts).toBeCalledTimes(1)
                expect(mockGetProduct).toBeCalledTimes(2)
                expect(mockCheckoutRepository.addOrder).toBeCalledTimes(1)
                expect(mockPaymentFacade.process).toBeCalledTimes(1)
                expect(mockPaymentFacade.process).toBeCalledWith({
                    orderId: output.orderId,
                    amount: output.total
                })
                expect(mockInvoiceFacade.generateInvoice).toBeCalledTimes(1)
            })
        })
    })

    describe('validateProducts method', () => {
        // @ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase()

        it('should throw error if no products are selected', async () => {
            const input: PlaceOrderInputDTO = {
                clientId: "123",
                products: []
            }

            // @ts-ignore
            await expect(placeOrderUseCase.validateProducts(input)).rejects.toThrowError('No Products Selected')
        })

        it('should throw an error when product is out of stock', async () => {
            const mockProductFacade = {
                checkStock: jest.fn(({productId}: { productId: string }) => {
                    return Promise.resolve({id: productId, stock: productId === '1' ? 0 : 1})
                })
            }

            // @ts-expect-error - force set productFacade
            placeOrderUseCase._productFacade = mockProductFacade

            let input: PlaceOrderInputDTO = {
                clientId: "123",
                products: [{productId: '1'}]
            }

            // @ts-ignore
            await expect(placeOrderUseCase.validateProducts(input)).rejects.toThrowError('Product 1 is not available in stock')

            input = {
                clientId: "123",
                products: [{productId: '0'}, {productId: '1'}]
            }

            // @ts-ignore
            await expect(placeOrderUseCase.validateProducts(input)).rejects.toThrowError('Product 1 is not available in stock')
            expect(mockProductFacade.checkStock).toBeCalledTimes(3)

            input = {
                clientId: "123",
                products: [{productId: '0'}, {productId: '1'}, {productId: '2'}]
            }

            // @ts-ignore
            await expect(placeOrderUseCase.validateProducts(input)).rejects.toThrowError('Product 1 is not available in stock')
            expect(mockProductFacade.checkStock).toBeCalledTimes(5)
        })
    })

    describe("getProducts method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern")
            jest.setSystemTime(mockDate)
        })

        afterAll(() => {
            jest.useRealTimers()
        })

        // @ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase()

        it("should throw an error when product not found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null)
            }

            // @ts-expect-error - force set catalogFacade
            placeOrderUseCase._catalogFacade = mockCatalogFacade

            // @ts-ignore
            await expect(placeOrderUseCase.getProduct("0")).rejects.toThrowError("Product not found")
            expect(mockCatalogFacade.find).toBeCalledTimes(1)
        })

        it('should return a product', async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: '0',
                    name: 'Product 0',
                    description: 'Description 0 description',
                    price: 0
                })
            }

            // @ts-expect-error - force set catalogFacade
            placeOrderUseCase._catalogFacade = mockCatalogFacade

            // @ts-ignore
            await expect(placeOrderUseCase.getProduct("0")).resolves.toEqual(new Product({
                id: new Id('0'),
                name: 'Product 0',
                description: 'Description 0 description',
                price: 0
            }))
            expect(mockCatalogFacade.find).toBeCalledTimes(1)
        })
    })
})