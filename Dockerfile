FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x gradlew

RUN ./gradlew bootJar

EXPOSE 8081

CMD ["sh", "-c", "java -jar build/libs/*.jar"]