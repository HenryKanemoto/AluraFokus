interface Tarefa {
    descricao: string
    concluida: boolean
}

interface EstadoAplicacao{
    tarefas: Tarefa[]
    tarefaSelecionada: Tarefa | null
}

let estadoInicial: EstadoAplicacao = {
    tarefas: [
        {
            descricao: 'Tarefa concluída',
            concluida: true
        },
        {
            descricao: 'Tarefa pendente 1',
            concluida: false
        },
        {
            descricao: 'Tarefa pendente 2',
            concluida: false
        }
    ],
    tarefaSelecionada: null
};

const selecionarTarefa = (estado: EstadoAplicacao, tarefa: Tarefa) : EstadoAplicacao => {
    return {
        ...estado,
        tarefaSelecionada: tarefa === estado.tarefaSelecionada ? null : tarefa
    }
};

const adicionarTarefa = (estado: EstadoAplicacao, tarefa: Tarefa) : EstadoAplicacao => {

    return {
        ...estado,
        tarefas: [...estado.tarefas, tarefa]
    }
}

const editarTarefa = (estado: EstadoAplicacao, tarefa: Tarefa, novaDescricao: string) : EstadoAplicacao => {

    tarefa.descricao = novaDescricao;
    return {
        ...estado,
        tarefas: [...estado.tarefas]
    }
}

const deletarTarefa = (estado: EstadoAplicacao, idTarefa:  number) : EstadoAplicacao => {
    estado.tarefas.splice(idTarefa, 1)
    return {
        ...estado,
        tarefas: [...estado.tarefas]
    }
}

const removerConcluidas = (estado: EstadoAplicacao) => {
    const estadoFiltrado = estado.tarefas.filter(tarefa => tarefa.concluida === false);
    estado.tarefas = estadoFiltrado
    
    return{
        ...estado,
        tarefas: [...estado.tarefas]
    };
}


//      PARA CASO QUEIRA USAR UMA FUNÇÃO SEPARADA PARA LIMPAR TODAS


// const removerTodas = (estado: EstadoAplicacao) : EstadoAplicacao => {
//     estado.tarefas = [];

//     return {
//         ...estado,
//         tarefas: [...estado.tarefas]
//     }
// }

const atualizarUI = () => {
    const taskIconSvg = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
        fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF" />
        <path
            d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
            fill="#01080E" />
    </svg>
    `

    const ulTarefas = document.querySelector('.app__section-task-list');
    const formAdicionarTarefa = document.querySelector<HTMLFormElement>('.app__form-add-task');
    const btnAdicionarTarefa = document.querySelector<HTMLButtonElement>('.app__button--add-task');
    const textarea = document.querySelector<HTMLTextAreaElement>('.app__form-textarea');
    const paragraphTarefaSelecionada = document.querySelector<HTMLParagraphElement>('.app__section-active-task-description');
    const btnRemoveConcluidas = document.getElementById('btn-remover-concluidas') as HTMLButtonElement;
    const btnRemoveTodas = document.getElementById('btn-remover-todas') as HTMLButtonElement; 


    if(!btnAdicionarTarefa){
        throw new Error('O elemento btnAdicionarTarefa não foi encontrado')
    }   

    btnAdicionarTarefa.onclick = () => {
        formAdicionarTarefa.classList.toggle('hidden');
    }

    formAdicionarTarefa.onsubmit = (event) => {
        event.preventDefault();
        const descricao = textarea.value;
        estadoInicial = adicionarTarefa(estadoInicial, {
            descricao,
            concluida: false
        })
        formAdicionarTarefa.classList.toggle('hidden');
        textarea.value = ''
        atualizarUI();
    }

    if(ulTarefas){
        ulTarefas.innerHTML = '';
    }
    if (paragraphTarefaSelecionada) {
        paragraphTarefaSelecionada.innerHTML = '';      
    }    

    estadoInicial.tarefas.forEach(tarefa => {
        const li = document.createElement('li');
        li.classList.add('app__section-task-list-item');

        const svgIcon = document.createElement('svg');
        svgIcon.innerHTML = taskIconSvg;

        const paragraph = document.createElement('p');
        paragraph.classList.add('app__section-task-list-item-description');
        paragraph.textContent = tarefa.descricao;

        const button = document.createElement('button');
        button.classList.add('app_button-edit');

        const editIcon = document.createElement('img');
        editIcon.setAttribute('src', '/imagens/edit.png');
        button.appendChild(editIcon);


        if (tarefa.concluida) {
            button.setAttribute('disabled', 'true');
            li.classList.add('app__section-task-list-item-complete');
        };

        li.appendChild(svgIcon);
        li.appendChild(paragraph);
        li.appendChild(button);

        button.addEventListener('click', () => {
            const btnCancel = document.querySelector<HTMLButtonElement>('.app__form-footer__button--cancel');
            const btnDelete = document.querySelector<HTMLButtonElement>('.app__form-footer__button--delete');
            const idTarefa = estadoInicial.tarefas.indexOf(tarefa) as number;

            if(formAdicionarTarefa.classList.contains('hidden')){
                formAdicionarTarefa.classList.toggle('hidden');
                textarea.value = tarefa.descricao;
            } 
            else{
                textarea.value = tarefa.descricao;
            }

            btnCancel.onclick = () => {
                textarea.value = '';
                formAdicionarTarefa.classList.toggle('hidden');
            }
            btnDelete.onclick = () => {
                textarea.value = '';
                formAdicionarTarefa.classList.toggle('hidden');
                estadoInicial = deletarTarefa(estadoInicial, idTarefa)
                atualizarUI();
            }

            formAdicionarTarefa.onsubmit = (event) => {
                event.preventDefault();
                const descricao = textarea.value;
                formAdicionarTarefa.classList.toggle('hidden');
                estadoInicial = editarTarefa(estadoInicial, tarefa, descricao) //Repetição de codigo
                textarea.value = ''
                atualizarUI();
            }
        })

        li.addEventListener('click', (e) => {     
            if(!tarefa.concluida && e.target != editIcon){
                if(estadoInicial.tarefaSelecionada === tarefa){
                    tarefa.concluida = true
                    estadoInicial = selecionarTarefa(estadoInicial, tarefa)
                }
                else{
                    if(estadoInicial.tarefaSelecionada){
                        estadoInicial.tarefaSelecionada.concluida = true
                    }
                    estadoInicial = selecionarTarefa(estadoInicial, tarefa);
                }
                atualizarUI();
            }
        })

        if(estadoInicial.tarefaSelecionada === tarefa){
            paragraphTarefaSelecionada.append(li);
        }
        else{        
            ulTarefas.appendChild(li);
        }
    })

    btnRemoveConcluidas.onclick = () => {
        estadoInicial = removerConcluidas(estadoInicial);
        atualizarUI();
    }

    btnRemoveTodas.onclick = () => {
        estadoInicial.tarefas = [];
        atualizarUI();
    }
}

document.addEventListener('TarefaFinalizada', () => {
    if(estadoInicial.tarefaSelecionada){
        estadoInicial.tarefaSelecionada.concluida = true;
        atualizarUI();
    }
})

atualizarUI();
