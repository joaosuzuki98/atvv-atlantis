package com.fatec.atvv.repository;

import com.fatec.atvv.entity.Hospedagem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HospedagemRepository extends MongoRepository<Hospedagem, String> {
}
