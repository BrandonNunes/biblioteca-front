import { Dialog } from 'primereact/dialog';
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import {useEffect, useRef} from "react";
import {turmas, anos} from "../../utils/constantes";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {AlunosTypes, BookTypes, GenerosTypes} from "../../utils/types";
import {OptionDefault, SelectDefault } from '../../components/inputs';
import api from "../../services/api";

export default function EditBookDialog(props: {
    showEditBook: boolean,
    onHide: any,
    setShowEditBook: any,
    refreshList: any,
    selectedBook: BookTypes,
    genders: GenerosTypes[]}
    ) {
    const toast = useRef<any>(null);
    const toastError = useRef<any>(null);
    const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm<BookTypes>({
        defaultValues: {
            titulo: props.selectedBook ? props.selectedBook.titulo : '',
            autor: props.selectedBook ? props.selectedBook.autor : '',
            id_genero: props.selectedBook ? props.selectedBook.id_genero : 1,
            prateleira: props.selectedBook ? props.selectedBook.prateleira : '',
            estante: props.selectedBook ? props.selectedBook.estante : '',
            quantidade: props.selectedBook ? props.selectedBook.quantidade : 1,
            qtd_disponivel: props.selectedBook ? props.selectedBook.qtd_disponivel : 1
        }
    });
    const onSubmit: SubmitHandler<AlunosTypes> = async (data) => {
        const payload = {
            ...data,
            id: props.selectedBook.id
        }
        try {
            await api.put("/livros", payload)
            showSuccess()
            props.refreshList()
        } catch (e: any) {
            console.log(e)
            showError(e.response.mensagem);
        }
    };
    const hide = () => {
        reset();
        props.setShowEditBook(false);
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
        if (props.selectedBook) {
            setValue('titulo', props.selectedBook.titulo)
            setValue('autor', props.selectedBook.autor)
            setValue('id_genero', props.selectedBook.id_genero)
            setValue('prateleira', props.selectedBook.prateleira)
            setValue('estante', props.selectedBook.estante)
            setValue('quantidade', props.selectedBook.quantidade)
            setValue('qtd_disponivel', props.selectedBook.qtd_disponivel)
        }
    }, [props.selectedBook])

    return(
        <Dialog header="Editar dados do aluno" visible={props.showEditBook} maximizable={true} closable={false} style={{ width: '50vw', maxWidth: '70vw' }}  onHide={()=>onHide} footer={Footer} >
            <form onSubmit={handleSubmit(onSubmit)} className="card"style={{height: "100%", overflowY: "auto"}} >
                <div className="p-fluid grid" style={{padding: "20px", height: "100%", display: "flex", flexDirection: "column", gap:"20px"}}>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="titulo" {...register("titulo", { required: true })}  />
                            <label htmlFor="titulo">Titulo</label>
                        </span>
                        {errors.titulo && <span>Campo obrigat??rio</span>}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="autor" {...register("autor", { required: true })}  />
                            <label htmlFor="autor">Autor</label>
                        </span>
                        {errors.autor && <span>Campo obrigat??rio</span>}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span style={{display: "flex", flexDirection: "column"}}>
                            <label htmlFor="id_genero">Genero</label>
                            <SelectDefault id="id_genero" {...register("id_genero", { required: true })} >
                                {
                                    props.genders.map((gender, index)=>(
                                        <OptionDefault key={index} value={gender.id} >{gender.descricao}</OptionDefault>
                                    ))
                                }
                            </SelectDefault>
                        </span>
                        {errors.id_genero && <span>Campo obrigat??rio</span>}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="estante" {...register("estante", { required: true })}  />
                            <label htmlFor="estante">Estante</label>
                        </span>
                        {errors.estante && <span>Campo obrigat??rio</span>}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText id="prateleira" {...register("prateleira", { required: true })}  />
                            <label htmlFor="prateleira">Prateleira</label>
                        </span>
                        {errors.prateleira && <span>Campo obrigat??rio</span>}
                    </div>
                    <div className="field col-12 md:col-4">
                        <span className="p-float-label">
                            <InputText type="number" id="quantidade" {...register("quantidade", { required: true })}
                                       placeholder="Quantos exemplares?"/>
                            <label htmlFor="quantidade">Quantidade</label>
                        </span>
                        {errors.quantidade && <span>Campo obrigat??rio</span>}
                    </div>
                </div>
            </form>
            <Toast ref={toast} />
            <Toast ref={toastError} />
        </Dialog>
    )
}

