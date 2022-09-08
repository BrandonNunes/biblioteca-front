import {useState, useEffect, useRef, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal} from "react";
import api from "../../services/api";
import NewBookDialog from "./newBookdialog";
import {BookTypes, GenerosTypes} from "../../utils/types";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {FilterMatchMode} from "primereact/api";
import {InputText} from "primereact/inputtext";
import {Button} from 'primereact/button';
import {ConfirmPopup, confirmPopup} from 'primereact/confirmpopup';
import {Toast} from "primereact/toast";
import EditBookDialog from "./editBookDialog";
import {MultiSelect} from "primereact/multiselect";

export default function Livros() {
    const [listBooks, setlistBooks] = useState<BookTypes[]>([]);
    const [listGenders, setListGenders] = useState<GenerosTypes[]>([])
    const [showNewBook, setShowNewBook] = useState(false)
    const [showEditBook, setShowEditBook] = useState(false)
    const [selectedBook, setSelectedBook] = useState<any | undefined>(undefined)
    const [filters2, setFilters2] = useState({
        'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'id': {value: null, matchMode: FilterMatchMode.STARTS_WITH},
        'titulo': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'autor': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'genero': {value: null, matchMode: FilterMatchMode.IN},
        'quantidade': {value: null, matchMode: FilterMatchMode.EQUALS},
        'qtd_disponivel': {value: null, matchMode: FilterMatchMode.EQUALS},
        'estante': {value: null, matchMode: FilterMatchMode.EQUALS},
        'prateleira': {value: null, matchMode: FilterMatchMode.EQUALS},
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
    const getBooks = async () => {
        try {
            const books = await api.get('/livros');
            setlistBooks(books.data);
        } catch (e: any) {
            console.log(e)
            showError(e.response.mensagem)
        }
    }
    const getGenders = async () => {
        try {
            const genders = await api.get('/generos');
            setListGenders(genders.data);
        } catch (e) {
            console.log(e)
            showError("Erro ao buscar generos")
        }
    }
    const toast = useRef<any>(null);
    const toastError = useRef<any>(null);
    const deleteBook = async (id: number) => {
        try {
            await api.delete(`/livros/${id}`);
            showSuccess("Registro apagado com sucesso!")
            getBooks();
        } catch (e: any) {
            console.log(e)
            showError(e.response.mensagem)
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
            accept: () => deleteBook(id),
            reject: () => null,
            acceptLabel: 'Sim',
            rejectLabel: 'Não'
        });
    }
    const openDialogEdit = (book: BookTypes) => {
        setShowEditBook(true);
        setSelectedBook(book);
    }

    const genderRowFilterTemplate = (options: { value: any; filterApplyCallback: (arg0: any) => void; }) => {
        return <MultiSelect value={options.value} options={listGenders}  onChange={(e) => options.filterApplyCallback(e.value)} optionLabel="descricao" placeholder="Todos" className="p-column-filter" maxSelectedLabels={1} />;
    }
    useEffect(() => {
        getBooks()
        getGenders()
    }, [])

    return(
        <div className="card">
            <NewBookDialog
                showNewBook={showNewBook}
                setShowNewBook={setShowNewBook}
                onHide={()=>getBooks()}
                refreshList={()=>getBooks()}
                genders={listGenders}
            />
            <EditBookDialog
                showEditBook={showEditBook}
                setShowEditBook={setShowEditBook}
                onHide={()=>getBooks()}
                refreshList={()=>getBooks()}
                selectedBook={selectedBook}
                genders={listGenders}
            />
            <ConfirmPopup />
            <div style={{display: "flex", gap: "5px", padding: "10px"}} >
                <Button label="Novo Livro" icon="pi pi-plus" className="p-button-success" onClick={()=> setShowNewBook(true)} />
            </div>
            <DataTable value={listBooks} paginator className="p-datatable-customers" rows={10}
                       dataKey="id" filters={filters2} filterDisplay="row" loading={!(!!listBooks)} responsiveLayout="scroll"
                       globalFilterFields={['id', 'titulo', 'autor', 'genero.descricao', 'qtd_disponivel', 'estante', 'prateleira']} header={header2} emptyMessage="Nenhum livro encontrado.">
                <Column field="id" header="ID" showFilterMenu={false} style={{ fontSize: '12px' }} filter />
                <Column header="Titulo" filterField="titulo" showFilterMenu={false} style={{ minWidth: '7rem', fontSize: '12px' }} body={(rowData)=> <span>{rowData.titulo}</span>} filter />
                <Column header="Autor" filterField="autor" showFilterMenu={false} style={{ minWidth: '6rem', fontSize: '12px' }}  body={(rowData)=> <span>{rowData.autor}</span>} filter />
                <Column field="genero" header="Genero" showFilterMenu={false} style={{ minWidth: '6rem', fontSize: '12px' }}
                        body={(rowData)=> <span>{rowData["genero"].descricao}</span>} filter
                        filterElement={genderRowFilterTemplate}  />
                <Column field="estante" header="Estante" showFilterMenu={false} style={{ minWidth: '6rem', fontSize: '12px' }} body={(rowData)=> <span>{rowData.estante}</span>} filter />
                <Column field="prateleira" header="Prateleira" showFilterMenu={false} style={{ minWidth: '6rem', fontSize: '12px' }} body={(rowData)=> <span>{rowData.prateleira}</span>} filter />
                <Column field="quantidade" header="Exemplares" showFilterMenu={false} style={{ minWidth: '7rem', fontSize: '12px' }} filter body={(rowData)=> <span>{rowData.quantidade}</span>}  />
                <Column field="qtd_disponivel" header="Qtd. Disp." showFilterMenu={false} style={{ minWidth: '6rem', fontSize: '12px' }} body={(rowData)=> <span>{rowData.qtd_disponivel}</span>} filter />
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
