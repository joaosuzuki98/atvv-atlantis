package com.fatec.atvv.entity;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fatec.atvv.enums.TipoDocumento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "documentos")
@Data @AllArgsConstructor @NoArgsConstructor
public class Documento {
    @Id
    private String id = UUID.randomUUID().toString();

    private TipoDocumento tipo;
    private String numero;
    private LocalDate dataEmissao;
}
