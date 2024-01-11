const lookupHelper = (req) => {
    const lookup = {
        from: 'users', // user koleksiyonu ile ilişkilendir
        // localField: 'user', // yorumun user alanı
        // foreignField: '_id', // user'ın _id alanı
        let: { userId: "$user" },
        pipeline: [
            {
                $match: {
                    $expr: { $eq: ["$_id", "$$userId"] }
                }
            },
            {
                $project: {
                    _id: 1,
                    age: 1,
                    gender: 1
                }
            }
        ],
        as: 'user' // sonucu user olarak ata
    }

    return lookup;
};

module.exports = { lookupHelper };