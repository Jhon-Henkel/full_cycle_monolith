import {Sequelize} from "sequelize-typescript"
import {ProductModel} from "../repository/product.model"
import ProductAdmFacadeFactory from "../factory/facade.factory"

describe('ProductAdmFacade test', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a product', async () => {
        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: "1",
            name: "Product 1",
            description: "Description 1",
            stock: 10,
            purchasePrice: 100
        }

        await productFacade.addProduct(input);

        const product = await ProductModel.findOne({
            where: {id: input.id},
            raw: true,
        });

        delete product.createdAt
        delete product.updatedAt
        expect(product).toEqual(input);
    })

    it('should check a product stock', async () => {
        const productFacade = ProductAdmFacadeFactory.create();

        const input = {
            id: "1",
            name: "Product 1",
            description: "Description 1",
            stock: 10,
            purchasePrice: 100
        }

        await productFacade.addProduct(input);

        const result = await productFacade.checkStock({productId: "1"});

        expect(result.id).toBe(input.id);
        expect(result.stock).toBe(input.stock);
    })
})