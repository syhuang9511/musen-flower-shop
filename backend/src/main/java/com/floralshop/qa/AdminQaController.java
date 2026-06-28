package com.floralshop.qa;

import com.floralshop.common.ApiResponse;
import com.floralshop.common.BusinessException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** 後台 Q&A 管理（ADMIN 限定） */
@RestController
@RequestMapping("/admin/qa")
public class AdminQaController {

    private final QaArticleRepository articleRepository;
    private final QaCategoryRepository categoryRepository;

    public AdminQaController(QaArticleRepository articleRepository, QaCategoryRepository categoryRepository) {
        this.articleRepository = articleRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ApiResponse<List<QaController.ArticleDto>> list() {
        Map<Long, String> catMap = catMap();
        return ApiResponse.ok(articleRepository.findAllByOrderBySortOrderAscIdAsc()
                .stream().map(a -> toDto(a, catMap)).toList());
    }

    @PostMapping
    @Transactional
    public ApiResponse<QaController.ArticleDto> create(@Valid @RequestBody ArticleRequest req) {
        QaCategory cat = resolveCategory(req.category());
        QaArticle article = new QaArticle();
        apply(article, req, cat.getId());
        return ApiResponse.ok(toDto(articleRepository.save(article), catMap()));
    }

    @PutMapping("/{id}")
    @Transactional
    public ApiResponse<QaController.ArticleDto> update(@PathVariable Long id,
                                                        @Valid @RequestBody ArticleRequest req) {
        QaArticle article = articleRepository.findById(id)
                .orElseThrow(() -> new BusinessException(40400, "文章不存在"));
        QaCategory cat = resolveCategory(req.category());
        apply(article, req, cat.getId());
        return ApiResponse.ok(toDto(articleRepository.save(article), catMap()));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ApiResponse<Void> delete(@PathVariable Long id) {
        articleRepository.deleteById(id);
        return ApiResponse.ok(null);
    }

    // ── 私有輔助 ──────────────────────────────────────────

    private void apply(QaArticle a, ArticleRequest req, Long categoryId) {
        a.setCategoryId(categoryId);
        a.setQuestion(req.question());
        a.setAnswer(req.answer());
        a.setImage(req.image());
        if (a.getPublishedAt() == null) a.setPublishedAt(Instant.now());
    }

    private QaCategory resolveCategory(String name) {
        return categoryRepository.findAll().stream()
                .filter(c -> c.getName().equals(name))
                .findFirst()
                .orElseGet(() -> {
                    QaCategory c = new QaCategory();
                    c.setName(name);
                    return categoryRepository.save(c);
                });
    }

    private Map<Long, String> catMap() {
        return categoryRepository.findAll().stream()
                .collect(Collectors.toMap(QaCategory::getId, QaCategory::getName));
    }

    private QaController.ArticleDto toDto(QaArticle a, Map<Long, String> catMap) {
        return new QaController.ArticleDto(
                a.getId(),
                catMap.getOrDefault(a.getCategoryId(), "未分類"),
                a.getImage(),
                a.getQuestion(),
                a.getAnswer());
    }

    public record ArticleRequest(
            @NotBlank String category,
            String image,
            @NotBlank String question,
            @NotBlank String answer) {}
}
