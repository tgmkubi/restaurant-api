const asyncErrorWrapper = require('express-async-handler');
const Review = require('../models/Review');
// const { paginationHelper } = require('../helpers/mongodb/pagination');
// const { lookupHelper } = require('../helpers/mongodb/lookup');
const { aggregationHelper } = require('../helpers/mongodb/aggregation');
const CustomError = require('../helpers/error/CustomError');
const Restaurant = require('../models/Restaurant');

// const getAllReviews = asyncErrorWrapper(async (req, res, next) => {

//     const aggregation = [
//         {
//             $match: {} // tüm yorumları getir
//         },
//         {
//             $lookup: {
//                 from: 'users', // user koleksiyonu ile ilişkilendir
//                 // localField: 'user', // yorumun user alanı
//                 // foreignField: '_id', // user'ın _id alanı
//                 let: { userId: "$user" },
//                 pipeline: [
//                     {
//                         $match: {
//                             $expr: { $eq: ["$_id", "$$userId"] }
//                         }
//                     },
//                     {
//                         $project: {
//                             _id: 1,
//                             age: 1,
//                             gender: 1
//                         }
//                     }
//                 ],
//                 as: 'user' // sonucu user olarak ata
//             }
//         },
//         {
//             $unwind: '$user' // user dizisini tek bir nesneye dönüştür
//         },
//         {
//             $sort: { 'user.age': 1 } // user.age alanına göre sırala
//         },
//         {
//             $facet: {
//                 metadata: [ // metadata adında bir alan oluştur
//                     { $count: "total" }, // toplam yorum sayısını hesapla
//                     {
//                         $addFields: {
//                             page: parseInt(req.query.page) || 1, // istenen sayfa numarasını ekle
//                             limit: parseInt(req.query.limit) || 20, // istenen sayfa limitini ekle
//                             previous: { // bir önceki sayfa hakkında bilgi ekle
//                                 $cond: [ // koşullu ifade
//                                     { $gt: [parseInt(req.query.page) || 1, 1] }, // eğer istenen sayfa numarası 1'den büyükse
//                                     { // bir önceki sayfa numarası ve limitini döndür
//                                         page: { $subtract: [parseInt(req.query.page) || 1, 1] },
//                                         limit: parseInt(req.query.limit) || 5
//                                     },
//                                     null // değilse null döndür
//                                 ]
//                             },
//                             next: { // bir sonraki sayfa hakkında bilgi ekle
//                                 $cond: [ // koşullu ifade
//                                     { $lt: [{ $multiply: [parseInt(req.query.page) || 1, parseInt(req.query.limit) || 5] }, "$total"] }, // eğer istenen sayfa numarası ile limit çarpımı toplam yorum sayısından küçükse
//                                     { // bir sonraki sayfa numarası ve limitini döndür
//                                         page: { $add: [parseInt(req.query.page) || 1, 1] },
//                                         limit: parseInt(req.query.limit) || 5
//                                     },
//                                     null // değilse null döndür
//                                 ]
//                             }
//                         }
//                     }
//                 ],
//                 data: [ // data adında bir alan oluştur
//                     { $skip: (parseInt(req.query.page) - 1) * parseInt(req.query.limit) || 0 }, // istenen sayfaya göre yorumları atla
//                     { $limit: parseInt(req.query.limit) || 5 } // istenen sayfa limitine göre yorumları getir
//                 ]
//             }
//         }
//     ];

//     const queryResults = await Review.aggregate(aggregation);


//     return res.status(200).json(queryResults);
// });

const getAllReviews = asyncErrorWrapper(async (req, res, next) => {

    // const pagination = paginationHelper(req);
    // const lookup = lookupHelper();

    // const aggregation = [
    //     {
    //         $match: {} // tüm yorumları getir
    //     },
    //     {
    //         $lookup: lookup
    //     },
    //     {
    //         $unwind: '$user' // user dizisini tek bir nesneye dönüştür
    //     },
    //     {
    //         $sort: { 'user.age': 1 } // user.age alanına göre sırala
    //     },
    //     {
    //         $facet: pagination
    //     }
    // ];

    const aggregation = aggregationHelper(req);

    const queryResults = await Review.aggregate(aggregation);


    return res.status(200).json(queryResults);
});

const createReview = asyncErrorWrapper(async (req, res, next) => {

    const { comment, rating } = req.body;
    const { user, order } = req;

    // review create
    const review = await Review.create({
        user: user._id,
        restaurant: order.restaurant,
        order: order._id,
        comment: comment,
        rating: rating
    });

    if (!review) {
        return next(new CustomError("Internal Server Error. Review create failed.", 500));
    }

    // update order.review string
    order.review = review._id;
    await order.save();

    // update user.reviews array
    user.reviews = [
        ...user.reviews,
        review._id
    ];
    await user.save();

    // update restaurant.review
    const restaurant = await Restaurant.findById(order.restaurant);
    restaurant.reviews = [
        ...restaurant.reviews,
        review._id
    ];
    await restaurant.save();

    return res.status(200).json({
        success: true,
        data: review
    })
});

module.exports = { getAllReviews, createReview };