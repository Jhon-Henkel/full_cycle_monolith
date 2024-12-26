export interface IGenerateInvoiceFacadeInputDTO {
    name: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    items: {
        id: string;
        name: string;
        price: number;
    }[];
}

export interface IFindInvoiceFacadeInputDTO {
    id: string;
}

export interface IFindInvoiceFacadeOutputDTO {
    id: string;
    name: string;
    document: string;
    address: {
        street: string;
        number: string;
        complement: string;
        city: string;
        state: string;
        zipCode: string;
    };
    items: {
        name: string;
        price: number;
    }[];
    total: number;
    createdAt: Date;
}

export default interface IInvoiceFacade {
    generateInvoice(input: IGenerateInvoiceFacadeInputDTO): Promise<void>;
    findInvoice(input: IFindInvoiceFacadeInputDTO): Promise<IFindInvoiceFacadeOutputDTO>;
}