
import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { appDataSource } from "../app-data-source"
import cors from "cors";
import { Product } from './entity/Products';
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
const port = process.env.PORT || 8002;
//This app will run on port 8000 but the frontend aps will have different ports,chrom will prevent this request(coz different ports), so we added cors to make sure that oure frontend will communicate with node
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8082', 'http://localhost:4200']
}))
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});
const productRepository = appDataSource.getRepository(Product)
//Get all products
app.get('/api/products', async (req: Request, res: Response) => {
    const products = await productRepository.find();
    res.status(200).json({
        success: true,
        message: "Fetch all products",
        data: products
    })
});

//Create product
app.post('/api/products', async (req: Request, res: Response) => {
    const product = await productRepository.create(req.body)
    const newProduct = await productRepository.save(product)
    console.log("newProduct", newProduct)

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: newProduct
    })
})
app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
