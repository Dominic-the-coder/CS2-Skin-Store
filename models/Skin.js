const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Skin = sequelize.define('Skin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rarity: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    exterior: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'skins',
    timestamps: true
});

module.exports = Skin;
