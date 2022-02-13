import {Entity, PrimaryGeneratedColumn, Column,BaseEntity,CreateDateColumn} from "typeorm";


@Entity()
export class Movie extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    user_id: string;

    @Column({nullable:false})   
    title: string;

    @Column()    
    description: string;

    @Column({nullable:true})   
    photo: string;

    @Column("jsonb", {nullable: true})  
    comments?: object[];     

    @Column('text',{array:true})
    like: string[];

    @Column({nullable:true})
    creator:string;

    @Column()
    @CreateDateColumn()   
    createDate: Date;

    @Column()   
    shared: boolean;

}
