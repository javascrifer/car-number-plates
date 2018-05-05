const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const CarPlateNumber = require('../models/CarPlateNumber');
const transformCarPlateNumber = cpn => ({
  _id: cpn._id,
  number: cpn.number,
  owner: cpn.owner
});

router.get('/', ( req, res ) => {
  CarPlateNumber.find()
    .select("_id number owner")
    .exec()
    .then(carPlateNumbers => {
      res.status(200).json({
        count: carPlateNumbers.length,
        carPlateNumbers: carPlateNumbers.map(cpn => transformCarPlateNumber(cpn))
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post('/', ( req, res ) => {
  const carPlateNumber = new CarPlateNumber({
    _id: new mongoose.Types.ObjectId(),
    number: req.body.number,
    owner: {
      firstName: req.body.owner.firstName,
      lastName: req.body.owner.lastName
    }
  });
  carPlateNumber
    .save()
    .then(cpn => res.status(201).json({
      message: 'Car plate number created successfully',
      carPlateNumber: {
        _id: cpn._id,
        number: cpn.number,
        owner: cpn.owner
      }
    }))
    .catch(e => res.status(500).json({ error: e }));
});

router.get('/:carPlaneNumberId', ( req, res ) => {
  const id = req.params.carPlaneNumberId;
  const notFoundError = { message: 'Car plate number not found' };
  CarPlateNumber.findById(id)
    .select('_id number owner')
    .exec()
    .then(cpn => {
      if ( !cpn ) res.status(404).json(notFoundError);
      res.status(200).json(transformCarPlateNumber(cpn));
    })
    .catch(() => res.status(404).json(notFoundError));
});

router.put("/:carPlaneNumberId", ( req, res ) => {
  const id = req.params.carPlaneNumberId;
  const updatedAttributes = {
    number: req.body.number,
    owner: {
      firstName: req.body.owner.firstName,
      lastName: req.body.owner.lastName
    }
  };
  CarPlateNumber.update({ _id: id }, { $set: updatedAttributes }, { runValidators: true })
    .exec()
    .then(() => res.status(200).json({ message: 'Product updated', }))
    .catch(err => res.status(500).json({ error: err }));
});

router.delete('/:carPlaneNumberId', ( req, res ) => {
  const id = req.params.carPlaneNumberId;
  CarPlateNumber.remove({ _id: id })
    .exec()
    .then(result => result.n
      ? res.status(200).json({ message: 'Product deleted', })
      : res.status(404).json({ message: 'Car plate number not found' })
    )
    .catch(err => res.status(500).json({ error: err }));
});

module.exports = router;