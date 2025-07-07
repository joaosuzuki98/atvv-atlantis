package com.fatec.atvv.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.fatec.atvv.entity.Endereco;

public interface EnderecoRepository extends MongoRepository<Endereco, String> {
    
}
