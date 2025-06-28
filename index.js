const express = require('express')
const cors = require("cors");
const connectDB = require('./db/dbConnect');
const { SignUp } = require('./apis/user/signup');
const Session = require('./apis/session');
const session = require('express-session');
const { productPicUpload, bannerPicUpload, servicePicUpload, carouselPicUpload, teamPicUpload } = require('./multer/multer');
const { AddProduct } = require('./apis/admin/addProducts');
const { Login } = require('./apis/user/login');
const { GetProducts } = require('./apis/user/getProducts');
const { GetOneProduct } = require('./apis/user/getOneProduct');
const { AddBanner } = require('./apis/admin/addBanner');
const { GetBanner } = require('./apis/user/getBanner');
const { AddEnquiry } = require('./apis/user/addEnquiry');
const { SearchProduct } = require('./apis/user/searchProduct');
const { EditProduct } = require('./apis/admin/editProduct');
const { DeleteProduct } = require('./apis/admin/deleteProduct');
const { EditBanner } = require('./apis/admin/editBanner');
const { DeleteBanner } = require('./apis/admin/deleteBanner');
const { GetEquiries } = require('./apis/admin/getEnquiries');
const { ContactUs } = require('./apis/user/contactUs');
const { GetContactUs } = require('./apis/admin/getContactUs');
const Logout = require('./apis/logout');
const { GetCounts } = require('./apis/admin/getCounts');
const { AddServiceImg } = require('./apis/admin/addServiceImg');
const { ViewServiceImg } = require('./apis/user/getServiceImg');
const { DeleteServiceImage } = require('./apis/admin/deleteServiceimg');
const { GetProductsByCategory } = require('./apis/user/getProductByCategory');
const { EditServiceImg } = require('./apis/admin/editServiceImg');
const { EditContactDetail } = require('./apis/admin/editContactDetail');
const { GetContactDetail } = require('./apis/user/getContactDetails');
const { AddServicebgBanner } = require('./apis/admin/addServicebgBanner');
const { EditServicebgBanner } = require('./apis/admin/editServicebgBanner');
const { DeleteServicebgBanner } = require('./apis/admin/deleteServicebgBanner');
const { ViewServicebgBanner } = require('./apis/user/getServicebgbanner');
const { AddCarouselImg } = require('./apis/admin/addcarouselimg');
const { EditCarouselImg } = require('./apis/admin/editCarouselimg');
const { DeleteCarouselImg } = require('./apis/admin/deletecarouselimg');
const { ViewCarouselImg } = require('./apis/user/getcarouselImg');
const { AddTeam } = require('./apis/admin/addTeam');
const { EditTeam } = require('./apis/admin/editteam');
const { DeleteTeam } = require('./apis/admin/deleteTeam');
const { ViewTeam } = require('./apis/user/getTeam');
const { AddExperience } = require('./apis/admin/addExperience');
const { EditExperience } = require('./apis/admin/editExperience');
const { DeleteExperience } = require('./apis/admin/deleteExperience');
const { GetExperience } = require('./apis/user/getexperience');
const { SendMail } = require('./apis/user/sendmail');

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(
    cors({
        origin: ["https://logodesignshowcaseadminwebsite.onrender.com", "https://logodesignshowcaseuserwebsite.onrender.com","http://localhost:3001", "http://localhost:3002", "http://localhost:3000"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

// app.use("/images/productImage", express.static("images/productImages"));
// app.use("/images/bannerImage", express.static("images/bannerImages"));
// app.use("/images/serviceImage", express.static("images/serviceImages"));
// app.use("/images/carouselImage", express.static("images/carouselImages"));
// app.use("/images/teamImage", express.static("images/teamImages"));

//!Admin APIs
app.post('/admin/addexperience',AddExperience);
app.post('/admin/editexperience',EditExperience);
app.post('/admin/deleteexperience',DeleteExperience);
app.post('/admin/addteam',teamPicUpload.single('teammemberImage'),AddTeam);
app.post('/admin/editteam',teamPicUpload.single('teammemberImage'),EditTeam);
app.post('/admin/deleteteam',DeleteTeam);
app.post('/admin/addCarouselImg', carouselPicUpload.single('carouselImage'), AddCarouselImg);
app.post('/admin/editCarouselImg', carouselPicUpload.single('carouselImage'), EditCarouselImg);
app.post('/admin/deleteCarouselImg', DeleteCarouselImg);
app.post('/admin/addProducts', productPicUpload.single('productImage'), AddProduct);
app.post('/admin/editProducts', productPicUpload.single('productImage'), EditProduct);
app.post('/admin/deleteProducts', DeleteProduct);
app.post('/admin/addBanner', bannerPicUpload.single('bannerImg'), AddBanner);
app.post('/admin/editBanner', bannerPicUpload.single('bannerImg'), EditBanner);
app.post('/admin/deleteBanner', DeleteBanner);
app.post('/admin/getEnquiries', GetEquiries);
app.post('/admin/getContactUs', GetContactUs);
app.post('/admin/getCounts', GetCounts);
app.post('/admin/AddServiceImg', servicePicUpload.single('serviceImage'), AddServiceImg);
app.post('/admin/editServiceImg', servicePicUpload.single('serviceImage'), EditServiceImg);
app.post('/admin/deleteserviceImg', DeleteServiceImage);
app.post('/admin/AddServicebgbanner', servicePicUpload.single('servicebgImage'), AddServicebgBanner);
app.post('/admin/editServicebgImg', servicePicUpload.single('servicebgImage'), EditServicebgBanner);
app.post('/admin/deleteservicebgbanner', DeleteServicebgBanner);
app.post('/admin/editContact', EditContactDetail);

//!User APIs
app.post('/user/login', Login);
app.post('/user/signup', SignUp);
app.post('/user/sendmail', SendMail);
app.get('/viewCarouselImg', ViewCarouselImg);
app.get('/viewTeam', ViewTeam);
app.post('/viewServiceImg', ViewServiceImg);
app.post('/viewServicebgImg', ViewServicebgBanner);
app.get('/user/getProducts', GetProducts);
app.post('/user/getProductByCategory', GetProductsByCategory);
app.post('/user/getOneProduct', GetOneProduct);
app.get('/user/getBanner', GetBanner);
app.post('/user/addEnquiry', AddEnquiry);
app.post('/user/searchProduct', SearchProduct);
app.post('/user/contactUs', ContactUs);
app.post('/user/getContactDetail', GetContactDetail);
app.get('/getexperience', GetExperience);

//!Common APIs
app.post('/session', Session);
app.post('/logout', Logout);


connectDB();

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}!`))