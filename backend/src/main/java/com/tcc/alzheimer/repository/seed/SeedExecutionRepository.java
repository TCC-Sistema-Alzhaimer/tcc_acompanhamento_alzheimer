package com.tcc.alzheimer.repository.seed;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tcc.alzheimer.model.seed.SeedExecution;

public interface SeedExecutionRepository extends JpaRepository<SeedExecution, Long> {

    boolean existsByName(String name);

    void deleteByName(String name);
}
