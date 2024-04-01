const AuthModel = require('../Models/AuthModel');

const AuthController = require("../Controllers/AuthController")
const { json } = require('express');
const BookModel = require('../Models/BookModel');

let GetUserById = async (userID) => {
    return await AuthModel.findOne({ _id: userID })
}
let GetUserByID = async (req,res,next) => {
    let id=req.params.id
 let user= await AuthModel.findOne({ _id: id })
 res.send(user)
}

let GetUserData = async (req, res, next) => {

    let userID = await AuthController.decodeToken(req, res)

    let user = await GetUserById(userID)

    res.send({
        name: user.name,
        email: user.email,
        favourite: user.favourite,
        purchased: user.purchased,
        image:user.image
    })
}


let AddToFavourites = async (req, res, next) => {
    let bookId = req.body.bookId
    let userID = await AuthController.decodeToken(req, res)
    if (userID) {
        let user = await GetUserById(userID)
        let Book = await BookModel.findOne({ _id: bookId }, { title: 1, price: 1, authors: 1, pageCount: 1, thumbnailUrl: 1, _id: 1 })
        user.favourite.push(Book)
        await user.save()
        res.send({ message: "Added To Favourites" })
    } else {
        res.send({ message: "user not logged in" })
    }
}
let favNumbers = async (req, res, next) => {

    let userID = await AuthController.decodeToken(req, res)
    let favLength=0;
    if (userID) {
        let user = await GetUserById(userID)
        favLength=user.favourite.length;
        
        res.send({ message: "success",data:favLength })
    } else {
        res.send({ message: "cant get length" })
    }
}
let getAllFavs=async(req,res)=>{
    let userID = await AuthController.decodeToken(req, res)
    let favs;
    if (userID) {
        let user = await GetUserById(userID)
        favs=user.favourite;

        res.send({ message: "success",data:favs })
    } else {
        res.send({ message: "cant get favourits" })
    }
}
let RemoveFromFavourites = async (req, res, next) => {
    let { bookId } = req.body

    let userID = await AuthController.decodeToken(req, res)
    if (userID) {
        let user = await GetUserById(userID)
        
        let Book = await BookModel.findOne({ _id: bookId }, { title: 1, price: 1, authors: 1, pageCount: 1, thumbnailUrl: 1, _id: 1 })

        for (let i = 0; i < user.favourite.length; i++) {

            if (JSON.stringify(user.favourite[i]) == JSON.stringify(Book)) {
                user.favourite.splice(i, 1)
                await user.save()
             
                return res.send({ message: "Removed From Favourites" })
            }
        }
    } else {
        return res.send({ message: "user not logged in" })
    }

}

let checkIfFavourite = async (req, res, next) => {
    let { bookId } = req.body
    let userID = await AuthController.decodeToken(req, res)
    if (userID) {
        let user = await GetUserById(userID)
        let Book = await BookModel.findOne({ _id: bookId }, { title: 1, price: 1, authors: 1, pageCount: 1, thumbnailUrl: 1, _id: 0 })

        let found = user.favourite.find((fav, i) => {
            return JSON.stringify(Book) === JSON.stringify(fav)
        })

        if (found) {
            res.send({ favourited: true })

        } else {
            res.send({ favourited: false })

        }
    } else {
        res.send({ message: "user not logged in" })

    }

}
let getAllUser = async (req, res) => {
	let users = await AuthModel.find({});
   
	if (users) {
		res.status(200).json({ message: "success", length: users.length, data: users });
	} else {
		res.status(404).json({ message: 'fail' });
	}
};

module.exports = {

    GetUserData,
    GetUserById,
    AddToFavourites,
    RemoveFromFavourites,
    checkIfFavourite,
    getAllUser,
    favNumbers,
    getAllFavs,
    GetUserByID
}

