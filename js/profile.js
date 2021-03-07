/* Verifica se o usuario esta autenticado */
const db = firebase.firestore()
let currentUser = {}
let profile = false 

function getUser() {
    firebase.auth().onAuthStateChanged((user) => {
        if(user) {
            currentUser.uid = user.uid
            getUserInfo(user.uid)
            let userLabel = document.getElementById("navbarDropdown")
            userLabel.innerHTML = user.email
        } else {
            swal.fire ({
                icon: "success",
                title: "Redirecionando para a tela de autenticação",
            })
            .then(() => {
                setTimeout(() => {
                    window.location.replace("login.html")
                }, 1000)
            })
        }
    })
}
/* until here */

/* Consulta dos usuarios na base da firebase*/
async function getUserInfo(uid) {
    const logUsers = await db.collection("profile").where("uid", "==", uid).get()
    let userInfo = document.getElementById("userInfo")
    if (logUsers.docs.length == 0) {
        userInfo.innerHTML = "Perfil nao registrado"
    } else {
        userInfo.innerHTML = "Perfil registrado"
        profile = true
        const userData = logUsers.docs[0]
        currentUser.id = userData.id
        currentUser.firstName = userData.data().firstName
        currentUser.lastName = userData.data().lastName
        currentUser.perfilData = userData.data().perfilData
        currentUser.inputAddress = userData.data().inputAddress // data seguido do proprio atributo da tabela para consulta
        currentUser.inputNickname = userData.data().inputNickname

        document.getElementById("inputFirstName").value = currentUser.firstName     
        document.getElementById("inputLastName").value = currentUser.lastName
        document.getElementById("perfilData").value = currentUser.perfilData //aqui
        document.getElementById("inputNickname").value = currentUser.inputNickname
        document.getElementById("inputAddress").value = currentUser.inputAddress     
    }
}

async function saveProfile() {
    const firstName = document.getElementById("inputFirstName").value
    const lastName = document.getElementById("inputLastName").value
    const perfilData = document.getElementById("perfilData").value
    const inputNickname = document.getElementById("inputNickname").value
    const inputAddress = document.getElementById("inputAddress").value //pega a id que esta no input html
    console.log(perfilData)
    if (!profile) {
        await db.collection("profile").add({
            uid: currentUser.uid,
            firstName: firstName,
            lastName: lastName,
            perfilData: perfilData, //aqui 
            inputNickname: inputNickname,
            inputAddress: inputAddress,// o segundo campo é a variavel que foi criada acima
        })// o primeiro campo deve ser o proprio atributo na tabela, confirmar
        getUserInfo()
    } else {
        await db.collection("profile").doc(currentUser.id).update({ //busca pelo usuario, seguido de update
            firstName: firstName,
            lastName: lastName,
            perfilData: perfilData,// aqui
            inputNickname: inputNickname,
            inputAddress: inputAddress,
        }) 
    }
}


window.onload = function () {
    getUser() // pega as informacoes dos usuarios
}
