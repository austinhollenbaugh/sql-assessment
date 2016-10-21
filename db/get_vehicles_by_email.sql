SELECT * FROM vehicles
JOIN users ON users.id = vehicles.ownerId
where users.email = $1;
