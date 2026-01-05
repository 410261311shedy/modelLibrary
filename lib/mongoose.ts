// for always have access to our MongoDB DB without 
//having to reestablish cconnection upon every server action call
import mongoose,{ Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI){
    throw new Error("MONGODB_URI is not defined");
}
//cache the connection 

interface MongooseCache {
    conn:Mongoose | null;
    promise:Promise<Mongoose> | null;
}

//declare the connection once and maintains that single instance of connection
//avoid multiple calling the connection
declare global {
    var mongoose:MongooseCache;
}

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = {conn:null, promise:null};
}

const dbConnect = async (): Promise<Mongoose> => {
    //if there's already a connection exist
    if(cached.conn) {
        return cached.conn;
    }
    //if there's no connection, create a new promise for connecting the db
    if(!cached.promise){
        cached.promise = mongoose
        .connect(MONGODB_URI,{dbName:"ModelLibrary"})
        .then((result)=>{
            console.log("Connected to MongoDB");
            return result;
        })
        .catch((error)=>{
            console.error("Error connecting to MongoDB",error);
            throw error;
        });
    }
    //wait for the cached.promise result
    cached.conn = await cached.promise;

    return cached.conn;
}
export default dbConnect;