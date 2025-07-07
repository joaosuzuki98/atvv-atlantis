package com.fatec.atvv.controller;

import com.fatec.atvv.entity.Acomodacao;
import com.fatec.atvv.service.AcomodacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/acomodacoes")
@RequiredArgsConstructor
public class AcomodacaoController {

    private final AcomodacaoService service;

    @PostMapping
    public ResponseEntity<Acomodacao> criar(@RequestBody Acomodacao acomodacao) {
        return ResponseEntity.ok(service.criar(acomodacao));
    }

    @GetMapping
    public List<Acomodacao> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Acomodacao> buscar(@PathVariable String id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Acomodacao> atualizar(@PathVariable String id, @RequestBody Acomodacao nova) {
        return ResponseEntity.ok(service.atualizar(id, nova));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
