import express from 'express';
import axios from 'axios';
const router = express.Router();


// mock api endpoint for products
router.get('/', async (req, res) => {

    const products = await axios.get('https://fakestoreapi.com/products');

    if(!products || products.status !== 200) {
        return res.status(500).json({ message: 'Failed to fetch products' });
    }

    res.json({ data: products.data, message: 'Products fetched successfully' });
});

export default router;