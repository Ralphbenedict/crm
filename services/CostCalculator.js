const Material = require('../models/Material');
const FlatSurfaceMarking = require('../models/FlatSurfaceMarking');

class CostCalculator {
    static calculateLaserEngraving(params) {
        const {
            quantity,
            length,
            width,
            flatFee = false,
            flatFeeAmount = 0
        } = params;

        const totalArea = length * width;
        const pricePerMark = FlatSurfaceMarking.getPriceForQuantity(quantity, totalArea);

        // Calculate base price
        let basePrice = pricePerMark;

        // Add flat fee if applicable
        if (flatFee) {
            basePrice += (flatFeeAmount / quantity);
        }

        // Calculate VAT (12%)
        const vat = basePrice * 0.12;
        const finalPricePerPiece = basePrice + vat;
        const totalPrice = finalPricePerPiece * quantity;

        return {
            totalArea,
            pricePerMark,
            basePrice,
            flatFeePerPiece: flatFee ? (flatFeeAmount / quantity) : 0,
            vat,
            finalPricePerPiece,
            totalPrice
        };
    }

    static calculateLaserCutting(params) {
        const {
            quantity,
            totalArea,
            totalPerimeter,
            cuttingSpeed,
            flatFee = false,
            flatFeeAmount = 0
        } = params;

        // Calculate cutting time
        const seconds = totalPerimeter / cuttingSpeed;
        const minutes = seconds / 60;
        const ratePerMinute = 26.00; // Fixed rate
        const variableCuttingCost = minutes * ratePerMinute;

        // Calculate base price
        let basePrice = variableCuttingCost;

        // Add flat fee if applicable
        if (flatFee) {
            basePrice += (flatFeeAmount / quantity);
        }

        // Calculate VAT (12%)
        const vat = basePrice * 0.12;
        const finalPricePerPiece = basePrice + vat;
        const totalPrice = finalPricePerPiece * quantity;

        return {
            seconds,
            minutes,
            ratePerMinute,
            variableCuttingCost,
            basePrice,
            flatFeePerPiece: flatFee ? (flatFeeAmount / quantity) : 0,
            vat,
            finalPricePerPiece,
            totalPrice
        };
    }

    static calculateMaterialCost(materialType, area) {
        const material = Material.getMaterialByProduct(materialType);
        return material ? material.pricePerSqIn * area : 0;
    }
}

module.exports = CostCalculator; 