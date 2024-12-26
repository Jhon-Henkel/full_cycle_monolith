import {Column, Model, PrimaryKey, Table} from "sequelize-typescript"

@Table({
    tableName: 'address',
    timestamps: false,
})
export class AddressModel extends Model {
    @PrimaryKey
    @Column({allowNull: false})
    id: string;

    @Column({allowNull: false, field: 'invoice_id'})
    invoiceId: string;

    @Column({allowNull: false})
    street: string;

    @Column({allowNull: false})
    number: string;

    @Column({allowNull: false})
    complement: string;

    @Column({allowNull: false})
    city: string;

    @Column({allowNull: false})
    state: string;

    @Column({allowNull: false, field: 'zip_code'})
    zipCode: string;
}