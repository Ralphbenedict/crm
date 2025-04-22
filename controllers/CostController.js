const CostCalculator = require('../services/CostCalculator');

class CostController {
    static async calculateLaserEngraving(req, res) {
        try {
            const { material, size, complexity } = req.body;
            // Basic calculation logic
            const baseRate = 10; // Base rate per square inch
            const complexityMultiplier = complexity === 'high' ? 1.5 : 1;
            const totalCost = baseRate * size * complexityMultiplier;

            res.json({
                success: true,
                cost: totalCost,
                breakdown: {
                    baseRate,
                    size,
                    complexityMultiplier,
                    totalCost
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async calculateLaserCutting(req, res) {
        try {
            const { material, length, thickness } = req.body;
            // Basic calculation logic
            const baseRate = 5; // Base rate per linear inch
            const thicknessMultiplier = thickness / 8; // Assuming 1/8" as base thickness
            const totalCost = baseRate * length * thicknessMultiplier;

            res.json({
                success: true,
                cost: totalCost,
                breakdown: {
                    baseRate,
                    length,
                    thicknessMultiplier,
                    totalCost
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    static async getMaterials(req, res) {
        try {
            const materials = [
                { id: 1, name: 'Wood', type: 'engraving', thickness: '1/4"', price: 10 },
                { id: 2, name: 'Acrylic', type: 'cutting', thickness: '1/8"', price: 15 },
                { id: 3, name: 'Metal', type: 'engraving', thickness: '1/16"', price: 20 }
            ];

            res.json({
                success: true,
                materials
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = CostController; 