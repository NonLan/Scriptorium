#!/bin/bash

# install all the languages
# a reusable function for interpreter installation
install() {
    if ! docker image inspect "$1" > /dev/null 2>&1
    then
        echo "Pulling Docker image: $1"
        docker pull $1
    else
        echo "Docker image $1 is already pulled, nice!"
    fi
}

sudo apt update > /dev/null

# install Docker
if ! command -v docker &> /dev/null
then
    sudo apt-get update
    sudo apt-get install ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
        $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
        sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    echo "Docker installed successfully. You may need to log out and back in for changes to take effect."
else
    echo "Docker is already installed, nice!"
fi

install python:alpine
install gcc:latest
install node:alpine
install ruby:alpine
install php:alpine
install perl:slim
install bash:devel-alpine3.20
install golang:alpine
install bigtruedata/scala:2.12.4-alpine
install openjdk:alpine

# install all the packages
if ! command -v npm &> /dev/null
then
echo "Installing npm"
sudo apt install -y npm
else
echo "npm is already installed, nice!"
fi

echo "Installing packages"
npm install

# start the prisma
echo "Setting up database"
npm install prisma
npx prisma migrate deploy

# create admin user
echo "Creating admin user"
# curl -X POST http://localhost:3000/api/users/register -H "Content-Type: application/json" -d @defaultAdmin.json
node defaultAdmin.mjs

echo "Finished!"