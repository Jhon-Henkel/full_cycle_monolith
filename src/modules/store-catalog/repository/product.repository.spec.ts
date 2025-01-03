import {Sequelize} from "sequelize-typescript"
import ProductModel from "./product.model"
import ProductRepository from "./product.repository"

describe('product repository unit test', () => {
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

    it("Should find all products", async () => {
        await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            price: 100
        })

        await ProductModel.create({
            id: "2",
            name: "Product 2",
            description: "Product 2 description",
            price: 200
        })

        const repository = new ProductRepository();
        const products = await repository.findAll();

        expect(products).toHaveLength(2);
        expect(products[0].id.value).toBe("1");
        expect(products[0].name).toBe("Product 1");
        expect(products[0].description).toBe("Product 1 description");
        expect(products[0].price).toBe(100);
        expect(products[1].id.value).toBe("2");
        expect(products[1].name).toBe("Product 2");
        expect(products[1].description).toBe("Product 2 description");
        expect(products[1].price).toBe(200);
    })

    it('should find a product', async () => {
        await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            price: 100
        })

        const repository = new ProductRepository();
        const product = await repository.find("1");

        expect(product.id.value).toBe("1");
        expect(product.name).toBe("Product 1");
        expect(product.description).toBe("Product 1 description");
        expect(product.price).toBe(100);
    })
})