import { DataSource } from "typeorm";
import "reflect-metadata"
export const appDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "rabbitMQproject",
    entities: ["src/entity/*.ts"],
    synchronize: false,  // Set this to false
    logging: false,

})