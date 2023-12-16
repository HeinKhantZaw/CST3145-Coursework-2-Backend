let express = require("express");
let api = express.Router();
const {getClient} = require("../db_util");
const cors = require("cors");
const {ObjectId} = require("mongodb");

api.use(cors());
const connectDB = async (req, res, next) => {
    try {
        req.dbClient = getClient();
        next();
    } catch (error) {
        console.log(error);
    }
};
const closeDB = async (req, res, next) => {
    try {
        await req.dbClient.close();
        next();
    } catch (error) {
        console.log(error)
    }
};

api.use(express.json());
// get all lessons
api.get("/lessons", connectDB, async (req, res, next) => {
    try {
        const collection = req.dbClient.db("CST3145").collection("Lessons");
        const results = await collection.find().toArray();
        res.json(results);
    } catch (e) {
        next(e);
    }
}, closeDB);

// post order
api.post("/order", connectDB, async (req, res, next) => {
    try {
        const collection = req.dbClient.db("CST3145").collection("Orders");
        const order = req.body;
        const results = await collection.insertOne({order});
        res.json(results);
    } catch (e) {
        next(e);
    }
}, closeDB);

// update lessons
api.put("/lessons/:id", connectDB, async (req, res, next) => {
    try {
        const lessonId = req.params.id; // Extract lesson ID from the URL parameter
        const spaces = req.body.Spaces; // Extract the updated spaces from the request body
        const collection = req.dbClient.db("CST3145").collection("Lessons");

        // Update the lesson's available spaces based on its _id
        const result = await collection.updateOne(
            {_id: new ObjectId(lessonId)},
            {$set: {Spaces: spaces}}
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({message: "Lesson not found"});
        } else if (result.modifiedCount === 0) {
            return res.status(304).json({message: "Lesson not updated"});
        }
        res.json({message: "Spaces updated successfully"});
    } catch (e) {
        console.error("Error updating spaces:", e);
        res.status(500).json({message: "Error updating spaces", error: e});
    } finally {
        next();
    }
});

// search and sort lessons
api.get("/search", connectDB, async (req, res, next) => {
    try {
        const collection = req.dbClient.db("CST3145").collection("Lessons");

        // search query
        const search = req.query.query || "";
        const searchQuery = search ? {
            $or: [
                {'Subject': {$regex: search, $options: "i"}},
                {'Location': {$regex: search, $options: "i"}}
            ]
        } : {};

        // sort query
        const sortBy = req.query.sortBy || "";
        const sortOrder = req.query.sortOrder === "dsc" ? -1 : 1;
        const sortQuery = sortBy && sortOrder ? {[sortBy]: sortOrder} : {};

        const results = await collection.find(searchQuery).sort(sortQuery).toArray();
        res.json(results);
    } catch (e) {
        next(e);
    }
}, closeDB);

module.exports = api
