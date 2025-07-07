package com.fatec.atvv.entity;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fatec.atvv.enums.TipoCliente;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "clientes")
@Data @AllArgsConstructor @NoArgsConstructor
public class Cliente {
    @Id
    private String id = UUID.randomUUID().toString();

    private String nome;
    private String nomeSocial;
    private LocalDate dataNascimento;

    private TipoCliente tipo;

    private String titularId;

    private List<Cliente> dependentes;

    private Endereco endereco;

    private List<Documento> documentos;

    private List<Telefone> telefones;
}
