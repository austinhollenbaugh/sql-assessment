-- changes the ownership of the provided vehicle to be the new user.
-- api/vehicle/:vehicleId/user/:userId
select * from vehicles
where id = $1;
