import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    QueryRunner,
    Table,
    TableForeignKey,
} from "typeorm";
import { appDataSource } from "../loaders";
import UserEntityRelation from "../models/UserEntityRelation";
import { UserTypes } from "../types";

@EventSubscriber()
export class UserEntityRelationSubscriber
    implements EntitySubscriberInterface<UserEntityRelation>
{
    private subsribers = appDataSource.subscribers;

    private entity: UserEntityRelation;

    private manager = appDataSource.manager;

    constructor() {
        this.subsribers.push(this);
    }

    listenTo() {
        return UserEntityRelation;
    }

    private async getChildType() {
        const user: [{ id: number; user_type: UserTypes }] =
            await this.manager.query(
                `SELECT id, user_type FROM user_tbl where id = ${this.entity.user.id}`
            );
        if (!user) throw new Error("no such as user");
        return user[0].user_type === UserTypes.VENDOR ||
            user[0].user_type === UserTypes.VENDOR_ADMIN
            ? 1
            : user[0].user_type === UserTypes.BUYER ||
              user[0].user_type === UserTypes.BUYER_ADMIN
            ? 3
            : user[0].user_type === UserTypes.DEALER ||
              user[0].user_type === UserTypes.DEALER_ADMIN
            ? 2
            : 0;
    }

    private async dropRelation(queryRunner: QueryRunner) {
        const table = await this.getTable(queryRunner);
        const refTableForeignKey = table.foreignKeys.filter(
            (key) => key.columnNames[0] === "ref_table_id"
        )[0];

        return queryRunner.dropForeignKey(table, refTableForeignKey);
    }

    private async getTable(queryRunner: QueryRunner) {
        const table = (await queryRunner.getTable(
            "user_entity_relation"
        )) as Table;

        return table;
    }

    private async createRelation(
        queryRunner: QueryRunner,
        referedTable: string
    ) {
        const foreignKey = new TableForeignKey({
            columnNames: ["ref_table_id"],
            referencedColumnNames: ["id"],
            referencedTableName: referedTable,
            onDelete: "CASCADE",
        });
        const table = await this.getTable(queryRunner);

        return queryRunner.createForeignKey(table, foreignKey);
    }

    async beforeInsert(event: InsertEvent<UserEntityRelation>) {
        const { entity, metadata, queryRunner } = event;
        // entity our table ;
        this.entity = entity;

        metadata.relations.filter((relation) => {
            return relation.isManyToOne || relation.isOneToMany;
        });

        const childtype = await this.getChildType();

        if (childtype === 1) {
            // vendor
            await this.dropRelation(queryRunner);
            await this.createRelation(queryRunner, "vendor");
        } else if (childtype === 2) {
            // deadler
            await this.dropRelation(queryRunner);
            await this.createRelation(queryRunner, "dealer_site");
        } else if (childtype === 3) {
            // buyer site;
            await this.dropRelation(queryRunner);
            await this.createRelation(queryRunner, "buyer_site");
        }
    }
}
