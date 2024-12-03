const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
    },
    price: {
      required: true,
      type: Number,
    },
    quantity: {
      required: true,
      type: Number,
    },
    description: {
      required: true,
      type: String,
    },
    priceAfterDiscount: {
      type: Number,
    },
    imgCover: {
      type: String,
      required:[true, "Product image is required."],
    }
  },
  { timestamps: true}
);



productSchema.post("save", function (doc) {
  console.log("doc", doc); // product info // imgCover => filename
  if (doc.imgCover) {
    const imgUrl = `${process.env.BASE_URL}/products/${doc.imgCover}`;
    doc.imgCover = imgUrl;
    console.log(imgUrl);
  }
  if (doc.images) {
    doc.images = doc.images.map((image) => {
      return `${process.env.BASE_URL}/products/${image}`;
    });
  }
});

// findOne , findAll , Update
productSchema.post("init", function (doc) {
  if (doc.imgCover) {
    const imgUrl = `${process.env.BASE_URL}/products/${doc.imgCover}`;
    doc.imgCover = imgUrl;
  }
  if (doc.images) {
    doc.images = doc.images.map((image) => {
      return `${process.env.BASE_URL}/products/${image}`;
    });
  }
});

const Product = mongoose.model("Product", productSchema);
module.exports = {Product };
