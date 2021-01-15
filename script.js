let lista=document.getElementById('lista')
let alerta=document.getElementById('alerta')
let btn=document.getElementById('botao')

//Se tiver o elemento 'tarefas' no localStorage ele será convertido de json para objeto e salvo em tarefas, caso contrario tarefas será um array vazio
let tarefas=JSON.parse(localStorage.getItem('tarefas'))||[]

Focar()
RenderizarTarefa()

//Função Executada ao clicar em 'Adicionar'
btn.onclick=()=>{
  transcricao_audio=''
  alerta.innerHTML=''
  let txt=document.getElementById('EntradaTexto').value
  if (txt!=''){
    let dataDaTarefa=document.getElementById('data').value
    let horarioDaTarefa=document.getElementById('hora').value

    if(dataDaTarefa=='' && horarioDaTarefa!=''){
      dataDaTarefa=TratarHoraPreenchidaAndDataVazia(horarioDaTarefa)
    }
    InstanciarObjeto(txt,dataDaTarefa,horarioDaTarefa)
    RenderizarTarefa()
    SalvarNoStorage()
  }else{
    CriarSpan()
  } 
  Focar()
}

function TratarHoraPreenchidaAndDataVazia(horarioDaTarefa){
  let horaAndMinuto=horarioDaTarefa.split(':')
  let dataCompleta=RetornarObjetoData(horaAndMinuto[0],horaAndMinuto[1])

  let ano=dataCompleta.getFullYear()
  let mes=dataCompleta.getMonth()+1 //mes vai de 0 a 11
  let dia=dataCompleta.getDate()
  let dataSimples
  //Formataçao do mes
  mes=Formatar(mes)
  dia=Formatar(dia)

  return dataSimples=`${ano}-${mes}-${dia}`
}

function RetornarObjetoData(horaDaTarefa,minDaTarefa){
  let dataAtual=new Date()
  let horaAtual=dataAtual.getHours()
  let minAtual=dataAtual.getMinutes()  
  if(horaDaTarefa<horaAtual){
    dataAtual.setDate(dataAtual.getDate() + 1)
  }else if(horaDaTarefa==horaAtual){
    if(minDaTarefa<=minAtual){
      dataAtual.setDate(dataAtual.getDate() + 1)
    }
  }
  return new Date(dataAtual)
}

function InstanciarObjeto(texto,data,hora){
  const Tarefa={}
  Tarefa.nome=texto
  Tarefa.prazo={}
  Tarefa.prazo.data=data
  Tarefa.prazo.hora=hora
  Tarefa.check=false
  tarefas.unshift(Tarefa)
}

function RenderizarTarefa(){
  if(tarefas!=''){
    lista.innerHTML=''
    for(let i=0;i<tarefas.length;i++){
      let novaTarefa=document.createElement('li')
      novaTarefa.setAttribute('class','tarefa')

      let texto=document.createTextNode(tarefas[i].nome)
      let paragrafoTexto=document.createElement('p')
      paragrafoTexto.setAttribute('class','paragrafoTexto')
      paragrafoTexto.appendChild(texto)

      let divTextPrazo=document.createElement('div')
      divTextPrazo.setAttribute('class','divTextoPrazo')


      let botaoTarefa=document.createElement('button')
      //botaoTarefa.setAttribute('type','button')
      //botaoTarefa.setAttribute('value','X')
      botaoTarefa.innerHTML='X'
      botaoTarefa.setAttribute('class','botaoTarefa')

      let check=document.createElement('INPUT')
      check.setAttribute('type','checkbox')
      check.setAttribute('class','check')

      if(tarefas[i].check==true){
        check.checked=true
      }

      //let divCheck=document.createElement('div')
      //divCheck.setAttribute('class','divCheck')
      //divCheck.appendChild(check)

      
      divTextPrazo.appendChild(paragrafoTexto)

      novaTarefa.appendChild(check)
      novaTarefa.appendChild(divTextPrazo)
      novaTarefa.appendChild(botaoTarefa)
      

      //novaTarefa.appendChild(texto)
      
      lista.appendChild(novaTarefa)

      //Função executada ao clicar em uma tarefa
      botaoTarefa.onclick=function(){
        tarefas.splice(i,1)
        SalvarNoStorage()
        RenderizarTarefa()
      }
      //Função executada ao clicar em um checkbox
      check.onclick=function(){
        tarefas[i].check=true
        SalvarNoStorage()
        RenderizarTarefa()
      }
      DefinirPrazo(tarefas[i],divTextPrazo)
    }
    Focar()
    lista.style.display='block'
  }else{
    lista.style.display='none'
  }
}

function SalvarNoStorage(){
  localStorage.setItem('tarefas',JSON.stringify(tarefas))
}

function CriarSpan(){
  txtSpan=document.createTextNode('Você precisa informar a tarefa')
  let span=document.createElement('span')
  span.setAttribute('id','span')
  span.appendChild(txtSpan)
  alerta.appendChild(span)
}

function Focar(){
  document.getElementById('EntradaTexto').value=''
  document.getElementById('EntradaTexto').focus()
}

function DefinirPrazo(tarefa,novaTarefa){  
  if(tarefa.prazo.data!='' || tarefa.prazo.hora!=''){
    let txtprazo
    txtprazo=document.createTextNode(RetornarPrazoAtualizadoConformeData(tarefa.prazo.data,tarefa.prazo.hora))
    let p=document.createElement('p')
    p.setAttribute('class','prazo')
    p.appendChild(txtprazo)
    novaTarefa.appendChild(p)
    }
}

function Formatar(a){
  if (a<10){
    return '0' +`${a}`
  }else{
    return a
  }
}


function RetornarPrazoAtualizadoConformeData(data,hora){
  //Ontem
  let ontem=new Date(new Date().setDate(new Date().getDate() -1))
  let ontemAno=ontem.getFullYear()
  let ontemMes=Formatar(ontem.getMonth()+1)
  let ontemDia=Formatar(ontem.getDate())
  //Hoje
  let hoje=new Date()
  let hojeAno=hoje.getFullYear()
  let hojeMes=Formatar(hoje.getMonth()+1)
  let hojeDia=Formatar(hoje.getDate())
  //Amanhã
  let amanha=new Date(new Date().setDate(new Date().getDate() +1))
  let amanhaAno=amanha.getFullYear()
  let amanhaMes=Formatar(amanha.getMonth()+1)
  let amanhaDia=Formatar(amanha.getDate())
  
  let resultado=''
  if(data==`${ontemAno}-${ontemMes}-${ontemDia}`){
    resultado= `Ontem`
  }else if(data==`${hojeAno}-${hojeMes}-${hojeDia}`){
    resultado= `Hoje`
  }else if(data==`${amanhaAno}-${amanhaMes}-${amanhaDia}`){
    resultado=`Amanhã`
  }else{
    let arrayDeMeses=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']
    let diasDaSemana=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
    let diaSemana=new Date(`${data} 00:00`).getDay() //Sem uma hora o resultado acaba sendo um dia anterior
    let arrayDaData=data.split('-')
    let mes=Number(arrayDaData[1])-1

    resultado= `${diasDaSemana[diaSemana]}, ${arrayDaData[2]} de ${arrayDeMeses[mes]} de ${arrayDaData[0]}`
  }
  if(hora!=''){
    resultado=resultado+`, ${hora}`     
  }
  return resultado
}

//Reconhecimento de voz
///////////////////////////////////////////////////////////////
let btn_gravacao=document.getElementById('figuraMicro')

let transcricao_audio=''
let esta_gravando=false

//verifica se o navegador tem suporte ao uso da bibliotecas da api da api
if(window.SpeechRecognition || window.webkitSpeechRecognition){
  let speech_api=window.SpeechRecognition || window.webkitSpeechRecognition
  let recebe_audio=new speech_api()

  recebe_audio.continuous=true//false
  recebe_audio.lang="pt-BR"

  btn_gravacao.addEventListener('click',function(){
    if(esta_gravando){
      recebe_audio.stop()
      document.getElementById('micro').style.color='gray'
    }else{
      transcricao_audio=''
      recebe_audio.start()
      document.getElementById('micro').style.color='black'
    }
  })

  recebe_audio.onstart=function(){
    console.log('iniciou')
    esta_gravando=true
  }

  //Executa depois que a fala é finalizada
  recebe_audio.onend=function(){
    esta_gravando=false
    document.getElementById('micro').style.color='gray'
    //btn_gravacao.innerHTML='Iniciar Gravação'
  }
  
  //Imprime o resultado
  recebe_audio.onresult=function(event){
    for(let i=event.resultIndex;i<event.results.length;i++){
      if(event.results[i].isFinal){
        transcricao_audio+=event.results[i][0].transcript
      }else{
        transcricao_audio+=event.results[i][0].transcript
      }
      let resultado=transcricao_audio
      document.getElementById('EntradaTexto').value=resultado
    }
  }
}else{
  console.log('O navegador não apresenta suporte a web speech api')
}
