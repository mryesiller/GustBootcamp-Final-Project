import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity} from "typeorm"

@Entity()
export class User extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()       
    username: string;

    @Column({unique: true})   
    email: string;

    @Column()    
    password: string;   

    @Column({nullable: true})    
    token:string

    @Column()
    @CreateDateColumn()
    Created_at:Date

}
