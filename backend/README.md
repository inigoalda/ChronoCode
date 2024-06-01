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

# DOC API (temporary)
Port : 8080 \
Endpoints:
- /login
    : body - Json format \
    ```
    {
        username: "user",
        password: "password"
    }
    ```

- /signin
    : body - Json format \
  ```
  {
  username: "user",
  password: "password"
  }
  ```\
  Only there during the development phase


# Security
- password stored using a hash function