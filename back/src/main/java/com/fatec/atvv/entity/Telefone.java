package com.fatec.atvv.entity;

import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "telefones")
@Data @AllArgsConstructor @NoArgsConstructor
public class Telefone {
    @Id
    private String id = UUID.randomUUID().toString();
    private String ddd;
    private String numero;
}
