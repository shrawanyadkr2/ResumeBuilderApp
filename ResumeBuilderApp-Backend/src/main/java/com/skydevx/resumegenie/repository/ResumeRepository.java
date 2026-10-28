package com.skydevx.resumegenie.repository;

import com.skydevx.resumegenie.document.Resume;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends MongoRepository<Resume, String> {

    List<Resume> findByUserIdOrderByUpdatedAtDesc(String userId);

    Optional<Resume> findByUserIdAndId(String userId, String id);

    long countByUserId(String userId);

    void deleteByUserIdAndId(String userId, String id);
}
