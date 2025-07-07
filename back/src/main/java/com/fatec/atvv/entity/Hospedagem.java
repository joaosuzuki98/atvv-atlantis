package com.fatec.atvv.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "hospedagens")
public class Hospedagem {
    @Id
    private String id = UUID.randomUUID().toString();

    private Cliente cliente;
    private Acomodacao acomodacao;
    private LocalDate dataInicio;
    private LocalDate dataFim;
}
