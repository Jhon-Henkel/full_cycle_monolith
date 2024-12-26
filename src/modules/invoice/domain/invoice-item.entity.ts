import Id from "../../@shared/domain/value-object/id.value-object"
import BaseEntity from "../../@shared/domain/entity/base.entity"
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface"

type InvoiceItemProps = {
    id?: Id
    name: string
    price: number
}

export default class InvoiceItem extends BaseEntity implements AggregateRoot {
    private _name: string
    private _price: number

    constructor(props: InvoiceItemProps) {
        super(props.id)
        this._name = props.name
        this._price = props.price
    }

    get name() {
        return this._name
    }

    get price() {
        return this._price
    }
}