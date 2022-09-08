import { Dialog } from 'primereact/dialog';
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import {useRef, useState} from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {AlunosTypes, BookTypes, CreateLocacaoTypes} from "../../utils/types";
import {OptionDefault, SelectDefault } from '../../components/inputs';
import api from "../../services/api";
import {formateDate} from "../../utils";
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';



export default function NewLocacaoDialog(props: {
    showNewLocacao: boolean,
    onHide: any,
    setShowNewLocacao: any,
    refreshList: any,
    books: Array<BookTypes>,
    students:Array<AlunosTypes>}) {
    const toast = useRef<any>(null);
    const toastError = useRef<any>(null);
    const atualDate = new Date().toISOString();
    const [locationDate, setLocationDate] = useState<Date | Date[]>(new Date());
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateLocacaoTypes>({
        defaultValues: {
            data_aluguel: formateDate(atualDate),
            data_devolucao: String(formateDate(locationDate.toString()))
        }
    });

    addLocale('pt', {
        closeText: 'Fechar',
        prevText: 'Anterior',
        nextText: 'Próximo',
        currentText: 'Começo',
        monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
        monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun', 'Jul','Ago','Set','Out','Nov','Dez'],
        dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
        dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
        dayNamesMin: ['D','S','T','Q','Q','S','S'],
        weekHeader: 'Semana',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: '',
        timeOnlyTitle: 'Só Horas',
        timeText: 'Tempo',
        hourText: 'Hora',
        minuteText: 'Minuto',
        secondText: 'Segundo',
        ampm: false,
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        allDayText : 'Todo Dia'
    });

    const onSubmit: SubmitHandler<CreateLocacaoTypes> = async (data) => {
        const payload = {
            ...data,
            data_aluguel: atualDate.split("T")[0],
            data_devolucao: locationDate.toISOString().split("T")[0]
        }
        try {
            await api.post("/locacao", payload)
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
       props.setShowNewLocacao(false);
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
        <Dialog header="Nova Locação" visible={props.showNewLocacao} maximizable={true} closable={false} style={{ width: '50vw', maxWidth: '70vw' }}  onHide={()=>onHide} footer={Footer} >
            <form onSubmit={handleSubmit(onSubmit)} className="card"style={{height: "100%", overflowY: "auto"}} >
                <div className="p-fluid grid" style={{padding: "20px", height: "100%", display: "flex", flexDirection: "column", gap:"20px"}}>
                    <div className="field col-12 md:col-4">
                        <span style={{display: "flex", flexDirection: "column"}}>
                            <label htmlFor="id_aluno">Aluno</label>
                            <SelectDefault id="id_aluno" {...register("id_aluno", { required: true })} >
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
                            <SelectDefault id="id_livro" {...register("id_livro", { required: true })} >
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
                                id="data_devolucao" value={locationDate} onChange={(e) => setLocationDate(e.value)} />
                        </div>
                        {errors.data_devolucao && <span>Campo obrigatório</span>}
                    </div>
                </div>
            </form>
            <Toast ref={toast} />
            <Toast ref={toastError} />
        </Dialog>
    )
}
