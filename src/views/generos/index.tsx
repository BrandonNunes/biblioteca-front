import {confirmPopup, ConfirmPopup} from "primereact/confirmpopup";
import {Button} from "primereact/button";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Toast} from "primereact/toast";
import {InputText} from "primereact/inputtext";
import { Dialog } from 'primereact/dialog';
import api from "../../services/api";
import {useEffect, useRef, useState} from "react";
import {GenerosTypes} from "../../utils/types";
import {FilterMatchMode} from "primereact/api";
import {formateDate} from "../../utils";
import {ContainerNewGender} from "./styles";

export default function Generos() {
    const [ listGenders, setListGenders ] = useState<GenerosTypes[]>([]);
    const [ newGenderName, setNewGenderName ] = useState("");
    const [ showEditDialog, setShowEditDialog ] = useState(false)
    const [ selectedGender, setSelectedGender ] = useState<any>()
    const [ editableGender, setEditableGender ] = useState(selectedGender?.descricao)
    const toast = useRef<any>(null);
    const toastError = useRef<any>(null);
    const [filters2, setFilters2] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'id': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'descricao': { value: null, matchMode: FilterMatchMode.STARTS_WITH }
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
    const getGenders = async () => {
        try {
            const genders = await api.get('/generos');
            setListGenders(genders.data);
        } catch (e) {
            console.log(e)
            showError("Erro ao buscar generos")
        }
    }
    const createNewGender = async () => {
        try {
            await api.post('/generos', {descricao: newGenderName});
            showSuccess("Novo genero adicionado com sucesso!")
            getGenders();
            setNewGenderName("");
        } catch (e: any) {
            showError(e.response.mensagem)
            console.log(e)
        }
    }
    const showSuccess = (msg: string) => {
        if(toast.current != null){
            toast.current?.show({severity: 'success', summary: 'Sucesso', detail: `${msg}`});
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
            accept: () => deleteGender(id),
            reject: () => null,
            acceptLabel: 'Sim',
            rejectLabel: 'Não'
        });
    }
    const deleteGender = async (id: number) => {
        try {
            await api.delete(`/generos/${id}`);
            showSuccess("Registro apagado com sucesso!")
            getGenders();
        } catch (e: any) {
            console.log(e)
            showError(e.response.mensagem)
        }
    }
    const updateGender = async () => {
        try {
            await api.put(`/generos`, { id: selectedGender.id, descricao: editableGender });
            showSuccess("Registro atualizado com sucesso!")
            setShowEditDialog(false)
            getGenders();
        } catch (e: any) {
            console.log(e)
            showError(e.response.mensagem)
        }
    }

    const Footer = () => {
        return (
            <div>
                <Button label="Fechar" icon="pi pi-times" className="p-button-secundary" onClick={()=> setShowEditDialog(false)} />
                <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={updateGender} />
            </div>
        )
    }
    const openModalEdit = (genero: GenerosTypes) => {
        setShowEditDialog(true)
        setSelectedGender(genero)
        setEditableGender(genero.descricao)
    }
    useEffect(() => {
        getGenders();
    }, [])
    return(
        <div className="card">
            <ConfirmPopup />
            <Dialog header="Editar este Genero" visible={showEditDialog} style={{ width: '50vw' }} closable={false} footer={Footer}  onHide={()=>null}>
                    <InputText value={editableGender} onChange={(e) => setEditableGender(e.target.value)} />
            </Dialog>
            <ContainerNewGender>
                <InputText placeholder="Novo genero..." onChange={(e) => setNewGenderName(e.target.value)} />
                <Button label="Cadastrar novo genero" className="p-button-success" icon="pi pi-plus"
                        disabled={!newGenderName} onClick={createNewGender}
                />
            </ContainerNewGender>
            <DataTable value={listGenders} paginator className="p-datatable-customers" rows={10}
                       dataKey="id" filters={filters2} filterDisplay="row" loading={!(!!listGenders)} responsiveLayout="scroll"
                       globalFilterFields={['id', 'descricao']} header={header2} emptyMessage="Nenhum genero encontrado.">
                <Column field="id" header="ID"  />
                <Column header="Descrição" filterField="nome" showFilterMenu={false} body={(rowData)=> <span>{rowData.descricao}</span>} />
                <Column header="Criado em" filterField="createdAt" showFilterMenu={false}  body={(rowData)=> <span>{formateDate(rowData.createdAt)}</span>}  />
                <Column field="updatedAt" header="Ultima alteração" showFilterMenu={false}  body={(rowData)=> <span>{formateDate(rowData.updatedAt)}</span>}   />
                <Column header="Ações" showFilterMenu={false} body={(rowData)=> (
                    <span style={{display: "flex", gap: "5px"}} >
                        <Button  icon="pi pi-pencil" className="p-button-raised p-button-rounded p-button-warning"
                        onClick={()=> openModalEdit(rowData)}/>
                        <Button onClick={(e)=>confirmDelete(rowData.id, e)} icon="pi pi-trash" className="p-button-raised p-button-rounded p-button-danger" />
                    </span>)}  />
            </DataTable>
            <Toast ref={toast} />
            <Toast ref={toastError} />
        </div>
    )
}
