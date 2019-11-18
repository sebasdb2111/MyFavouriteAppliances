'use strict';

const moment = require('moment');
const ProductController = require('./product.model');
const cheerio = require('cheerio');
const request = require('request');
const product = new ProductController();
const mongoosePaginate = require('mongoose-pagination');
const today = moment().format('L');

function backupProduct(product) {
    if (product) {
        const query = {"title": product.title};
        ProductController.findOne(query, (err, data) => {
            if (!data) {
                // const price = product.price;
                // const newPrice = Number(price.replace('€', ''));
                const newProduct = new ProductController();

                newProduct.category = product.category;
                newProduct.title = product.title;
                // newProduct.price = newPrice;
                newProduct.image = product.image;
                newProduct.updatedAt = product.updatedAt;
                newProduct.save((err, newProductStored) => {
                    if (err) {
                        console.log("Error to save product");
                    }
                    if (!newProductStored) {
                        console.log("ProductController has not save");
                    }
                });
            } else {
                for (let title in data.title) {
                    data[title] = product[title];
                }

                data.save((err) => {
                    if (err) {
                        console.log("Error when you save a product");
                    }
                })
            }
        });
    }
}

function findProducts(category, orderBy, res) {
    const page = 1;
    const itemsPerPAge = 20;
    ProductController.find({"category": category})
        .sort(orderBy)
        .paginate(page, itemsPerPAge, (err, products, total) => {
            if (err) {
                return res.status(500).send({message: 'Request error'});
            }

            if (!products) {
                return res.status(404).send({message: 'Products not exists'});
            }

            return res.status(200).send({
                products,
                total,
                page: Math.ceil(total / itemsPerPAge)
            });
        });
}

function smallAppliances(req, res) {
    request(
        'https://www.elcorteingles.es/electrodomesticos/cafeteras/cafeteras-de-capsulas/',
        (error, response, html) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html);
                const webpage = [];

                $('#product-list').find('.product-list').children().each((i, el) => {
                    const resTitle = $(el)
                        .find('.js-product-click')
                        .attr('title');

                    // const resPrice = $(el).find('.product-price')
                    // .children()
                    // .text();

                    const resImage = $(el)
                        .find('.c12')
                        .attr('src');

                    webpage[i] = {
                        category: 'small-appliances',
                        title: resTitle,
                        // price: resPrice,
                        image: resImage,
                        updatedAt: today
                    };
                });
                webpage.map(smallAppliances => {
                    backupProduct(smallAppliances, 'small-appliances');
                });
                findProducts('small-appliances', req.query.orderBy, res);
            } else {
                findProducts('small-appliances', req.query.orderBy, res);
            }
        }
    );
}

function dishwashers(req, res) {
    request(
        'https://www.elcorteingles.es/electrodomesticos/lavavajillas/lavavajillas-60-cm/',
        (error, response, html) => {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html);
                const webpage = [];

                $('#product-list').find('.product-list').children().each((i, el) => {
                    const resTitle = $(el).find('.product-image')
                        .children('a')
                        .children('img')
                        .attr('alt');

                    // const resPrice = $(el).find('.product-price')
                    // .children()
                    // .text();

                    const resImage = $(el).find('.product-image')
                        .children('a')
                        .children('img')
                        .attr('src');

                    webpage[i] = {
                        category: 'dishwashers',
                        title: resTitle,
                        // price: resPrice,
                        image: resImage,
                        updatedAt: today
                    };
                });

                webpage.map(dishwasher => {
                    backupProduct(dishwasher, 'dishwasher');
                });

                findProducts('dishwashers', req.query.orderBy, res);
            } else {
                findProducts('dishwashers', req.query.orderBy, res);
            }
        }
    );
}

module.exports = {
    smallAppliances,
    dishwashers
};
