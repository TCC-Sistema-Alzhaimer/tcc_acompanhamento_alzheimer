package com.tcc.alzheimer.repository.files;

import com.tcc.alzheimer.model.files.File;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {

}