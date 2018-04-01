#!/bin/bash

echo 'Enter partner user id and press [ENTER]'
read userid
echo 'Enter partner user secret and press [ENTER]'
read usersecret

cat <<EOF > credentials.json
{
    "partnerUserID": "${userid}",
    "partnerUserSecret": "${usersecret}"
}
EOF