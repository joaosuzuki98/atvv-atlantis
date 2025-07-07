package com.fatec.atvv.service;

import com.fatec.atvv.entity.Acomodacao;
import com.fatec.atvv.repository.AcomodacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AcomodacaoService {

    private final AcomodacaoRepository repository;

    public Acomodacao criar(Acomodacao acomodacao) {
        return repository.save(acomodacao);
    }

    public List<Acomodacao> listarTodos() {
        return repository.findAll();
    }

    public Optional<Acomodacao> buscarPorId(String id) {
        return repository.findById(id);
    }

    public Acomodacao atualizar(String id, Acomodacao nova) {
        nova.setId(id);
        return repository.save(nova);
    }

    public void deletar(String id) {
        repository.deleteById(id);
    }
}
