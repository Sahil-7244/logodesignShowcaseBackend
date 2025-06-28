const multer = require("multer");
const cloudinary = require("../cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");


// Cloudinary storage for different types of images
const productPicStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "productImages", // Folder name in Cloudinary
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

const bannerPicStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "bannerImages",
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

const servicePicStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "serviceImages",
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

const carouselPicStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "carouselImages",
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

const teamPicStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "teamImages",
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

// Initialize multer with the respective storages
const productPicUpload = multer({ storage: productPicStorage });
const bannerPicUpload = multer({ storage: bannerPicStorage });
const servicePicUpload = multer({ storage: servicePicStorage });
const carouselPicUpload = multer({ storage: carouselPicStorage });
const teamPicUpload = multer({ storage: teamPicStorage });

module.exports = { productPicUpload, bannerPicUpload, servicePicUpload, carouselPicUpload, teamPicUpload }
/*
const multer = require("multer");

//product pic storage
const productPicStorage = multer.diskStorage({

    //path to store the product
    destination: (req, file, cb) => {
        cb(null, "D:/JV Graphics/jvgraphicsbackend/images/productImages");
    },

    //filename to give to the product
    filename: (req, file, cb) => {
        cb(null, ${Date.now()}-${file.originalname});
    }

});

const productPicUpload = multer({ storage: productPicStorage });

//banner pic storage
const bannerPicStorage = multer.diskStorage({

    //path to store the banner
    destination: (req, file, cb) => {
        cb(null, "D:/JV Graphics/jvgraphicsbackend/images/bannerImages");
    },

    //filename to give to the banner
    filename: (req, file, cb) => {
        cb(null, ${Date.now()}-${file.originalname});
    }

});

const bannerPicUpload = multer({ storage: bannerPicStorage });

//category pic storage
const servicePicStorage = multer.diskStorage({

    //path to store the category
    destination: (req, file, cb) => {
        cb(null, "D:/JV Graphics/jvgraphicsbackend/images/serviceImages");
    },

    //filename to give to the category
    filename: (req, file, cb) => {
        cb(null, ${Date.now()}-${file.originalname});
    }

});

const servicePicUpload = multer({ storage: servicePicStorage });

//carousel pic storage
const carouselPicStorage = multer.diskStorage({

    //path to store the carousel
    destination: (req, file, cb) => {
        cb(null, "D:/JV Graphics/jvgraphicsbackend/images/carouselImages");
    },

    //filename to give to the carousel
    filename: (req, file, cb) => {
        cb(null, ${Date.now()}-${file.originalname});
    }

});

const carouselPicUpload = multer({ storage: carouselPicStorage });

//team pic storage
const teamPicStorage = multer.diskStorage({

    //path to store the team pic
    destination: (req, file, cb) => {
        cb(null, "D:/JV Graphics/jvgraphicsbackend/images/teamImages");
    },

    //filename to give to the team pic
    filename: (req, file, cb) => {
        cb(null, ${Date.now()}-${file.originalname});
    }

});

const teamPicUpload = multer({ storage: teamPicStorage });

module.exports = { productPicUpload, bannerPicUpload, servicePicUpload, carouselPicUpload, teamPicUpload }
*/