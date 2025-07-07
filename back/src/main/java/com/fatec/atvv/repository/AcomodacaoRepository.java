package com.fatec.atvv.repository;

import com.fatec.atvv.entity.Acomodacao;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AcomodacaoRepository extends MongoRepository<Acomodacao, String> {
}
