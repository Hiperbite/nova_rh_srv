#!/bin/sh

echo ' 1- git pull'
git reset --hard
git pull "origin" $1

echo ' 2- yarn build'
yarn build

return