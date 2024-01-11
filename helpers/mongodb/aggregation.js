const { lookupHelper } = require('./lookup');
const { paginationHelper } = require('./pagination');

const aggregationHelper = (req) => {

    const lookup = lookupHelper(req);
    const pagination = paginationHelper(req);

    const { sortBy } = req.query; // TODO : kullanıcıdan sıralama için 

    const aggregation = [
        {
            $match: {} // tüm yorumları getir
        },
        {
            $lookup: lookup
        },
        {
            $unwind: '$user' // user dizisini tek bir nesneye dönüştür
        },
        {
            $sort: { 'user.age': sortBy === "age" ? 1 : -1 } // user.age alanına göre sırala
        },
        {
            $facet: pagination
        }
    ]

    return aggregation;
};

module.exports = { aggregationHelper }