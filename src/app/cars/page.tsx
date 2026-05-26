import React from "react";
import dbConnect from "@/lib/mongodb";
import Car from "@/models/Car";
import CarsClientUI from "./CarsClientUI";

export default async function FleetPage(){
  await dbConnect();

  const cars = await Car.find({isAvailable: true}).lean();

  const serializedCars = cars.map(car =>({
    ...car,
    _id : car._id.toString(),
  }));

  return <CarsClientUI initialCars={serializedCars} />;
}