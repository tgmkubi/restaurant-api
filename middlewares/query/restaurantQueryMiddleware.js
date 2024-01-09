const asyncErrorWrapper = require('express-async-handler');
const { searchHelper, populateHelper, restaurantSortHelper, paginationHelper } = require('./queryMiddlewareHelpers');

const restaurantQueryMiddleware = function (model, options) {

    return asyncErrorWrapper(async function (req, res, next) {
        //Initial Query
        let query = model.find();

        //Search
        query = searchHelper("name", query, req);

        //Populate
        if (options && options.population) {
            query = populateHelper(query, options.population);
        };

        //Sorting
        query = restaurantSortHelper(query, req);

        //Pagination
        const total = await model.countDocuments();
        const paginationResult = await paginationHelper(total, query, req);
        query = paginationResult.query;
        const pagination = paginationResult.pagination;

        //Query
        const queryResults = await query;
        res.queryResults = {
            success: true,
            count: queryResults.length,
            pagination: pagination,
            data: queryResults
        }

        next();
    });
};

module.exports = restaurantQueryMiddleware;