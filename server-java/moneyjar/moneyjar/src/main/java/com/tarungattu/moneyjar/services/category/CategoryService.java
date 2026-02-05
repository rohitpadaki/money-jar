package com.tarungattu.moneyjar.services.category;

import com.tarungattu.moneyjar.models.Category;
import com.tarungattu.moneyjar.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Category findOne(UUID id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public Category create(Category category) {
        return categoryRepository.save(category);
    }

    public void remove(UUID id) {
        categoryRepository.deleteById(id);
    }
}
