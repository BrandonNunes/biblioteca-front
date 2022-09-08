import { Dialog } from 'primereact/dialog';
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import {useEffect, useRef, useState} from "react";
import {turmas, anos} from "../../utils/constantes";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {AlunosTypes, BookTypes, CreateLocacaoTypes, LocacoesTypes} from "../../utils/types";
import {OptionDefault, SelectDefault } from '../../components/inputs';
import api from "../../services/api";
import {Calendar} from "primereact/calendar";
import {formateDate} from "../../utils";

export default function EditLocacaoDialog(props: {
    showEditLocacao: boolean,
    onHide: any,
    setShowEditLocacao: any,
    refreshList: any,
    selectedLocacao: LocacoesTypes,
    books: Array<BookTypes>,
    students: Array<AlunosTypes>}) {
    const toast = useRef<any>(null);
    const toastError = useRef<any>(null);
    const [locationDate, setLocationDate] = useState<Date>(new Date(props.selectedLocacao && props.selectedLocacao.data_devolucao));
    const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm<CreateLocacaoTypes>({
        defaultValues: {
            id_aluno: props.selectedLocacao ? props.selectedLocacao.aluno.id : 1,
            id_livro: props.selectedLocacao ? props.selectedLocacao.livro.id : 1,
            data_aluguel: props.selectedLocacao ? props.selectedLocacao.data_aluguel : '',
            data_devolucao: props.selectedLocacao ? props.selectedLocacao.data_devolucao : ''
        }
    });
    const onSubmit: SubmitHandler<CreateLocacaoTypes> = async (data) => {
        const payload = {
            id: props.selectedLocacao.id,
            data_devolucao: locationDate.toISOString().split("T")[0],
            status: Number(data.status)
        }
        console.log(payload)
        try {
            await api.put("/locacao", payload)
            showSuccess()
            props.refreshList()
            hide()
        } catch (e: any) {
            console.log(e)
            showError(e.response.mensagem);
        }
    };
    const hide = () => {
        reset();
        props.setShowEditLocacao(false);
    }
    const onHide = () => props.onHide
    const Footer = () => {
        return (
            <div>
                <Button label="Fechar" icon="pi pi-times" className="p-button-secundary" onClick={()=> hide()} />
                <Button label="Salvar" icon="pi pi-check" className="p-button-success" onClick={handleSubmit(onSubmit)} />
            </div>
        )
    }
    const showSuccess = () => {
        if(toast.current != null){
            toast.current?.show({severity: 'success', summary: 'Sucesso', detail: 'Registro atualizado com sucesso!'});
        }
    }
    const showError = (erroMessage: string) => {
        if(toastError.current != null){
            toastError.current?.show({severity: 'error', summary: 'Erro', detail: `${erroMessage}`});
        }
    }
    useEffect(() => {
        if (props.selectedLocacao) {
            setValue('id_aluno', props.selectedLocacao.aluno.id)
            setValue('id_livro', props.selectedLocacao.livro.id)
            setValue('data_aluguel', formateDate(props.selectedLocacao.data_aluguel.split("T")[0]))
            setValue('data_devolucao', props.selectedLocacao.data_devolucao +1)
            setValue('status', props.selectedLocacao.status)
            setLocationDate(new Date(props.selectedLocacao.data_devolucao))
        }
    }, [props.selectedLocacao])

    return(
        <Dialog header="Editar dados da locação" visible={props.showEditLocacao} maximizable={true} closable={false} style={{ width: '50vw', maxWidth: '70vw' }}  onHide={()=>onHide} footer={Footer} >
            <form onSubmit={handleSubmit(onSubmit)} className="card"style={{height: "100%", overflowY: "auto"}} >
                <div className="p-fluid grid" style={{padding: "20px", height: "100%", display: "flex", flexDirection: "column", gap:"20px"}}>
                    <div className="field col-12 md:col-4">
                        <span style={{display: "flex", flexDirection: "column"}}>
                            <label htmlFor="id_aluno">Aluno</label>
                            <SelectDefault id="id_aluno" {...register("id_aluno", { required: true })} disabled >
                                <OptionDefault  value="" >- - - Selecione um aluno - - -</OptionDefault>
                                {
                                    props.students.map((student, index)=>(
                                        <OptionDefault key={index} value={student.id} >{student.nome}</OptionDefault>
                                    ))
                                }
                            </SelectDefault>
                        </span>
                        {errors.id_aluno && <span>Campo obrigatório</span>}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span style={{display: "flex", flexDirection: "column"}}>
                            <label htmlFor="ano">Livro</label>
                            <SelectDefault id="id_livro" {...register("id_livro", { required: true })} disabled >
                                <OptionDefault  value="" >- - - Selecione um livro - - -</OptionDefault>
                                {
                                    props.books.map((book, index)=>(
                                        <OptionDefault key={index} value={book.id} >{book.titulo}</OptionDefault>
                                    ))
                                }
                            </SelectDefault>
                        </span>
                        {errors.id_livro && <span>Campo obrigatório</span>}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="">
                        <label htmlFor="data_aluguel">Data aluguel</label>
                        <InputText id="data_aluguel" disabled={true}
                                   {...register("data_aluguel", { required: true })} >
                        </InputText>
                        </span>
                        {errors.data_aluguel && <span>Campo obrigatório</span>}
                    </div>
                    <div className="field col-12 md:col-4">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="data_devolucao">Data devolução</label>
                            <Calendar
                                {...register("data_devolucao", { required: true })}
                                dateFormat="dd/mm/yy"
                                locale="pt"
                                id="data_devolucao" value={locationDate} onChange={(e) => setLocationDate(e.value)}
                                disabled={props.selectedLocacao && props.selectedLocacao.status === 1}/>
                        </div>
                        {errors.data_devolucao && <span>Campo obrigatório</span>}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span style={{display: "flex", flexDirection: "column"}}>
                            <label htmlFor="ano">Status da locação</label>
                            <SelectDefault id="id_livro" {...register("status", { required: true })}
                                           disabled={props.selectedLocacao && props.selectedLocacao.status === 1} >
                                        <OptionDefault value={0} >PENDENTE</OptionDefault>
                                        <OptionDefault value={1} >DEVOLVIDO</OptionDefault>
                            </SelectDefault>
                        </span>
                        {errors.status && <span>Campo obrigatório</span>}
                    </div>
                </div>
            </form>
            <Toast ref={toast} />
            <Toast ref={toastError} />
        </Dialog>
    )
}
