const getMonthlyTradeValue = (priceHistory) => {
    // create a array of all dates of current month
    const dates = Array.from({ length: 30 }, (_, i) => {
        const date = i + 1;
        return `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
        }-${date}`;
    });

    // loop through the dates array and get the price of that date
    const monthlyPrice = dates.map((date) => {
        const prices = priceHistory.filter(
            (price) =>
                new Date(price.date).getFullYear() ===
                    new Date(date).getFullYear() &&
                new Date(price.date).getMonth() === new Date(date).getMonth() &&
                new Date(price.date).getDate() === new Date(date).getDate()
        );

        // if no price found in that date
        if (prices.length === 0) {
            return {
                date,
                price: 0,
            };
        }

        // get average price of that date
        const averagePrice =
            prices.reduce((acc, price) => acc + price.price, 0) / prices.length;

        return {
            date,
            price: Math.floor(averagePrice),
        };
    });

    return monthlyPrice;
};

module.exports = getMonthlyTradeValue;
