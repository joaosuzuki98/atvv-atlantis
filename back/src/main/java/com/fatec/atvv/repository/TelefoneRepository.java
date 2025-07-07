package com.fatec.atvv.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.fatec.atvv.entity.Telefone;

public interface TelefoneRepository extends MongoRepository<Telefone, String> {
    
}
