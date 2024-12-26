import ValueObject from "../../@shared/domain/value-object/value-object.interface"

export default class Address implements ValueObject {
    private street: string
    private number: string
    private complement: string
    private city: string
    private state: string
    private zipCode: string

    constructor(street: string, number: string, complement: string, city: string, state: string, zipCode: string) {
        this.street = street
        this.number = number
        this.complement = complement
        this.city = city
        this.state = state
        this.zipCode = zipCode
    }

    get value(): object {
        return {
            street: this.street,
            number: this.number,
            complement: this.complement,
            city: this.city,
            state: this.state,
            zipCode: this.zipCode
        }
    }
}