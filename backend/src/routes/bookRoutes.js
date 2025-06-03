import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    console.log(image);
    
    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }

    // upload the image to cloudinary
    const uploadRes = await cloudinary.uploader.upload(image);
    const imageUrl = uploadRes.secure_url;
    // save to the database

    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    console.log("Error creating book", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username  profileImage");

    const totalBooks = await Book.find().countDocuments();
    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error fetching books", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/user", protectRoute, async (req, res) => {
    try {
        const books = await Book.find({user : req.user._id}).sort({createdAt : -1});
        res.json(books);
    } catch (error) {
        console.error("Error fetching user books", error);
        res.status(500).json({error : "Internal Server Error"});
    }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // check if user is the creator of the book
    if (book.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this book" });
    }
    if(book.image && book.image.includes("cloudinary")){
        try {
            const publicId = book.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        } catch (deleteError) {
            console.log("Error deleting image", deleteError);
        }
    }
    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
     
  }
});

export default router;
