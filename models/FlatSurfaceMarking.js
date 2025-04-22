class FlatSurfaceMarking {
    constructor(quantity, pricePerMark, minQty, maxQty, isBetween) {
        this.quantity = quantity;
        this.pricePerMark = pricePerMark;
        this.minQty = minQty;
        this.maxQty = maxQty;
        this.isBetween = isBetween;
    }

    static getPricingTiers(areaSqInches) {
        if (areaSqInches <= 5) {
            return [
                new FlatSurfaceMarking('1-10', 300.00, 0, 10, false),
                new FlatSurfaceMarking('11-20', 250.00, 11, 20, false),
                new FlatSurfaceMarking('21-30', 200.00, 21, 30, false),
                new FlatSurfaceMarking('31-40', 150.00, 31, 40, false),
                new FlatSurfaceMarking('41-50', 100.00, 41, 50, false),
                new FlatSurfaceMarking('51-100', 21.00, 51, 100, false),
                new FlatSurfaceMarking('101-500', 19.00, 101, 500, true),
                new FlatSurfaceMarking('501-999', 17.00, 501, 999, false),
                new FlatSurfaceMarking('1000 and up', 15.00, 1000, 4999, false)
            ];
        } else {
            return [
                new FlatSurfaceMarking('1-10', 300.00, 0, 10, false),
                new FlatSurfaceMarking('11-20', 250.00, 11, 20, false),
                new FlatSurfaceMarking('21-30', 200.00, 21, 30, false),
                new FlatSurfaceMarking('31-40', 150.00, 31, 40, false),
                new FlatSurfaceMarking('41-50', 100.00, 41, 50, false),
                new FlatSurfaceMarking('51-100', 17.00, 51, 100, false),
                new FlatSurfaceMarking('101-500', 16.00, 101, 500, true),
                new FlatSurfaceMarking('500-999', 15.00, 500, 999, false),
                new FlatSurfaceMarking('1000 and up', 14.00, 1000, 4999, false)
            ];
        }
    }

    static getPriceForQuantity(quantity, areaSqInches) {
        const tiers = this.getPricingTiers(areaSqInches);
        return tiers.find(tier =>
            quantity >= tier.minQty &&
            (tier.isBetween ? quantity <= tier.maxQty : quantity < tier.maxQty)
        )?.pricePerMark || tiers[tiers.length - 1].pricePerMark;
    }
}

module.exports = FlatSurfaceMarking; 