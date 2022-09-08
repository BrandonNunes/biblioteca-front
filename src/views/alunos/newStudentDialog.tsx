import { Dialog } from 'primereact/dialog';
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import { InputMask } from 'primereact/inputmask';
import { Toast } from 'primereact/toast';
import {useRef} from "react";
import {turmas, anos} from "../../utils/constantes";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {AlunosTypes} from "../../utils/types";
import {OptionDefault, SelectDefault } from '../../components/inputs';
import api from "../../services/api";

export default function NewStudentDialog(props: {showNewStudent: boolean, onHide: any, setShowNewStudent: any, refreshList: any}) {
    const toast = useRef<any>(null);
    const toastError = useRef<any>(null);
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<AlunosTypes>();
    const onSubmit: SubmitHandler<AlunosTypes> = async (data) => {
        try {
            await api.post("/alunos", data)
            showSuccess()
            reset()
            props.refreshList()
        } catch (e: any) {
            console.log(e)
            showError(e.response.mensagem);
        }
    };
    const hide = () => {
       reset();
       props.setShowNewStudent(false);
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
            toast.current?.show({severity: 'success', summary: 'Sucesso', detail: 'Novo aluno cadastrado com sucesso!'});
        }
    }
    const showError = (erroMessage: string) => {
        if(toastError.current != null){
            toastError.current?.show({severity: 'error', summary: 'Erro', detail: `${erroMessage}`});
        }
    }
    return(
        <Dialog header="Cadastro de novo aluno" visible={props.showNewStudent} maximizable={true} closable={false} style={{ width: '50vw', maxWidth: '70vw' }}  onHide={()=>onHide} footer={Footer} >
            <form onSubmit={handleSubmit(onSubmit)} className="card"style={{height: "100%", overflowY: "auto"}} >
                <div className="p-fluid grid" style={{padding: "20px", height: "100%", display: "flex", flexDirection: "column", gap:"20px"}}>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="nome" {...register("nome", { required: true })}  />
                            <label htmlFor="nome">Nome</label>
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
                        <span className="p-float-label">
                        <InputMask mask="(99) 99999-9999" id="telefone"
                                   {...register("telefone", { required: true })} >
                        </InputMask>
                            <label htmlFor="telefone">Telefone</label>
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
