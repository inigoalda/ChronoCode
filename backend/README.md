# HOW TO COMPILE BACKEND

Create the jar file:
```shell
mvn clean package -DskipTests
```

Build docker image:
```shell
docker compose build
```

Start dockers
```shell
docker compose up
```
Run on http://localhost:8080

# DOC API
http://localhost:8080/swagger-ui.html


# Security
- password stored using a hash function