package com.floralshop.qa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QaArticleRepository extends JpaRepository<QaArticle, Long> {

    List<QaArticle> findAllByOrderBySortOrderAscIdAsc();

    List<QaArticle> findByCategoryId(Long categoryId);

    @Query("SELECT a FROM QaArticle a WHERE " +
           "(:keyword IS NULL OR a.question LIKE %:keyword% OR a.answer LIKE %:keyword%)")
    List<QaArticle> searchByKeyword(String keyword);
}
