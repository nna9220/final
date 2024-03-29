#### STEP 1: Build the application
FROM maven:3.8.4-openjdk-17-slim as build

WORKDIR /app

# Copy the pom.xml file
COPY pom.xml .

# Download all dependencies
RUN mvn dependency:go-offline

# Copy the project files
COPY src src

# Package the application
RUN mvn package -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

#### STEP 2: Build the final image
FROM eclipse-temurin:17-jre-alpine

ARG DEPENDENCY=/app/target/dependency

# Copy the dependency application file from build stage
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

# Execute the application
ENTRYPOINT ["java","-cp","app:app/lib/*","com.web.KhungggApplication"]