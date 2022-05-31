module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        username: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        balance: {
            type: Sequelize.INTEGER,
            defaultValue: 1000,
        },
    });
    return User;
};
