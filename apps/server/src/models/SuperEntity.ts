import {
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { customEventEmitter } from "../loaders";
import User from "./User";

class SuperEntity extends BaseEntity {
    /** Base Entity */
    @PrimaryGeneratedColumn({ name: "id" })
    public id: number;

    @UpdateDateColumn({ name: "updated_at" })
    public updated_at: Date;

    @CreateDateColumn({ name: "created_at" })
    public created_at: Date;

    @Column({ default: null, name: "start_date", type: "date" })
    public start_date: Date;

    @Column({ default: null, name: "end_date", type: "date" })
    public end_date: Date;

    @BeforeInsert()
    private createUsers() {
        const cb = (user: User) => {
            console.log("user", user);
            this.updated_by = user;
            this.created_by = user;
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
export default SuperEntity;
