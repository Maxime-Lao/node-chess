const { Own, User, Article } = require('../db');
const Sequelize = require('sequelize');
const ValidationError = require('../errors/ValidationError');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = function OwnService() {
    return {
        // avant de tester cette fonction, assurez que le user avec lequel vous êtes connecté possède des owns(sinon créer des fixtures). De toute façon à chaque création de compte, le user possédra des owns(0 crédits premium et 0 crédits free)
        async dailyRewards(userId) {
            try {

                const user = await User.findOne({ where: { id: userId } });
                const own = await Own.findOne({ where: { id_user: userId, id_money: 2 } });
                if (!own) {
                    throw new ValidationError({ own: 'You do not have any money' });
                }
                const date = new Date();
                //boolean function
                const isTwentyFourHours = (date1, date2) => {
                    const diffTime = Math.abs(date2 - date1);
                    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
                    return diffHours >= 24;
                }
                if (!user.lastDailyRewardDate || isTwentyFourHours(user.lastDailyRewardDate, date)) {
                    own.amount += 100;
                    await own.save();
                    user.lastDailyRewardDate = date;
                    await user.save();
                } else {
                    throw new ValidationError({ dailyReward: 'You have already claimed your daily reward' });
                }
            } catch (e) {
                if (e instanceof Sequelize.ValidationError) {
                    throw ValidationError.fromSequelizeValidationError(e);
                }
            }
        },

        async buyPremiumMoney(userId, articleId) {
            const own = await Own.findOne({ where: { id_user: userId, id_money: 1 } });
            const article = await Article.findOne({ where: { id: articleId, id_money: 3 } });
            if (!article) {
                throw new ValidationError({ article: 'Article not found' });
            }

            const paymentIntent = await stripe.paymentIntents.create({
                amount: article.euros * 100,
                currency: 'eur',
                description: article.libelle,
                payment_method_types: ['card']
            });

            if (paymentIntent) {
                own.amount += article.price;
                await own.save();
            }

            return {
                clientSecret: paymentIntent.client_secret
            }
        }
    };
};