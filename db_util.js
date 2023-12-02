const { MongoClient } = require("mongodb");
const ATLAS_CONNECTION_URL = "mongodb+srv://admin:mcoMSVq04xnGziwn@cluster0.iss3nt5.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(ATLAS_CONNECTION_URL);

const init = async () => {
    try {
        await client.connect();
    } catch (error) {
        console.log(error);
    }
    const database = client.db("CST3145");
}
const getClient = () => {
    return client;
};

module.exports.init = init;
module.exports.getClient = getClient;
