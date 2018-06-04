#!/bin/bash
echo 'The script needs your login email & password for puppeteer.'
echo 'Enter login email and press [ENTER]'
read email
echo 'Enter login password and press [ENTER]'
read password
echo 'Regenerate API tokens here:'
echo 'https://www.expensify.com/tools/integrations/'
echo ''
echo 'Enter partner user id and press [ENTER]'
read userid
echo 'Enter partner user secret and press [ENTER]'
read usersecret

cat <<EOF > credentials.json
{
    "email": "${email}",
    "password": "${password}",
    "partnerUserID": "${userid}",
    "partnerUserSecret": "${usersecret}"
}
EOF