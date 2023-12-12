import { DataSource } from "typeorm";
import "reflect-metadata"
export const appDataSource = new DataSource({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "rabbitMQproject",
    entities: ["src/entity/*.ts"],
    synchronize: false,  // Set this to false
    logging: false

})