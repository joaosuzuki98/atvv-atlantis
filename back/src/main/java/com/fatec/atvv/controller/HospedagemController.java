package com.fatec.atvv.controller;

import com.fatec.atvv.dto.HospedagemRequest;
import com.fatec.atvv.entity.Hospedagem;
import com.fatec.atvv.service.HospedagemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hospedagens")
@RequiredArgsConstructor
public class HospedagemController {

    private final HospedagemService service;

    @PostMapping
    public ResponseEntity<Hospedagem> criar(@RequestBody HospedagemRequest request) {
        return ResponseEntity.ok(service.criar(request));
    }

    @GetMapping
    public List<Hospedagem> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hospedagem> buscar(@PathVariable String id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hospedagem> atualizar(@PathVariable String id, @RequestBody HospedagemRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
