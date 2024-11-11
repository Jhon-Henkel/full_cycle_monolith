export interface StoreCatalogFacadeInterfaceInputDTO {
    id: string
}

export interface StoreCatalogFacadeInterfaceOutputDTO {
    id: string
    name: string
    description: string
    salesPrice: number
}

export interface FindAllStoreCatalogFacadeInterfaceOutputDTO {
    products: {
        id: string
        name: string
        description: string
        salesPrice: number
    }[]
}

export default interface StoreCatalogFacadeInterface {
    find(id: StoreCatalogFacadeInterfaceInputDTO): Promise<StoreCatalogFacadeInterfaceOutputDTO>,

    findAll(): Promise<FindAllStoreCatalogFacadeInterfaceOutputDTO>,
}
