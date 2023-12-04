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
// Add body parser middleware
app.use(express.json());
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

// Get a single product
app.get('/api/products/:id', async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    const product = await productRepository.findOneBy({ id: productId })

    if (product) {
        // Product found, send it in the response
        res.status(200).json({
            success: true,
            message: "Product found",
            data: product
        });
    } else {
        // Product not found
        res.status(404).json({
            success: false,
            message: "Product not found",
            data: null
        });
    }
})

//Update Product
app.put('/api/products/:id', async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    const product = await productRepository.findOneBy({ id: productId })
    if (product) {
        productRepository.merge(product, req.body)
        const updatedProduct = await productRepository.save(product)
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });
    } else {
        // Product not found
        res.status(404).json({
            success: false,
            message: "Product not found",
            data: null
        });
    }
})

//Delete Product
app.delete('/api/products/:id', async (req: Request, res: Response) => {
    const deletedProduct = productRepository.delete(req.params.id)
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: deletedProduct
    })

})

//update like
app.put('/api/products/:id/like', async (req: Request, res: Response) => {
    const productId = parseInt(req.params.id);
    const product = await productRepository.findOneBy({ id: productId })
    if (product) {
        product.likes++
        const updatedProduct = await productRepository.save(product)
        res.status(200).json({
            success: true,
            message: "Like increased successfully",
            data: updatedProduct
        });
    } else {
        // Product not found
        res.status(404).json({
            success: false,
            message: "Product not found",
            data: null
        });
    }
})

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);

});

