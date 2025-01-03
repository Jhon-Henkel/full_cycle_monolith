import {Sequelize} from "sequelize-typescript"
import ProductModel from "../repository/product.model"
import StoreCatalogFacadeFactory from "../factory/facade.factory"

describe('StoreCatalogFacade test', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true},
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    })

    afterEach(async () => {
        await sequelize.close();
    })

    it('should find a product', async () => {
        await ProductModel.create({
            id: '1',
            name: 'Product 1',
            description: 'Product 1 description',
            price: 10,
        })

        const facade = StoreCatalogFacadeFactory.create();
        const product = await facade.find({id: '1'});

        expect(product.id).toBe('1');
        expect(product.name).toBe('Product 1');
        expect(product.description).toBe('Product 1 description');
        expect(product.price).toBe(10);
    })

    it('should find all products', async () => {
        await ProductModel.create({
            id: '1',
            name: 'Product 1',
            description: 'Product 1 description',
            price: 10,
        })

        await ProductModel.create({
            id: '2',
            name: 'Product 2',
            description: 'Product 2 description',
            price: 20,
        })

        const facade = StoreCatalogFacadeFactory.create();
        const products = await facade.findAll();

        expect(products.products.length).toBe(2);
        expect(products.products[0].id).toBe('1');
        expect(products.products[0].name).toBe('Product 1');
        expect(products.products[0].description).toBe('Product 1 description');
        expect(products.products[0].price).toBe(10);
        expect(products.products[1].id).toBe('2');
        expect(products.products[1].name).toBe('Product 2');
        expect(products.products[1].description).toBe('Product 2 description');
        expect(products.products[1].price).toBe(20);
    })
})