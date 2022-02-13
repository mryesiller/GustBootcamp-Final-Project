import {Entity, PrimaryGeneratedColumn, Column,BaseEntity,CreateDateColumn} from "typeorm";

//THİS İS EXAMPLE FOR MYSQL ENTITY 
//Simple-array using with JSON.stringfy and JSON.parse when saved to database.
@Entity()
export class MovieM extends BaseEntity{

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

    //simple-array using instead of Jsonb . 'jsonb' only used with postgres.
    @Column("simple-array", {nullable: true})  
    comments?: string[];     

    @Column('simple-array')
    like: string[];

    @Column({nullable:true})
    creator:string;

    @Column()
    @CreateDateColumn()   
    createDate: Date;

    @Column()   
    shared: boolean;

}
