package com.skydevx.resumegenie.repository;

import com.skydevx.resumegenie.document.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {

    List<Payment> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    boolean existsByRazorpayPaymentIdAndStatus(String razorpayPaymentId, String status);
}
