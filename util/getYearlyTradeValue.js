const getYearlyTradeValue = (priceHistory) => {
    // get the current year
    const currentYear = new Date().getFullYear();
    // create a array of 12 months of current year and month look like 2020-10-1

    const months = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        return `${currentYear}-${month}-1`;
    });

    // loop through the dates array
    const yearlyPrice = months.map((month) => {
        // get the price of that month
        const prices = priceHistory.filter(
            (price) =>
                new Date(price.date).getFullYear() ===
                    new Date(month).getFullYear() &&
                new Date(price.date).getMonth() === new Date(month).getMonth()
        );

        // if no price found in that month
        if (prices.length === 0) {
            return {
                date: month,
                price: 0,
            };
        }

        // get the average price of that month
        const averagePrice =
            prices.reduce((acc, price) => acc + price.price, 0) / prices.length;

        return {
            date: month,
            price: Math.floor(averagePrice),
        };
    });

    return yearlyPrice;
};

module.exports = getYearlyTradeValue;
