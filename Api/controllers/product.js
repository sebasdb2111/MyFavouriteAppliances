'use strict';

let moment = require('moment');
let Product = require('../models/product');
let cheerio = require('cheerio');
let request = require('request');
let product = new Product();
let mongoosePaginate = require('mongoose-pagination');
let today = moment().format('L');

function backupProduct(product) {
    if (product) {
        let query = {"title": product.title};
        Product.findOne(query, (err, data) => {
            if (!data) {
                let price = product.price;
                let newPrice = Number(price.replace('€', ''));
                let newProduct = new Product();
                newProduct.category = product.category;
                newProduct.title = product.title;
                newProduct.price = newPrice;
                newProduct.image = product.image;
                newProduct.updatedAt = product.updatedAt;
                newProduct.save((err, newProductStored) => {
                    if (err) {
                        console.log("Error to save product");
                    }
                    if (!newProductStored) {
                        console.log("Product has not save");
                    }
                });
            } else {
                for (var title in data.title) {
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
    let page = 1;
    let itemsPerPAge = 20;
    Product.find({"category": category})
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
        'https://www.appliancesdelivered.ie/search/small-appliances',
        (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                const webpage = [];
                $('.search-results-product').each((i, el) => {
                    const resTitle = $(el)
                        .find('.img-responsive')
                        .attr('alt');
                    const resPrice = $(el)
                        .find('.section-title')
                        .text();
                    const resImage = $(el)
                        .find('.img-responsive')
                        .attr('src');
                    webpage[i] = {
                        category: 'small-appliances',
                        title: resTitle,
                        price: resPrice,
                        image: resImage,
                        updatedAt: today
                    };
                });
                webpage.map(dishwasher => {
                    backupProduct(dishwasher, 'small-appliances');
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
        'https://www.appliancesdelivered.ie/search/dishwashers',
        (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                const webpage = [];
                $('.search-results-product').each((i, el) => {
                    const resTitle = $(el)
                        .find('.article-brand')
                        .attr('alt');
                    const resPrice = $(el)
                        .find('.section-title')
                        .text();
                    const resImage = $(el)
                        .find('.sales-search-wrapper')
                        .children()
                        .attr('src');
                    webpage[i] = {
                        category: 'dishwashers',
                        title: resTitle,
                        price: resPrice,
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
