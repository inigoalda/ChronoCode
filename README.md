# Usage

### (Optional) Re-compile the frontend

If you want to re-compile the frontend, you can do so by running the following commands:

```bash
cd front
npm install --force
npm run build
cp -r build/* ../engine/ping/src/main/resources/META-INF/resources/
```

### Compile the engine
```bash
cd engine/ping
mvn clean install
```

### Run the engine
```bash
cd target/quarkus-app/
java -jar quarkus-run.jar
```

### Run the backend database

From the root directory, run the following command:

```bash
cd backend
mvn clean package -DskipTests
docker-compose build
docker-compose up
```

### Connect to the application

You can access the application at the following URL: [http://localhost:8080](http://localhost:8080)