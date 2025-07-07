package com.fatec.atvv.entity;

import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "enderecos")
@Data @AllArgsConstructor @NoArgsConstructor
public class Endereco {
    @Id
    private String id = UUID.randomUUID().toString();
    private String rua;
    private String cidade;
    private String bairro;
    private String estado;
    private String cep;
    private String numero;
}
