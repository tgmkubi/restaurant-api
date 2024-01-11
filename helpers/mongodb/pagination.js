const paginationHelper = (req) => {
    const pagination = {
        metadata: [ // metadata adında bir alan oluştur
            { $count: "total" }, // toplam yorum sayısını hesapla
            {
                $addFields: {
                    page: parseInt(req.query.page) || 1, // istenen sayfa numarasını ekle
                    limit: parseInt(req.query.limit) || 20, // istenen sayfa limitini ekle
                    previous: { // bir önceki sayfa hakkında bilgi ekle
                        $cond: [ // koşullu ifade
                            { $gt: [parseInt(req.query.page) || 1, 1] }, // eğer istenen sayfa numarası 1'den büyükse
                            { // bir önceki sayfa numarası ve limitini döndür
                                page: { $subtract: [parseInt(req.query.page) || 1, 1] },
                                limit: parseInt(req.query.limit) || 5
                            },
                            null // değilse null döndür
                        ]
                    },
                    next: { // bir sonraki sayfa hakkında bilgi ekle
                        $cond: [ // koşullu ifade
                            { $lt: [{ $multiply: [parseInt(req.query.page) || 1, parseInt(req.query.limit) || 5] }, "$total"] }, // eğer istenen sayfa numarası ile limit çarpımı toplam yorum sayısından küçükse
                            { // bir sonraki sayfa numarası ve limitini döndür
                                page: { $add: [parseInt(req.query.page) || 1, 1] },
                                limit: parseInt(req.query.limit) || 5
                            },
                            null // değilse null döndür
                        ]
                    }
                }
            }
        ],
        data: [ // data adında bir alan oluştur
            { $skip: (parseInt(req.query.page) - 1) * parseInt(req.query.limit) || 0 }, // istenen sayfaya göre yorumları atla
            { $limit: parseInt(req.query.limit) || 5 } // istenen sayfa limitine göre yorumları getir
        ]
    }

    return pagination;
};

module.exports = { paginationHelper };