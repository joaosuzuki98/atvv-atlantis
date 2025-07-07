package com.fatec.atvv.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class HospedagemRequest {
    private String clienteId;
    private String acomodacaoId;
    private LocalDate dataInicio;
    private LocalDate dataFim;
}
