import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { appDataSource } from "../app-data-source"
import { Product } from './entity/Product';
import cors from "cors";
// establish database connection
appDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

//For env File
dotenv.config();
const app: Application = express();
const port = process.env.PORT || 8001;
//This app will run on port 8000 but the frontend aps will have different ports,chrom will prevent this request(coz different ports), so we added cors to make sure that oure frontend will communicate with node
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8082', 'http://localhost:4200']
}))
const productRepository = appDataSource.getRepository(Product)
app.get('/', async (req: Request, res: Response) => {
    const products = await productRepository.find();
    res.status(200).json({
        success: true,
        message: "Fetch all products",
        data: products
    })
});

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);

});

