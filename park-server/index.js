const express = require('express');
const sequelize = require('./db')
const models = require('./models/models')
const Port = 5000;
const cors = require('cors');
const router = require('./routes/index')
const errorHandler = require('./middleware/errorHandlingMiddleware')

const app = express();
app.use(cors())
app.use(express.json())
app.use('/api', router)



app.use(errorHandler)
const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(Port, () => console.log(`server started on port ${Port}`))
    } catch (e) {
        console.log(e);
    }
}

start()