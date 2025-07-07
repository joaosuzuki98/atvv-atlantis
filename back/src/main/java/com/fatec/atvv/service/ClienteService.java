package com.fatec.atvv.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fatec.atvv.entity.Cliente;
import com.fatec.atvv.enums.TipoCliente;
import com.fatec.atvv.repository.ClienteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository repository;

    public Cliente criarCliente(Cliente cliente) {
        if (cliente.getTipo() == TipoCliente.DEPENDENTE) {
            throw new RuntimeException("Não é permitido cadastrar dependente sem titular");
        }

        Cliente titularSalvo = repository.save(cliente);

        if (cliente.getDependentes() != null) {
            for (Cliente dependente : cliente.getDependentes()) {
                dependente.setTipo(TipoCliente.DEPENDENTE);
                dependente.setTitularId(titularSalvo.getId());

                dependente.setEndereco(titularSalvo.getEndereco());
                dependente.setTelefones(titularSalvo.getTelefones());

                repository.save(dependente);
            }
        }

        return titularSalvo;
    }

    public List<Cliente> listarDependentes(String titularId) {
        return repository.findByTitularId(titularId);
    }

    public Optional<Cliente> obterTitularDeDependente(String dependenteId) {
        Cliente dependente = repository.findById(dependenteId)
                .orElseThrow(() -> new RuntimeException("Dependente não encontrado"));
        if (dependente.getTitularId() == null) {
            return Optional.empty();
        }
        return repository.findById(dependente.getTitularId());
    }

    public Cliente atualizarCliente(String id, Cliente novoCliente) {
        repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        novoCliente.setId(id);

        Cliente titularAtualizado = repository.save(novoCliente);

        if (novoCliente.getDependentes() != null) {
            for (Cliente dependente : novoCliente.getDependentes()) {
                dependente.setTipo(TipoCliente.DEPENDENTE);
                dependente.setTitularId(titularAtualizado.getId());

                dependente.setEndereco(titularAtualizado.getEndereco());
                dependente.setTelefones(titularAtualizado.getTelefones());

                if (dependente.getId() == null) {
                    repository.save(dependente);
                } else {
                    repository.save(dependente);
                }
            }
        }

        return titularAtualizado;
    }

    public void deletarCliente(String id) {
        repository.deleteById(id);
    }

    public List<Cliente> listarTodos() {
        return repository.findAll();
    }

    public Optional<Cliente> buscarPorId(String id) {
        return repository.findById(id);
    }

    public List<Cliente> buscarPorTipo(TipoCliente tipo) {
        return repository.findByTipo(tipo);
    }
}
