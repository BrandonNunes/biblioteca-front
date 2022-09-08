import {useState, useEffect, useRef} from "react";
import api from "../../services/api";
import NewStudentDialog from "./newStudentDialog";
import {AlunosTypes} from "../../utils/types";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {FilterMatchMode} from "primereact/api";
import {InputText} from "primereact/inputtext";
import { Button } from 'primereact/button';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import {Toast} from "primereact/toast";
import EditStudentDialog from "./editStudent";

export default function Alunos() {
    const [ listAlunos, setlistAlunos ] = useState<AlunosTypes[]>([]);
    const [ showNewStudent, setShowNewStudent ] = useState(false)
    const [ showEditStudent, setShowEditStudent ] = useState(false)
    const [ selectedStudent, setSelectedStudent ] = useState<any | undefined>(undefined)
    const [filters2, setFilters2] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'id': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'nome': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'ano': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'turma': { value: null, matchMode: FilterMatchMode.EQUALS },
        'telefone': { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [globalFilterValue2, setGlobalFilterValue2] = useState('');
    const onGlobalFilterChange2 = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        let _filters2 = { ...filters2 };
        _filters2['global'].value = value;
        setFilters2(_filters2);
        setGlobalFilterValue2(value);
    }
    const renderHeader2 = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue2} onChange={onGlobalFilterChange2} placeholder="Buscar..." />
                </span>
            </div>
        )
    };
    const header2 = renderHeader2();
    const getStudents = async () => {
        try {
            const students = await api.get('/alunos');
            setlistAlunos(students.data.students);
        } catch (e) {
            console.log(e)
        }
    }
    const toast = useRef<any>(null);
    const toastError = useRef<any>(null);
    const deleteStudent = async (id: number) => {
        try {
            await api.delete(`/alunos/${id}`);
            showSuccess()
            getStudents();
        } catch (e: any) {
            console.log(e)
            showError(e.response.mensagem)
        }
    }
    const showSuccess = () => {
        if(toast.current != null){
            toast.current?.show({severity: 'success', summary: 'Sucesso', detail: 'Registro apagado com sucesso!'});
        }
    }
    const showError = (erroMessage: string) => {
        if(toastError.current != null){
            toastError.current?.show({severity: 'error', summary: 'Erro', detail: `${erroMessage}`});
        }
    }
    const confirmDelete = (id: number, event?: { currentTarget: any; }) => {
        confirmPopup({
            target: event!.currentTarget,
            message: 'Deseja realmente apagar este registro?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteStudent(id),
            reject: () => null,
            acceptLabel: 'Sim',
            rejectLabel: 'Não'
        });
    }
    const openDialogEdit = (aluno: AlunosTypes) => {
        setShowEditStudent(true);
        setSelectedStudent(aluno);
    }
    useEffect(() => {
        getStudents()
    }, [])

    return(
        <div className="card">
            <NewStudentDialog
                showNewStudent={showNewStudent}
                setShowNewStudent={setShowNewStudent}
                onHide={()=>getStudents()}
                refreshList={getStudents}
            />
            <EditStudentDialog
                showEditStudent={showEditStudent}
                setShowEditStudent={setShowEditStudent}
                onHide={()=>getStudents()}
                refreshList={getStudents}
                selectedStudent={selectedStudent}
            />
            <ConfirmPopup />
            <div style={{display: "flex", gap: "5px", padding: "10px"}} >
                <Button label="Novo aluno" icon="pi pi-plus" className="p-button-success" onClick={()=> setShowNewStudent(true)} />
            </div>

            <DataTable value={listAlunos} paginator className="p-datatable-customers" rows={10}
                       dataKey="id" filters={filters2} filterDisplay="row" loading={!(!!listAlunos)} responsiveLayout="scroll"
                       globalFilterFields={['id', 'nome', 'ano', 'turma', 'telefone']} header={header2} emptyMessage="Nenhum aluno encontrado.">
                <Column field="id" header="ID" showFilterMenu={false} filter />
                <Column header="Nome" filterField="nome" showFilterMenu={false} body={(rowData)=> <span>{rowData.nome}</span>} filter />
                <Column header="Ano" filterField="ano" showFilterMenu={false}  body={(rowData)=> <span>{rowData.ano}</span>} filter />
                <Column field="turma" header="Turma" showFilterMenu={false}  body={(rowData)=> <span>{rowData.turma}</span>} filter  />
                <Column field="telefone" header="Telefone" showFilterMenu={false} style={{ minWidth: '6rem' }} body={(rowData)=> <span>{rowData.telefone}</span>} filter />
                <Column header="Ações" showFilterMenu={false} body={(rowData)=> (
                    <span style={{display: "flex", gap: "5px"}} >
                        <Button onClick={()=> openDialogEdit(rowData)} icon="pi pi-pencil" className="p-button-raised p-button-rounded p-button-warning" />
                        <Button onClick={(e)=>confirmDelete(rowData.id, e)} icon="pi pi-trash" className="p-button-raised p-button-rounded p-button-danger" />
                    </span>)}  />
            </DataTable>
            <Toast ref={toast} />
            <Toast ref={toastError} />
        </div>
    )
}
