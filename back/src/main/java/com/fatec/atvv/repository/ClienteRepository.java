package com.fatec.atvv.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.fatec.atvv.entity.Cliente;
import com.fatec.atvv.enums.TipoCliente;

public interface ClienteRepository extends MongoRepository<Cliente, String> {
    List<Cliente> findByTitularId(String titularId);
    Optional<Cliente> findByIdAndTipo(String id, TipoCliente tipo);
    List<Cliente> findByTipo(TipoCliente tipo);
}
