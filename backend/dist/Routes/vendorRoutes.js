"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vendorController_1 = __importDefault(require("../Controller/vendorController"));
const vendorTypeController_1 = __importDefault(require("../Controller/vendorTypeController"));
const postController_1 = __importDefault(require("../Controller/postController"));
const multer_1 = __importDefault(require("multer"));
const bookingController_1 = __importDefault(require("../Controller/bookingController"));
const VendorAuth_1 = __importDefault(require("../Middleware/VendorAuth"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.post('/signup', vendorController_1.default.vendorSignup);
router.post('/verifyotp', vendorController_1.default.verifyOtp);
router.post('/login', vendorController_1.default.VendorLogin);
router.get('/logout', vendorController_1.default.VendorLogout);
router.get('/resendOtp', vendorController_1.default.resendOtp);
router.post('/refresh-token', vendorController_1.default.createRefreshToken);
router.get('/vendor-types', vendorTypeController_1.default.getVendorTypes);
router.post('/vgetotp', vendorController_1.default.VendorForgotPassword);
router.post('/verifyVendorotp', vendorController_1.default.VerifyOtpForPassword);
router.post('/resetVendorPassword', vendorController_1.default.ResetVendorPassword);
router.get('/getvendors', vendorController_1.default.getAllVendors);
router.get('/getVendor', vendorController_1.default.getVendor);
router.patch('/updateProfilePassword', VendorAuth_1.default, vendorController_1.default.UpdateProfilePassword);
router.post('/add-post', upload.single('image'), VendorAuth_1.default, postController_1.default.addNewPost);
router.get('/posts', postController_1.default.getPosts);
router.delete('/posts/:id', VendorAuth_1.default, postController_1.default.deletePost);
router.put('/updateProfile', VendorAuth_1.default, upload.fields([{ name: 'coverpic', maxCount: 1 }, { name: 'logo', maxCount: 1 }]), vendorController_1.default.updateProfiledetails);
router.put('/add-review-reply', VendorAuth_1.default, vendorController_1.default.addReviewReply);
router.get('/booking-details', VendorAuth_1.default, bookingController_1.default.getAllBookingsbyvendor);
router.get('/single-booking-details', VendorAuth_1.default, bookingController_1.default.getBookingsById);
router.put('/update-booking-status', VendorAuth_1.default, bookingController_1.default.updateStatus);
router.get('/getallBookings', VendorAuth_1.default, bookingController_1.default.getallBookings);
router.post('/verification-request', VendorAuth_1.default, vendorController_1.default.sendVerifyRequest);
router.patch('/MarkAsRead', VendorAuth_1.default, vendorController_1.default.MarkasRead);
router.patch('/ClearAll', VendorAuth_1.default, vendorController_1.default.clearAllNotifications);
router.get("/revenue", vendorController_1.default.getRevenue);
exports.default = router;