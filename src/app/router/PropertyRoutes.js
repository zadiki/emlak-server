import express from "express";
import * as categoryController from "../controllers/CategoryController";
import * as propertyController from "../controllers/PropertyController";

const router = express.Router();

router.get("/allproperties",propertyController.allProperties)
router.get("/propertydetails/:id", propertyController.getPropertypage);
router.post("/propertycategory", categoryController.addCategory);
router.post("/propertytype", categoryController.addCategoryType);
router.post("/postanAdvert", propertyController.addpropertymiddleware, propertyController.addproperty);
router.get("/propertycategory/:category", propertyController.propertyBycategoryPage);
router.get("/property-search", propertyController.propertyByQueryPage);
router.post("/property-search", propertyController.propertySearch);
router.post("/propertyupdate", propertyController.updateproperty);
router.delete("/propertyimageupdate", propertyController.deletepropertyImage);
router.post("/propertyimageupdate", propertyController.updatepropertyImageMiddleware, propertyController.updatepropertyImage);


export default router;