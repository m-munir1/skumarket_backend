const getDailyPrice = (priceHistory) => {
    let result = priceHistory.filter(
        (price) =>
            new Date().getTime() - new Date(price.date).getTime() <
            24 * 60 * 60 * 1000
    );

    result.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (result.length > 14) result = result.slice(0, 14);

    return result;
};

module.exports = getDailyPrice;
