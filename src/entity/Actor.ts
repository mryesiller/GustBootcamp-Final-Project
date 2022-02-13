import {Entity, PrimaryGeneratedColumn, Column,BaseEntity, CreateDateColumn} from "typeorm";


@Entity()
export class Actor extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    user_id: string;

    @Column()   
    firstname: string;

    @Column()   
    lastname: string;

    @Column()    
    description: string;
    
    @Column()    
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
