UPDATE vehicles SET ownerid IS null
WHERE id = $1;
