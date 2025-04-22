class Material {
    constructor(category, product, pricePerSqIn) {
        this.category = category;
        this.product = product;
        this.pricePerSqIn = pricePerSqIn;
    }

    static getMaterials() {
        return [
            new Material('Acrylic', 'Clear Acrylic - 3mm', 1.25),
            new Material('Acrylic', 'Clear Acrylic - 4.5mm', 1.91),
            new Material('Acrylic', 'Clear Acrylic - 6mm', 2.11),
            new Material('Acrylic', 'Black Acrylic - 3mm', 1.45),
            new Material('Acrylic', 'Colored Acrylic - 3mm', 3.10),
            new Material('Wood', 'Basswood - 3mm', 0.70),
            new Material('Wood', 'Basswood - 6mm', 1.68),
            new Material('None', 'None', 0.00)
        ];
    }

    static getMaterialByProduct(product) {
        return this.getMaterials().find(m => m.product === product);
    }
}

module.exports = Material; 