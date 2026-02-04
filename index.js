const express = require('express');
const sequelize = require('./database');

const UserRoutes = require('./routes/userRoutes');
const SkinRoutes = require('./routes/skinRoutes');
const OrderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(express.json());

app.use('/users', UserRoutes);
app.use('/skins', SkinRoutes);
app.use('/orders', OrderRoutes);

(async () => {
    try {
        await sequelize.sync({ alter: true }); // sync models with DB
        console.log("All tables synced successfully.");
        
        app.listen(3000, () => {
            console.log("Server running on http://localhost:3000");
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();
