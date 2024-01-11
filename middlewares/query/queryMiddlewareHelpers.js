const User = require('../../models/User');
const Review = require('../../models/Review');

const searchHelper = (searchKey, query, req) => {
    if (req.query.search) {
        const searchObject = {};
        const regex = new RegExp(req.query.search, "i");
        searchObject[searchKey] = regex;
        return query.where(searchObject);
    };
    return query;
};

const populateHelper = (query, population) => {
    return query.populate(population);
};

const restaurantSortHelper = (query, req) => {
    const sortKey = req.query.sortBy;

    if (sortKey === "nearest-user-location") {
        if (!req.user.location || !req.user.location.coordinates) {
            throw new Error("User location coordinates are missing.");
        }

        const userCoordinates = req.user.location.coordinates;
        return query.where({
            "address.location.coordinates": {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: userCoordinates,
                    },
                },
            },
        });
    }
    // Diğer sıralama kriterlerini buraya ekleyebilirsiniz.

    // Varsayılan sıralama olmadan query'i geri döndürün
    return query;
};

const paginationHelper = async (totalDocuments, query, req) => {

    //Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    const total = totalDocuments;

    if (startIndex > 0) {
        pagination.previous = {
            page: page - 1,
            limit: limit,
        };
    };
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit,
        };
    }
    return {
        query: query === undefined ? undefined : query.skip(startIndex).limit(limit),
        pagination: pagination,
        startIndex,
        limit,
    };
};

module.exports = { searchHelper, populateHelper, restaurantSortHelper, paginationHelper };