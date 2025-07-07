package com.fatec.atvv.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.fatec.atvv.entity.Documento;

public interface DocumentoRepository extends MongoRepository<Documento, String> {
    
}
