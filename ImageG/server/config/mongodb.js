// import mongoose from "mongoose";
// const connectDB=async () =>{
//     console.log('before')
//     mongoose.connection.openUri('connected',()=>{
//         console.log("dtata connected success")
//     })
//     console.log(process.env.MONGO_URL)
//     await mongoose.connect(`${process.env.MONGO_URL}/ImageG`)
// }
// export default connectDB
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        
        // Add proper event listeners
        mongoose.connection.on('connected', () => {
            console.log("Database connected successfully");
        });

        mongoose.connection.on('error', (err) => {
            console.log('Database connection error:', err);
        });

        // Make sure your MONGO_URL environment variable is properly set
        if (!process.env.MONGO_URL) {
            throw new Error('MONGO_URL environment variable is not defined');
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL + 'ImageZ');
        
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
};

export default connectDB;