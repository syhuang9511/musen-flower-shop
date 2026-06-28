package com.floralshop.qa;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QaCategoryRepository extends JpaRepository<QaCategory, Long> {

    List<QaCategory> findAllByOrderBySortOrderAsc();
}
