package com.floralshop.qa;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "qa_articles")
@Getter
@Setter
public class QaArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(nullable = false)
    private String question;

    @Column(columnDefinition = "text", nullable = false)
    private String answer;

    private String image;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @Column(name = "published_at")
    private Instant publishedAt = Instant.now();

    @Column(name = "unpublish_at")
    private Instant unpublishAt;
}
