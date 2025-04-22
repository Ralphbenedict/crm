const AIService = require('../services/aiService');

class AIController {
    static async chat(req, res) {
        try {
            const { message } = req.body;
            const response = await AIService.generateResponse(message);
            res.json({ success: true, response });
        } catch (error) {
            console.error('Error in AI chat:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async analyzeCustomer(req, res) {
        try {
            const { customerData } = req.body;
            const analysis = await AIService.analyzeCustomerData(customerData);
            res.json({ success: true, analysis });
        } catch (error) {
            console.error('Error in customer analysis:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async getProductRecommendations(req, res) {
        try {
            const { customerProfile } = req.body;
            const recommendations = await AIService.generateProductRecommendations(customerProfile);
            res.json({ success: true, recommendations });
        } catch (error) {
            console.error('Error in product recommendations:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async estimateTimeline(req, res) {
        try {
            const { projectDetails } = req.body;
            const timeline = await AIService.estimateProjectTimeline(projectDetails);
            res.json({ success: true, timeline });
        } catch (error) {
            console.error('Error in timeline estimation:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = AIController; 