const express = require('express');
const router = express.Router();

var pool = require('../../db').pool;
const bcrypt = require('bcrypt');
const {
  check,
  validationResult
} = require('express-validator');
const auth = require('../../middleware/auth');

let User = require('../../models/User').User;
let Login = require('../../models/Login').Login;
let Listing = require('../../models/Listing').Listing;

// @route Post marketplace/users
// @desc Route to create lisiting for user
// Needs an item object and a user id
// Assuming the parameter is the item id and we can pull the user id from the current session information
// @access private
router.post('/create', async (req, res) => {
  //console.log('current create req \n', req.body.item)
  try {
    //assumes req.body.item is the created object item
    var newItem = {
      item_name: req.body.item.name,
      item_desc: req.body.item.description,
      image: req.body.item.image,
    };
    const createdItemId = await Item.createItem([newItem], res);
    /*
      Still need to implement the check if it is a sale,rental,loan
    */
    const newListing = {
      item_id: createdItemId,
      return_by: req.body.item.date,
      policy: req.body.item.policy,
      total_price: req.body.item.price,
      rent_amount: req.body.rent_amount,
      //insurance_amount: req.body.insurance_amount,
      lender_id: req.user.id,
    };
    console.log('created Itemid is', newListing.item_id);
    if (req.body.item.option === 'sale') {
      const createdSale = await Listing.createSaleListing([newListing], res);
      console.log('created sale listing is \n ', createdSale);
      res.status(200).json(createdSale);
    }
    if (req.body.item.option === 'loan') {
      const createdLoan = await Listing.createLoanListing([newListing], res);
      console.log('created loan listing is \n', createdLoan);
      res.status(200).json(createdLoan);
    }
    if (req.body.item.option === 'rental') {
      const createdRental = await Listing.createRentalListing(
        [newListing],
        res
      );
      console.log('created rental listing is \n', createdRental);
      res.status(200).json(createdRental);
    }
  } catch (error) {
    console.error('error creating to marketplace \n', error);
  }
  console.log('called post request for create at market');
});

//Gets a listing matching the passed listing id
router.get('/:listingid', async (req, res, next) => {
  console.log(req.params.listingid);
  if (!Number.isInteger(req.params.listingid)) {
    console.log('not a number');
    next();
  } else {
    try {
      const listing = await Listing.getListingByListingID(
        [req.params.listingid],
        res
      );
      console.log('listing result', listing);
      res.status(200).json(listing);
    } catch (error) {
      console.error('error retrieving listing by id \n', error);
    }
    console.log('called get listing request by listing id', req.params);
  }
});

//Borrows a listing
router.get('/:listingid/borrow', async (req, res) => {
  console.log(req.params.listingid);
  try {
    var ids = {
      user_id: req.user.id,
      listing_id: req.params.listingid,
    };
    const listing = await Listing.addBorrower([ids], res);
    console.log('borrowing listing', listing);
    res.status(200).json(listing);
  } catch (error) {
    console.error('error marking listing as borrowed \n ', error);
  }
  console.log('called borrow listing by listing id');
});

//Cancels borrowing a listing in case a user decides to change their mind
router.get('/:listingid/borrow/cancel', async (req, res) => {
  console.log(req.params.listingid);
  try {
    const listing = await Listing.removeBorrower([req.params.listingid], res);
    console.log('unborrowing listing', listing);
    res.status(200).json(listing);
  } catch (error) {
    console.error('error freeing a listing from borrowed \n ', error);
  }
  console.log('called borrow listing by listing id');
});

//Marks a listing as reserved so only one person can see it
router.get('/:listingid/reserve', async (req, res) => {
  console.log(req.params.listingid);
  try {
    const listing = await Listing.reserveListing([req.params.listingid], res);
    console.log('reserving listing', listing);
    res.status(200).json(listing);
  } catch (error) {
    console.error('error reserving listing by id \n ', error);
  }
  console.log('called reserve listing by listing id');
});

//Frees a reserved listing so others can click on it
router.get('/:listingid/unreserve', async (req, res) => {
  console.log(req.params.listingid);
  try {
    const listing = await Listing.unreserveListing([req.params.listingid], res);
    console.log('reserving listing', listing);
    res.status(200).json(listing);
  } catch (error) {
    console.error('error unreserving listing by id \n', error);
  }
  console.log('called unreserve listing by listing id');
});

//Gets all active listings
router.get('/active', async (req, res) => {
  try {
    const activelistings = await Listing.getAllActiveListings(req, res);
    res.status(200).json(activelistings);
  } catch (error) {
    console.error('error getting all active listings \n', error);
  }
  console.log('called get active listings');
});

//Gets all listings
router.get('/', async (req, res) => {
  try {
    const alllistings = await Listing.getEveryListing(req, res);
    res.status(200).json(alllistings);
  } catch (error) {
    console.error('error getting all listings\n', error);
  }
  console.log('called get all listings');
});

//Gets all listings with user id as the borrower
//Looks for req.user.id as a param
router.get('/borrowed', async (req, res) => {
  try {
    console.log('getting all borrowed items \n', req.app.locals.user[0]);
    const alllistings = await Listing.getAllBorrowerListings(
      req.app.locals.user[0].id,
      res
    );
    console.log('all borrowed listing \n', alllistings);
    res.status(200).json(alllistings);
  } catch (error) {
    console.error('error getting all borrowed listings \n ', error);
  }
  console.log('called get all listings with borrower id');
});

//Gets all listing that have the user id as a lender
//Look for req.user.id as a param
router.get('/listed', async (req, res) => {
  try {
    console.log('getting all listed items \n', req.app.locals.user[0]);
    const alllistings = await Listing.getAllLenderListings(
      req.app.locals.user[0].id,
      res
    );
    res.status(200).json(alllistings);
  } catch (error) {
    console.error('error getting all listed listings', error);
  }
  console.log('called get all listings with lender id');
});

//example;
const item = [{
    id: 1,
    name: 'Ball',
    cost: 2.3,
    policy: 'if lost owe me $',
  },
  {
    id: 2,
    name: 'Ball',
    cost: 2.3,
    policy: 'if lost owe me $',
  },
  {
    id: 3,
    name: 'Ball',
    cost: 2.3,
    policy: 'if lost owe me $',
  },
];

// // @route Get marketplace/users
// // @desc Route to get item from user
// // @access private
// router.get('/', (req, res) => {
//   res.json(item);
// });

module.exports = router;