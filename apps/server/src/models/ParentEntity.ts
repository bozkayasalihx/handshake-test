import {
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { customEventEmitter } from "../loaders";
import User from "./User";

export default class ParentEntity extends BaseEntity {
    /** Base Entity */
    @PrimaryGeneratedColumn({ name: "id" })
    public id: number;

    @UpdateDateColumn({ name: "updated_at" })
    public updated_at: Date;

    @CreateDateColumn({ name: "created_at" })
    public created_at: Date;

    @BeforeInsert()
    private createUsers() {
        const cb = (user: User) => {
            this.created_by = user;
            this.updated_by = user;
        };
        customEventEmitter.on("sendUser", cb);
        customEventEmitter.destoryUser(cb);
    }

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "created_by" })
    public created_by: User;

    @BeforeUpdate()
    private updateUser() {
        const cb = (user: User) => {
            this.updated_by = user;
        };
        customEventEmitter.on("sendUser", cb);
        customEventEmitter.destoryUser(cb);
    }

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: "updated_by" })
    public updated_by: User;
}
