export interface AlunosTypes {
    "id"?: number,
    "nome": string,
    "turma": string,
    "ano": number,
    "telefone": string,
    "createdAt"?: string,
    "updatedAt"?: string
}
export interface GenerosTypes {
    "id"?: number,
    "descricao": string,
    "createdAt": string,
    "updatedAt": string
}
export interface CreateNewBookTypes {
    "titulo": string,
    "autor": string,
    "id_genero": number,
    "estante": string,
    "prateleira": string,
    "quantidade": number,
    "qtd_disponivel"?: number
}
export interface BookTypes {
    "id": number,
    "titulo": string,
    "autor": string,
    "id_genero": 1,
    "estante": string,
    "prateleira": string,
    "quantidade": number,
    "qtd_disponivel": number,
    "createdAt": string,
    "updatedAt": string,
    "genero": {
        "id": number,
        "descricao": string
    }
}
export interface LocacoesTypes {
    "id": number,
    "data_aluguel": string,
    "data_devolucao": string,
    "status": number,
    "createdAt": string,
    "updatedAt": string,
    "aluno": {
        "id": number,
        "nome": string,
        "turma": string,
        "ano": number,
        "telefone": string,
        "createdAt": string,
        "updatedAt": string
    },
    "livro": {
        "id": number,
        "titulo": string,
        "autor": string,
        "id_genero": number,
        "estante": string,
        "prateleira": string,
        "quantidade": number,
        "qtd_disponivel": number,
        "createdAt": string,
        "updatedAt": string
    }
}
export interface CreateLocacaoTypes {
    "id_aluno": number,
    "id_livro": number,
    "data_aluguel": string,
    "data_devolucao":string,
    "status": number
}
export interface UpdateLocacaoTypes {
    "id": number,
    "data_devolucao":string,
    "status": number
}

