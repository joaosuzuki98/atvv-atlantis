package com.fatec.atvv.service;

import com.fatec.atvv.dto.HospedagemRequest;
import com.fatec.atvv.entity.Acomodacao;
import com.fatec.atvv.entity.Cliente;
import com.fatec.atvv.entity.Hospedagem;
import com.fatec.atvv.repository.AcomodacaoRepository;
import com.fatec.atvv.repository.ClienteRepository;
import com.fatec.atvv.repository.HospedagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HospedagemService {

    private final HospedagemRepository repository;
    private final ClienteRepository clienteRepository;
    private final AcomodacaoRepository acomodacaoRepository;

    public Hospedagem criar(HospedagemRequest request) {
        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Acomodacao acomodacao = acomodacaoRepository.findById(request.getAcomodacaoId())
                .orElseThrow(() -> new RuntimeException("Acomodação não encontrada"));

        Hospedagem hospedagem = new Hospedagem();
        hospedagem.setCliente(cliente);
        hospedagem.setAcomodacao(acomodacao);
        hospedagem.setDataInicio(request.getDataInicio());
        hospedagem.setDataFim(request.getDataFim());

        return repository.save(hospedagem);
    }

    public List<Hospedagem> listarTodos() {
        return repository.findAll();
    }

    public Optional<Hospedagem> buscarPorId(String id) {
        return repository.findById(id);
    }

    public Hospedagem atualizar(String id, HospedagemRequest request) {
        Hospedagem existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospedagem não encontrada"));

        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Acomodacao acomodacao = acomodacaoRepository.findById(request.getAcomodacaoId())
                .orElseThrow(() -> new RuntimeException("Acomodação não encontrada"));

        existente.setCliente(cliente);
        existente.setAcomodacao(acomodacao);
        existente.setDataInicio(request.getDataInicio());
        existente.setDataFim(request.getDataFim());

        return repository.save(existente);
    }

    public void deletar(String id) {
        repository.deleteById(id);
    }
}
