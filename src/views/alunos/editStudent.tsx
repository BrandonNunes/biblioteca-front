import { Dialog } from 'primereact/dialog';
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import {useEffect, useRef} from "react";
import {turmas, anos} from "../../utils/constantes";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {AlunosTypes} from "../../utils/types";
import {OptionDefault, SelectDefault } from '../../components/inputs';
import api from "../../services/api";

export default function EditStudentDialog(props: {
    showEditStudent: boolean,
    onHide: any,
    setShowEditStudent: any,
    refreshList: any,
    selectedStudent: AlunosTypes}) {
    const toast = useRef<any>(null);
    const toastError = useRef<any>(null);
    const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm<AlunosTypes>({
        defaultValues: {
            nome: props.selectedStudent ? props.selectedStudent.nome : '',
            ano: props.selectedStudent ? props.selectedStudent.ano : 1,
            turma: props.selectedStudent ? props.selectedStudent.turma : 'A',
            telefone: props.selectedStudent ? props.selectedStudent.telefone : ''
        }
    });
    const onSubmit: SubmitHandler<AlunosTypes> = async (data) => {
        const payload = {
            ...data,
            id: props.selectedStudent.id
        }
        try {
            await api.put("/alunos", payload)
            showSuccess()
            props.refreshList()
        } catch (e: any) {
            console.log(e)
            showError(e.response.mensagem);
        }
    };
    const hide = () => {
        reset();
        props.setShowEditStudent(false);
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
            toast.current?.show({severity: 'success', summary: 'Sucesso', detail: 'Registro salvo com sucesso!'});
        }
    }
    const showError = (erroMessage: string) => {
        if(toastError.current != null){
            toastError.current?.show({severity: 'error', summary: 'Erro', detail: `${erroMessage}`});
        }
    }
    useEffect(() => {
        if (props.selectedStudent) {
            setValue('nome', props.selectedStudent.nome)
            setValue('ano', props.selectedStudent.ano)
            setValue('turma', props.selectedStudent.turma)
            setValue('telefone', props.selectedStudent.telefone)
        }
    }, [props.selectedStudent])

    return(
        <Dialog header="Editar dados do aluno" visible={props.showEditStudent} maximizable={true} closable={false} style={{ width: '50vw', maxWidth: '70vw' }}  onHide={()=>onHide} footer={Footer} >
            <form onSubmit={handleSubmit(onSubmit)} className="card"style={{height: "100%", overflowY: "auto"}} >
                <div className="p-fluid grid" style={{padding: "20px", height: "100%", display: "flex", flexDirection: "column", gap:"20px"}}>
                    <div className="field col-12 md:col-4">
                        <span className="">
                            <label htmlFor="nome">Nome</label>
                            <InputText id="nome" {...register("nome", { required: true })}  />
                        </span>
                        {errors.nome && <span>Campo obrigatório</span>}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span style={{display: "flex", flexDirection: "column"}}>
                            <label htmlFor="ano">Ano</label>
                            <SelectDefault id="ano" {...register("ano", { required: true })} >
                                {
                                    anos.map((ano, index)=>(
                                        <OptionDefault key={index} value={ano.code} >{ano.name}</OptionDefault>
                                    ))
                                }
                            </SelectDefault>
                        </span>
                        {errors.ano && <span>Campo obrigatório</span>}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span style={{display: "flex", flexDirection: "column"}}>
                            <label htmlFor="ano">Turma</label>
                            <SelectDefault id="ano" {...register("turma", { required: true })} >
                                {
                                    turmas.map((t, index)=>(
                                        <OptionDefault key={index} value={t.turma} >{t.turma}</OptionDefault>
                                    ))
                                }
                            </SelectDefault>
                        </span>
                        {errors.turma && <span>Campo obrigatório</span>}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="">
                        <label htmlFor="telefone">Telefone</label>
                        <InputText id="telefone" {...register("telefone", { required: true })}  />
                        </span>
                        {errors.telefone && <span>Campo obrigatório</span>}
                    </div>

                </div>
            </form>
            <Toast ref={toast} />
            <Toast ref={toastError} />
        </Dialog>
    )
}
