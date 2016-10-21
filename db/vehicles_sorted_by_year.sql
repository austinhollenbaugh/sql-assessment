--gets all vehicles newer than 2000 and sorted by year with the newest car first with the owner first and last name

select * from vehicles
JOIN users ON (users.id = vehicles.ownerId)
where year > 2000
ORDER BY year DESC;
