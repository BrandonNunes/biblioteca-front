import {JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useEffect, useRef, useState} from "react";
import {AlunosTypes, BookTypes, GenerosTypes, LocacoesTypes} from "../../utils/types";
import {formateDate} from "../../utils";
import {FilterMatchMode} from "primereact/api";
import {InputText} from "primereact/inputtext";
import api from "../../services/api";
import {ConfirmPopup, confirmPopup} from "primereact/confirmpopup";
import {MultiSelect} from "primereact/multiselect";
import NewBookDialog from "../livros/newBookdialog";
import EditBookDialog from "../livros/editBookDialog";
import {Button} from "primereact/button";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Toast} from "primereact/toast";
import NewLocacaoDialog from "./newLocacaoDialog";
import EditLocacaoDialog from "./editLocacao";
import {TriStateCheckbox} from "primereact/tristatecheckbox";

export default function Locacoes() {
    const [listLocacoes, setListLocacoes] = useState<LocacoesTypes[]>([]);
    const [listBooks, setlistBooks] = useState<BookTypes[]>([]);
    const [listAlunos, setlistAlunos] = useState<AlunosTypes[]>([]);
    const [showNewLocacao, setShowNewLocacao] = useState(false)
    const [showEditLocacao, setShowEditLocacao] = useState(false)
    const [selectedLocacao, setSelectedLocacao] = useState<any | undefined>(undefined)
    const [filters2, setFilters2] = useState({
        'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'id': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        'aluno.nome': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'aluno.ano': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'aluno.turma': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'livro.titulo': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        'data_aluguel': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'data_devolucao': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'status': {value: null, matchMode: FilterMatchMode.EQUALS}
    });
    const [globalFilterValue2, setGlobalFilterValue2] = useState('');
    const onGlobalFilterChange2 = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        let _filters2 = {...filters2};
        _filters2['global'].value = value;
        setFilters2(_filters2);
        setGlobalFilterValue2(value);
    }
    const renderHeader2 = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search"/>
                    <InputText value={globalFilterValue2} onChange={onGlobalFilterChange2} placeholder="Buscar..."/>
                </span>
            </div>
        )
    };
    const header2 = renderHeader2();
    const getLocacoes = async () => {
        try {
            const locacoes = await api.get('/locacoes');
            setListLocacoes(locacoes.data);
        } catch (e: any) {
            console.log(e)
            showError(e.response.mensagem)
        }
    }
    const getBooks = async () => {
        try {
            const books = await api.get('/livros');
            setlistBooks(books.data);
        } catch (e: any) {
            console.log(e)
            showError(e.response.mensagem)
        }
    }
    const toast = useRef<any>(null);
    const toastError = useRef<any>(null);
    const deleteLocacao = async (id: number) => {
        try {
            await api.delete(`/locacao/${id}`);
            showSuccess("Registro apagado com sucesso!")
            getLocacoes();
        } catch (e: any) {
            console.log(e)
            showError(e.response.mensagem)
        }
    }
    const getStudents = async () => {
        try {
            const students = await api.get('/alunos');
            setlistAlunos(students.data.students);
        } catch (e) {
            console.log(e)
        }
    }
    const showSuccess = (msg: string) => {
        if (toast.current != null) {
            toast.current?.show({severity: 'success', summary: 'Sucesso', detail: `${msg}`});
        }
    }
    const showError = (erroMessage: string) => {
        if (toastError.current != null) {
            toastError.current?.show({severity: 'error', summary: 'Erro', detail: `${erroMessage}`});
        }
    }
    const confirmDelete = (id: number, event?: { currentTarget: any; }) => {
        confirmPopup({
            target: event!.currentTarget,
            message: 'Deseja realmente apagar este registro?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteLocacao(id),
            reject: () => null,
            acceptLabel: 'Sim',
            rejectLabel: 'Não'
        });
    }
    const openDialogEdit = (locacao: LocacoesTypes) => {
        setShowEditLocacao(true);
        setSelectedLocacao(locacao);
    }

    const genderRowFilterTemplate = (options: { value: any; filterApplyCallback: (arg0: any) => void; }) => {
        return <MultiSelect value={options.value} options={listBooks}
                            onChange={(e) => options.filterApplyCallback(e.value)} optionLabel="descricao"
                            placeholder="Todos" className="p-column-filter" maxSelectedLabels={1}/>;
    }
    const listStatus = [{name: "PENDENTE", value: 0}, {name:"DEVOLVIDO", value: 1}]
    const representativeRowFilterTemplate = (options: { value: any; filterApplyCallback: (arg0: any) => void; }) => {
        return <MultiSelect value={options.value} options={listStatus} itemTemplate={representativesItemTemplate} optionLabel="name"
                            onChange={(e) => options.filterApplyCallback(e.value)} placeholder="Todos"
                            className="p-column-filter" maxSelectedLabels={2}/>;
    }
    const representativesItemTemplate = (option: any) => {
        return (
            <div className="p-multiselect-representative-option">
               <span className="image-text">{option.name}</span>
            </div>)
    }
    useEffect(() => {
        getLocacoes()
        getStudents()
        getBooks()
    }, [])

    return(
        <div className="card">
            <NewLocacaoDialog
                showNewLocacao={showNewLocacao}
                setShowNewLocacao={setShowNewLocacao}
                onHide={()=>getLocacoes()}
                refreshList={()=>getLocacoes()}
                books={listBooks}
                students={listAlunos}
            />
            <EditLocacaoDialog
                showEditLocacao={showEditLocacao}
                setShowEditLocacao={setShowEditLocacao}
                onHide={()=>getLocacoes()}
                refreshList={()=>getLocacoes()}
                selectedLocacao={selectedLocacao}
                books={listBooks}
                students={listAlunos}
            />
            <ConfirmPopup />
            <div style={{display: "flex", gap: "5px", padding: "10px"}} >
                <Button label="Nova Locação" icon="pi pi-plus" className="p-button-success" onClick={()=> setShowNewLocacao(true)} />
            </div>
            <DataTable value={listLocacoes} paginator className="p-datatable-customers" rows={10}
                       dataKey="id" filters={filters2} filterDisplay="row" loading={!(!!listLocacoes)} responsiveLayout="scroll"
                       globalFilterFields={['id', 'aluno.nome', 'aluno.ano', 'aluno.turma', 'livro.titulo', 'data_aluguel', 'data_devolucao']} header={header2} emptyMessage="Nenhuma locação encontrada.">
                <Column field="id" header="ID" showFilterMenu={false} style={{ fontSize: '12px' }} filter />
                <Column header="Aluno" filterField="aluno.nome" showFilterMenu={false} style={{ minWidth: '9rem', fontSize: '12px' }} body={(rowData)=> <span>{rowData.aluno.nome}</span>} filter />
                <Column header="Ano aluno" filterField="aluno.ano" showFilterMenu={false} style={{ minWidth: '6rem', fontSize: '12px' }}  body={(rowData)=> <span>{rowData.aluno.ano}</span>} filter />
                <Column field="aluno.turma" header="Turma aluno" showFilterMenu={false} style={{ minWidth: '6rem', fontSize: '12px' }}
                        body={(rowData)=> <span>{rowData.aluno.turma}</span>} filter/>
                <Column field="livro.titulo" header="Livro" showFilterMenu={false} style={{ minWidth: '9rem', fontSize: '12px' }} body={(rowData)=> <span>{rowData.livro.titulo}</span>} filter />
                <Column field="data_aluguel" header="Saída" showFilterMenu={false} style={{ minWidth: '6rem', fontSize: '12px' }} body={(rowData)=> <span>{formateDate(rowData.data_aluguel)}</span>} filter />
                <Column field="data_devolucao" header="Data devolução" showFilterMenu={false} style={{ minWidth: '7rem', fontSize: '12px' }} filter body={(rowData)=> <span>{formateDate(rowData.data_devolucao)}</span>}  />
                <Column field="status" header="Status" showFilterMenu={false} style={{ minWidth: '6rem', fontSize: '12px' }}
                        body={(rowData)=> <span style={{color: !rowData.status ? "orange" : "green"}} >{!rowData.status ? "Pendente" : "Devolvido"}</span>} filter filterElement={representativeRowFilterTemplate} />
                <Column header="Ações" showFilterMenu={false} body={(rowData)=> (
                    <span style={{display: "flex", gap: "5px"}} >
                        <Button onClick={()=> openDialogEdit(rowData)} icon="pi pi-pencil" className="p-button-raised p-button-rounded p-button-warning" />
                        { rowData.status === 1 && (<Button onClick={(e) => confirmDelete(rowData.id, e)}
                                 icon="pi pi-trash"
                                 className="p-button-raised p-button-rounded p-button-danger"/>)}
                    </span>)}  />
            </DataTable>
            <Toast ref={toast} />
            <Toast ref={toastError} />
        </div>
    )
}
