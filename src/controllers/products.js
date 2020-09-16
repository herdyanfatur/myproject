//function create products with get method
exports.createProduct = (req, res, next) => {
    const nama = req.body.name;
    const pricee = req.body.price;
    res.json(
        {
            message: 'Create Product Successed!!',
            data: {
                id: 1,
                name: nama,
                price: pricee
            }
        }
    );
    next();
}

//function get products
exports.getAllProducts = (req, res, next) => {
    res.json({
        message: 'Get All Products Successed!!',
            data: {
                id: 1,
                name: 'sari gandum',
                price: 3000
            }
        }
    );
    next();
}