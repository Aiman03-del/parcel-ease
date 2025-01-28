require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const port = process.env.PORT || 9000;
const app = express();

// Middleware
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", apiLimiter);

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.whalj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).send({ message: "Unauthorized access" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized access" });
    req.user = decoded;
    next();
  });
};
// use verify admin after verifyToken
const verifyAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({ message: "Forbidden access" });
  }
  next();
};

async function run() {
  try {
    const db = client.db("parcelEase");
    const parcelsCollection = db.collection("parcels");
    const usersCollection = db.collection("users");
    const deliveryMenCollection = db.collection("deliveryMen");

    app.post("/users/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const user = req.body;

        if (!email || !user.name || !user.image) {
          return res.status(400).send({ message: "Invalid input data" });
        }

        const query = { email };
        const isExist = await usersCollection.findOne(query);

        if (isExist) {
          const update = {
            $set: {
              name: user.name,
              image: user.image,
              role: user.role || isExist.role,
              timestamp: Date.now(),
            },
          };

          const result = await usersCollection.updateOne(query, update);

          if (result.modifiedCount > 0) {
            return res.send({ message: "User updated successfully", result });
          } else {
            return res.status(500).send({ message: "Failed to update user" });
          }
        }

        const newUser = {
          ...user,
          role: user.role || "user",
          timestamp: Date.now(),
        };
        const result = await usersCollection.insertOne(newUser);

        if (result.insertedId) {
          res.send({ message: "User added successfully", result });
        } else {
          res.status(500).send({ message: "Failed to add user" });
        }
      } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send({ message: "Internal server error", error });
      }
    });

    // Get User by Email API
    app.get("/users/:email", async (req, res) => {
      try {
        const { email } = req.params;
        const user = await usersCollection.findOne({ email });

        if (user) {
          return res.status(200).send(user);
        }

        return res.status(200).send({ message: "User not found" });
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Get All Users API
    app.get("/users", async (req, res) => {
      try {
        const users = await usersCollection.find().toArray();
        res.status(200).send(users);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch users", error });
      }
    });

    // Generate JWT Token
    app.post("/jwt", async (req, res) => {
      try {
        const user = req.body; // ইউজারের তথ্য নিচ্ছে

        if (!user.email) {
          // ইমেইল চেক করা
          return res.status(400).send({ message: "Email is required" });
        }

        // JWT তৈরি
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "1h", // টোকেনের মেয়াদ 1 ঘণ্টা
        });

        res.send({ token }); // সফল রেসপন্স পাঠানো
      } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Logout API
    app.get("/logout", (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // Get All Parcels API
    app.get("/parcels", verifyToken, async (req, res) => {
      try {
        const parcels = await parcelsCollection
          .find({ userId: req.user._id })
          .toArray();
        res.status(200).send(parcels);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch parcels", error });
      }
    });
    // Get Parcel by ID API
    app.get("/parcels/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const parcel = await parcelsCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!parcel) {
          return res.status(404).send({ message: "Parcel not found" });
        }
        res.status(200).send(parcel);
      } catch (error) {
        console.error("Error fetching parcel:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Get Parcels by Email API
    app.get("/parcels/email/:email", verifyToken, async (req, res) => {
      const { email } = req.params;

      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Ensure the requested email matches the logged-in user's email
      if (req.user.email !== email) {
        return res.status(403).json({ error: "Access denied" });
      }

      try {
        const parcels = await parcelsCollection
          .find({ userEmail: email })
          .toArray();
        if (!parcels.length) {
          return res
            .status(404)
            .json({ error: "No parcels found for this email" });
        }

        res.status(200).json(parcels);
      } catch (error) {
        console.error("Error fetching parcels by email:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Book Parcel API
    app.post("/book-parcel", verifyToken, async (req, res) => {
      const {
        phoneNumber,
        parcelType,
        parcelWeight,
        receiverName,
        receiverPhoneNumber,
        deliveryAddress,
        deliveryDate,
        deliveryLatitude,
        deliveryLongitude,
        price,
        senderName, // নতুন ফিল্ড
        assignedTo, // নতুন ফিল্ড
      } = req.body;

      if (
        !phoneNumber ||
        !parcelType ||
        !parcelWeight ||
        !receiverName ||
        !receiverPhoneNumber ||
        !deliveryAddress ||
        !deliveryDate ||
        !deliveryLatitude ||
        !deliveryLongitude ||
        !price ||
        !senderName || // চেক করুন
        !assignedTo // চেক করুন
      ) {
        return res.status(400).send({ message: "All fields are required." });
      }

      const parcel = {
        userId: req.user._id, // User ID from the JWT token
        userEmail: req.user.email, // User email from the JWT token
        phoneNumber,
        parcelType,
        parcelWeight,
        receiverName,
        receiverPhoneNumber,
        deliveryAddress,
        deliveryDate,
        deliveryLatitude,
        deliveryLongitude,
        price,
        senderName, // নতুন ফিল্ড
        assignedTo, // নতুন ফিল্ড
        status: "pending",
        createdAt: new Date(),
      };

      const result = await parcelsCollection.insertOne(parcel);
      res.status(201).send({ success: true, parcelId: result.insertedId });
    });

    // Statistics API
    app.get("/statistics", async (req, res) => {
      const totalParcels = await parcelsCollection.countDocuments();
      const deliveredParcels = await parcelsCollection.countDocuments({
        status: "delivered",
      });
      const totalUsers = await usersCollection.countDocuments();

      res.status(200).send({
        totalParcels,
        deliveredParcels,
        totalUsers,
      });
    });

    // Top Delivery Men API
    app.get("/top-delivery-men", async (req, res) => {
      const topDeliveryMen = await deliveryMenCollection
        .aggregate([
          {
            $lookup: {
              from: "parcels",
              localField: "_id",
              foreignField: "deliveryManId",
              as: "parcels",
            },
          },
          {
            $addFields: {
              deliveredParcels: { $size: "$parcels" },
              averageRating: { $avg: "$parcels.rating" },
            },
          },
          { $sort: { deliveredParcels: -1, averageRating: -1 } },
          { $limit: 3 },
        ])
        .toArray();

      res.status(200).send(topDeliveryMen);
    });
    app.patch("/parcels/:id", verifyToken, async (req, res) => {
      const { id } = req.params;
      const updatedParcel = req.body;

      // চেক করুন পার্সেলটি ডাটাবেজে আছে কিনা
      const existingParcel = await parcelsCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!existingParcel) {
        return res.status(404).send({ message: "Parcel not found" });
      }

      // স্ট্যাটাস চেক করুন
      if (existingParcel.status !== "pending") {
        return res.status(403).send({
          message: "Parcel status is not 'pending', update is not allowed",
        });
      }

      try {
        const result = await parcelsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedParcel }
        );

        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .send({ message: "Parcel not found or no changes" });
        }

        res.status(200).send({ message: "Parcel updated successfully" });
      } catch (error) {
        console.error("Error updating parcel:", error);
        res.status(500).send({ message: "Failed to update parcel", error });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    // Optional: Keep MongoDB client open for better performance
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from ParcelEase Server..");
});

app.listen(port, () => {
  console.log(`ParcelEase is running on port ${port}`);
});

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.whalj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
