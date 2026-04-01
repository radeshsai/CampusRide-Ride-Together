package com.campusride.repository;
import com.campusride.entity.Review;
import com.campusride.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByReviewedUser(User user);
}
