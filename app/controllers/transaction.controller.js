const db = require('../models');
const config = require('../config/auth.config');
const User = db.user;
const Role = db.role;
const Transaction = db.transaction;
const Op = db.Sequelize.Op;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

// To add money into user and create transaction
exports.credit = (req, res) => {
    User.findByPk(req.userId).then((user) => {
        if (!user) {
            return res.status(404).send({ message: 'User Not found.' });
        }
        if (user.balance < req.body.amount) {
            return res.status(404).send({ message: 'Insufficient balance.' });
        }
        User.findByPk(req.params.toId).then((toUser) => {
            if (!toUser) {
                return res.status(404).send({ message: 'User Not found.' });
            }
            if (toUser.id === req.userId) {
                return res

                    .status(404)
                    .send({ message: 'You cannot transfer to yourself.' });
            }
            Transaction.create({
                from: req.userId,
                to: req.params.toId,
                amount: req.body.amount,
                type: 'debit',
            })
                .then((transaction) => {
                    User.findByPk(req.userId).then((user) => {
                        user.balance = user.balance - req.body.amount;
                        user.save();
                    });
                    User.findByPk(req.params.toId).then((user) => {
                        user.balance = user.balance + req.body.amount;
                        user.save();
                    });
                    res.send({
                        message: 'Transaction was created successfully!',
                    });
                })
                .catch((err) => {
                    res.status(500).send({ message: err.message });
                });
        });
    });
};

// let remainingAmount = user.balance - req.body.amount;
// User.update(
//     {
//         balance: remainingAmount,
//     },
//     {
//         where: {
//             id: req.params.toId,
//         },
//     }
// );
//             Transaction.create({
//                 from: req.userId,
//                 to: req.params.toId,
//                 amount: req.body.amount,
//                 type: 'debit',
//             }).then((transaction) => {
//                 res.send({
//                     message: 'Transaction was created successfully!',
//                 });
//             });
//         })
//         .catch((err) => {
//             res.status(500).send({ message: err.message });
//         });
// };
exports.debit = (req, res) => {
    User.findByPk(req.params.toId)
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: 'User Not found.' });
            }
            let creditAmount = req.body.amount + user.balance;
            User.update(
                {
                    balance: creditAmount,
                },
                {
                    where: {
                        id: req.params.toId,
                    },
                }
            );
            Transaction.create({
                from: req.userId,
                to: req.params.toId,
                amount: req.body.amount,
                type: 'debit',
            }).then((transaction) => {
                res.send({
                    message: 'Transaction was created successfully!',
                });
            });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};
//check balance
exports.balance = (req, res) => {
    User.findByPk(req.userId)
        .then((user) => {
            res.send({
                message: 'Available balance is ' + user.balance,
            });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};
