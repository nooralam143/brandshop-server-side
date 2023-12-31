const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
console.log(process.env.DB_USER)
// middleware
app.use(cors());
app.use(express.json());



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.58kalj5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // create database & collection
    const productCollection = client.db('noorMart').collection('products');
    const brandCollection = client.db('noorMart').collection('brands');
    const myCartCollection = client.db('noorMart').collection('mycart');
    const brandSlidersCollection = client.db('noorMart').collection('brandSliders');



    // Product Api CRUD methods Start

    // Read all products data from database
    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const products = await cursor.toArray();
      res.send(products);
    })
    // Read single products data from database
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query);
      res.send(result);
    })
    // Post Add product data in database
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      newProduct.submitDateTime = new Date();
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })

    // update single product data
    app.patch('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const product = req.body;
      console.log(id, product);
      const updateProduct = {
        $set: {
          imageUrl: product.imageUrl,
          name: product.name,
          brand: product.brand,
          type: product.type,
          price: product.price,
          description: product.description,
          rating: product.rating,
        }
      }
      const result = await productCollection.updateOne(filter, updateProduct, options);
      res.send(result);
    })

    // Delete product data from database
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      console.log('please delete data', id);
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })
    // Product Api CRUD methods END



    // Brand API Start
    // Read all brands data from database
    app.get('/brands', async (req, res) => {
      const cursor = brandCollection.find();
      const brands = await cursor.toArray();
      res.send(brands);
    })
    // Read single brands data from database
    app.get('/brands/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await brandCollection.findOne(query);
      res.send(result);
    })
    // Post add brand in database
    app.post('/brands', async (req, res) => {
      const newBrand = req.body;
      console.log(newBrand);
      const result = await brandCollection.insertOne(newBrand);
      res.send(result);
    })
    // Brand API End


    //  MyCart Api Start
    // Post Add mycart data in database
    app.post('/mycart', async (req, res) => {
      const addNewCart = req.body;
      addNewCart.AddDateTime = new Date();
      console.log(addNewCart);
      const result = await myCartCollection.insertOne(addNewCart);
      res.send(result);
    })
    app.get('/mycart', async (req, res) => {
      const userEmail = req.query.userEmail;
      const cursor = myCartCollection.find({ userEmail });
      const myCart = await cursor.toArray();
      res.send(myCart);
    })
    // Delete product data from database
    app.delete('/mycart/:id', async (req, res) => {
      const id = req.params.id;
      console.log('please delete data', id);
      const query = { _id: new ObjectId(id) }
      const result = await myCartCollection.deleteOne(query);
      res.send(result);
    })
  //  MyCart Api End

  //Brand Slidder Api Start


  app.post('/add-brand-sliders', async (req, res) => {
    const addBrandSliders = req.body;
    addBrandSliders.AddDateTime = new Date();
    console.log(addBrandSliders);
    const result = await brandSlidersCollection.insertOne(addBrandSliders);
    res.send(result);
  })
    //Brand Slidder Api END


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Port listening
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
