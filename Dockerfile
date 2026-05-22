# Stage 1: Build
FROM maven:3.8.5-openjdk-17-slim AS structural-builder
WORKDIR /build/app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn clean package -DskipTests -q

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /runtime/app

RUN apk add --no-cache wget

COPY --from=structural-builder /build/app/target/*.jar runtime-engine.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "runtime-engine.jar"]
