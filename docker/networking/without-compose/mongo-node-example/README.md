# create the network
docker network create --driver=bridge app-net

# start the mongodb server
docker run -d --network=app-net -p 27017:27017 --name=db --rm mongo:7

# build the container
docker build --tag=my-app-with-mongo .

# run the container
docker run -p 8080:8080 --network=app-net --init --env MONGO_CONNECTION_STRING=mongodb://db:27017 my-app-with-mongo
