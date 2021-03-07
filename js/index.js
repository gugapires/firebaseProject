const db = firebase.firestore()
let tasks = []
let currentUser = {}

function getUser() {
    firebase.auth().onAuthStateChanged((user) => {
        if(user) {
            currentUser.uid = user.uid
            readTasks() // apenas le/ve as tarefas se o usuario tiver autenticado
            let userLabel = document.getElementById("navbarDropdown")
            userLabel.innerHTML = user.email
        } else {
            swal.fire ({
                icon: "success",
                title: "<span style='color:#fff'>Redirecionando para a tela de autenticação</span>",
                background: "#343A40",
            })
            .then(() => {
                setTimeout(() => {
                    window.location.replace("login.html")
                }, 1000)
            })
        }
    })
}



function createDelButton(task) {
    const newButton = document.createElement("button")
    newButton.setAttribute("class", "btn btn-primary")
    newButton.appendChild(document.createTextNode("Excluir"))
    newButton.setAttribute('onclick', `deleteTask("${task.id}")`)
    return newButton
}

// aula 15 e 16 ele fala de como pegar os itens do banco de dados
//minuto 8:30 aula 16 // 
function renderTasks(){
    let itemList = document.getElementById("itemList")
    itemList.innerHTML = ""
    for (let task of tasks) {
        const newItem = document.createElement("li")
        newItem.setAttribute(
            "class",
            "list-group-item d-flex justify-content-between bg-dark text-light offset-3 col-7",// componente e criado a partir daqui, por isso estou mudando a cor aqui, isso vai ser renderizado no html
        )
        newItem.appendChild(document.createTextNode(task.title))
        newItem.appendChild(document.createTextNode("\xa0\xa0\xa0\xa0\xa0\xa0 "+task.dataTarefa))
        newItem.appendChild(createDelButton(task))
        itemList.appendChild(newItem)
    }
}


async function readTasks() {
    tasks = []
    const logTasks = await db
        .collection("tasks")
        .where("owner", "==", currentUser.uid)
        .get() // quando o campo owner for igual ao usuario atual ele ira busca-lo
    for (doc of logTasks.docs) {
        tasks.push({
            id: doc.id,
            title: doc.data().title,
            dataTarefa: doc.data().dataTarefa,
        })
    }
    renderTasks()
}

async function addTask(){
    //evitar que seja colocado valores em branco, required do html n funcionou
    if(document.getElementById("newItem").value==null || document.getElementById("newItem").value=="") {
        alert("Você precisa digitar a tarefa!");
        return false;
    }

    if(document.getElementById("newItemAnother").value==null || document.getElementById("newItemAnother").value=="") {
        alert("Você precisa escolher a data!");
        return false;
    }
   
    const itemList = document.getElementById("itemList")
    const newItem = document.createElement("li")   
    newItem.setAttribute("class", "list-group-item bg-dark text-light")
    newItem.appendChild(document.createTextNode("Adicionando na nuvem..."))
    itemList.appendChild(newItem) 
   
    
    const title = document.getElementById("newItem").value
    const dataTarefa = document.getElementById("newItemAnother").value

    await db.collection("tasks").add({
        title: title,
        dataTarefa: dataTarefa,
        owner: currentUser.uid, // a cada nova tarefa adicionada saberas quem es o proprietario da tarefa 
    })
    readTasks()
}

async function deleteTask(id) {
    await db.collection('tasks').doc(id).delete()
    readTasks()
}

// Para as mudancas terem efeito tem que digitar : firebase deploy // ele da um update nas mudancas
// depois disso sera atualizado e podera ser acessado pelo link que ele disponibiliza
// firebase login - para fazer login
// firebase init - para iniciar o projeto, apaga public e deixa `.` (ponto)
// coloca como hosting e demais informacoes pode colocar No



window.onload = function () {
    getUser() // pega as informacoes dos usuarios
    //readTasks() // Le as tarefas
}


