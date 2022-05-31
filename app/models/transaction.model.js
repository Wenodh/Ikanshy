module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define('transactions', {
        amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        from: { type: Sequelize.STRING, allowNull: false },
        to: { type: Sequelize.STRING, allowNull: false },
        type: { type: Sequelize.STRING, allowNull: false },
    });
    return Transaction;
};
