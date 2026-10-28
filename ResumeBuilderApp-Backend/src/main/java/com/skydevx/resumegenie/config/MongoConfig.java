package com.skydevx.resumegenie.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableMongoAuditing
@Slf4j
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Value("${spring.data.mongodb.database:resumegenie}")
    private String databaseName;

    @PostConstruct
    public void validateMongoConfiguration() {
        if (mongoUri == null || mongoUri.trim().isEmpty()) {
            throw new IllegalStateException(
                    "MONGODB CONFIGURATION ERROR: 'MONGODB_URI' / 'SPRING_DATA_MONGODB_URI' environment variable is missing or empty. " +
                    "Please configure your MongoDB Atlas connection string (e.g. mongodb+srv://...)."
            );
        }

        if (mongoUri.contains("localhost") || mongoUri.contains("127.0.0.1") || mongoUri.contains("27017")) {
            throw new IllegalStateException(
                    "MONGODB CONFIGURATION ERROR: MongoDB URI is pointing to localhost (" + sanitizeUri(mongoUri) + "). " +
                    "Resume Genie requires a valid MongoDB Atlas cluster connection string for the database '" + databaseName + "'."
            );
        }

        log.info("[MONGODB-CONFIG] Initializing MongoDB client for database '{}' connecting to Atlas cluster '{}'...",
                databaseName, extractHost(mongoUri));
    }

    @Override
    protected String getDatabaseName() {
        return (databaseName != null && !databaseName.trim().isEmpty()) ? databaseName : "resumegenie";
    }

    @Override
    @Bean
    public MongoClient mongoClient() {
        ConnectionString connectionString = new ConnectionString(mongoUri);
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .applyToSocketSettings(builder ->
                        builder.connectTimeout(10, TimeUnit.SECONDS)
                               .readTimeout(10, TimeUnit.SECONDS))
                .applyToClusterSettings(builder ->
                        builder.serverSelectionTimeout(10, TimeUnit.SECONDS))
                .build();

        return MongoClients.create(settings);
    }

    private String sanitizeUri(String uri) {
        if (uri == null) return "";
        return uri.replaceAll("(?i):([^:@]+)@", ":****@");
    }

    private String extractHost(String uri) {
        try {
            ConnectionString cs = new ConnectionString(uri);
            if (cs.getHosts() != null && !cs.getHosts().isEmpty()) {
                return String.join(", ", cs.getHosts());
            }
        } catch (Exception ignored) {
        }
        return "configured-cluster";
    }
}
