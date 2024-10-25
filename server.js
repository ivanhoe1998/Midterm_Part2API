const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/products', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

const productSchema = new mongoose.Schema({
    product_code: String,
    name: String,
    description: String,
    price: Number,
    qty: Number,
    date_added: Date
});

const Product = mongoose.model('Product', productSchema);

app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.send(products);
});


app.post('/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.send(product);
});

app.put('/products/:id', async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(product);
});

app.delete('/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.send({ message: 'Product deleted' });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
