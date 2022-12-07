#!/bin/sh
echo "############### running user ##################"  |  \
node seeder.js user  | \
echo "############### running sleep ##################" | \
sleep 10s | \
echo "############## running vendor ##################"  | \
node seeder.js vendor 
echo "############### running sleep ##################" | \
sleep 10 | \
echo "############### running buyer ##################" | \
node seeder.js buyer  | \
echo "############### running sleep ##################" | \
sleep 10 | \
echo "############### running dealer ##################" | \
node seeder.js dealer | \
echo "############### running sleep ##################" | \
sleep 10 | \
echo "############### running buyer site ##################" | \
node seeder.js dealerSite | \
echo "############### running sleep ##################" | \
sleep 10 | \
echo "############### running dealer site ##################" | \
node seeder.js buyerSite | \
echo "############### running sleep ##################" | \
sleep 10 | \
echo "############### running vds ##################" | \
node seeder.js vds | \
echo "############### running sleep ##################" | \
sleep 10 | \
echo "############### running vdsbs ##################"  | \
node seeder.js vdsbs | \
echo "############### running sleep ##################"  | \
sleep 10 | \
echo "############### running user entity ##################" | \
node seeder.js user_entity