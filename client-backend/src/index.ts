
import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { appDataSource } from "../app-data-source"
import cors from "cors";
import { Product } from './entity/Products';
import * as amqp from 'amqplib/callback_api';
import axios from 'axios'
import { ObjectId } from 'mongodb'
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
const productRepository = appDataSource.getRepository(Product)


amqp.connect('amqps://xfsopmhv:mBormtTydv1NCWXIcg1RLCryA_hEdped@octopus.rmq3.cloudamqp.com/xfsopmhv', (error0, connection) => {
    if (error0) {
        throw error0
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1
        }
        channel.assertQueue('product_created', { durable: false })
        channel.assertQueue('product_updated', { durable: false })
        channel.assertQueue('product_deleted', { durable: false })

        const app: Application = express();
        const port = process.env.PORT || 8002;
        app.use(express.json());
        //This app will run on port 8002 but the frontend aps will have different ports,chrom will prevent this request(coz different ports), so we added cors to make sure that oure frontend will communicate with node
        app.use(cors({
            origin: ['http://localhost:3000', 'http://localhost:8082', 'http://localhost:4200', 'http://localhost:61500']
        }))

        //Create product event
        channel.consume('product_created', async (msg) => {
            const eventProduct: Product = JSON.parse(msg!.content.toString())
            const product = new Product()
            product.admin_id = parseInt(eventProduct.id)
            product.title = eventProduct.title
            product.image = eventProduct.image
            product.likes = eventProduct.likes
            await productRepository.save(product)
            console.log("Product Created")
        }, { noAck: true })

        //Update product event
        channel.consume('product_updated', async (msg) => {
            const eventUpdatedProduct: Product = JSON.parse(msg!.content.toString())
            const toUpdateproduct = await productRepository.findOneBy({ admin_id: parseInt(eventUpdatedProduct.id) })
            productRepository.merge(toUpdateproduct!, {
                title: eventUpdatedProduct.title,
                image: eventUpdatedProduct.image,
                likes: eventUpdatedProduct.likes
            })
            await productRepository.save(toUpdateproduct!)
            console.log("Product updated")
        }, { noAck: true })

        //Delete product
        channel.consume('product_deleted', async (msg) => {
            const admin_id = parseInt(msg!.content.toString())
            await productRepository.delete({ admin_id })
        })

        //Get all products
        app.get('/api/products', async (req: Request, res: Response) => {
            const products = await productRepository.find()
            res.status(200).json({
                success: true,
                message: "Featch all products",
                data: products
            })
        })

        //Increase likes
        app.post('/api/products/:id/like', async (req: Request, res: Response) => {
            const productId = parseInt(req.params.id);
            const product = await productRepository.findOneBy({ admin_id: productId })
            console.log('Found Product:', product);
            if (product) {
                await axios.post(`http://localhost:8001/api/products/${product.admin_id}/like`, {})
                product!.likes++
                await productRepository.save(product!)
                res.status(200).json({
                    success: true,
                    message: "Featch all products",
                    data: product
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: "error product not found",

                })
            }

        })

        // Get a single product
        app.get('/api/products/:id', async (req: Request, res: Response) => {
            const productId = parseInt(req.params.id);
            const product = await productRepository.findOneBy({ admin_id: productId })

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

        app.listen(port, () => {
            console.log(`Server is Fire at http://localhost:${port}`);
        });
        process.on('beforeExit', () => {
            console.log('clawzed :p')
            connection.close()
        })

    })
})

