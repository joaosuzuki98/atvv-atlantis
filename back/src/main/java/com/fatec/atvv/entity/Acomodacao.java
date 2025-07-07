package com.fatec.atvv.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "acomodacoes")
public class Acomodacao {
    @Id
    private String id = UUID.randomUUID().toString();

    private String nomePacote;
    private int camasCasal;
    private int camasSolteiro;
    private int vagasGaragem;
    private int numeroSuites;
    private boolean climatizacao;
}
