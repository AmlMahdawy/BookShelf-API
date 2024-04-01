const express = require("express");
const router = express.Router();
const UsersController= require("../Controllers/UserController")

router.get("/:id",UsersController.GetUserByID)
router.get("/profile",UsersController.GetUserData)
router.post("/add-favourite",UsersController.AddToFavourites)
router.post("/delete-favourite",UsersController.RemoveFromFavourites)
router.post("/check-favourite",UsersController.checkIfFavourite)
router.get("/favs",UsersController.favNumbers)
router.get("/allfavs",UsersController.getAllFavs)





module.exports = router;
