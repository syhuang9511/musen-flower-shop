package com.floralshop.qa;

import com.floralshop.common.ApiResponse;
import com.floralshop.common.BusinessException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** 3.2 / 7.1 前台植栽養護 Q&A 知識庫 */
@RestController
@RequestMapping("/qa")
public class QaController {

    private final QaArticleRepository articleRepository;
    private final QaCategoryRepository categoryRepository;

    public QaController(QaArticleRepository articleRepository, QaCategoryRepository categoryRepository) {
        this.articleRepository = articleRepository;
        this.categoryRepository = categoryRepository;
    }

    /** 取得分類名稱列表 */
    @GetMapping("/categories")
    public ApiResponse<List<String>> categories() {
        List<String> names = categoryRepository.findAllByOrderBySortOrderAsc()
                .stream().map(QaCategory::getName).toList();
        return ApiResponse.ok(names);
    }

    /** 文章列表，支援關鍵字與分類篩選 */
    @GetMapping("/articles")
    public ApiResponse<List<ArticleDto>> articles(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category) {

        Map<Long, String> catMap = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(QaCategory::getId, QaCategory::getName));

        List<QaArticle> articles;
        if (keyword != null && !keyword.isBlank()) {
            articles = articleRepository.searchByKeyword(keyword.trim());
        } else {
            articles = articleRepository.findAllByOrderBySortOrderAscIdAsc();
        }

        if (category != null && !category.isBlank()) {
            articles = articles.stream()
                    .filter(a -> category.equals(catMap.get(a.getCategoryId())))
                    .toList();
        }

        return ApiResponse.ok(articles.stream().map(a -> toDto(a, catMap)).toList());
    }

    /** 單篇文章 */
    @GetMapping("/articles/{id}")
    public ApiResponse<ArticleDto> article(@PathVariable Long id) {
        QaArticle article = articleRepository.findById(id)
                .orElseThrow(() -> new BusinessException(40400, "文章不存在"));
        Map<Long, String> catMap = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(QaCategory::getId, QaCategory::getName));
        return ApiResponse.ok(toDto(article, catMap));
    }

    private ArticleDto toDto(QaArticle a, Map<Long, String> catMap) {
        return new ArticleDto(
                a.getId(),
                catMap.getOrDefault(a.getCategoryId(), "未分類"),
                a.getImage(),
                a.getQuestion(),
                a.getAnswer());
    }

    public record ArticleDto(Long id, String category, String image, String question, String answer) {}
}
