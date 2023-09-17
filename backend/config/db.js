const mongoose = require('mongoose');

let MONGO_URI = '';
let MONGO_ENV = '';

if (process.env.NODE_ENV === 'production') {
    MONGO_URI = process.env.MONGO_URI || '';
    MONGO_ENV = process.env.MONGO_ENV || '';
} else {
    MONGO_URI = process.env.MONGO_DEV_URI || 'mongodb://localhost:27017/csm-dev';
    MONGO_ENV = process.env.MONGO_DEV_URI ? (process.env.MONGO_DEV_ENV || '') : 'local';
}


mongoose.connect(MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log(`⚡[server][MongoDB-${MONGO_ENV}] Database connected`))
    .catch(err => {
        console.error(`⚡[server][MongoDB-${MONGO_ENV}] Database connection failed: ${err.message}`);
        process.exit(1);
    });

mongoose.connection.on('disconnected', () => console.log(`[server][MongoDB-${MONGO_ENV}] Database disconnected`));

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

