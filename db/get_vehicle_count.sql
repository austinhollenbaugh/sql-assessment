-- will return a count of how many vehicles belong to the given user
-- SELECT COUNT(*) FROM friends_of_pickles;

select count(*) from vehicles
where ownerid = $1;
