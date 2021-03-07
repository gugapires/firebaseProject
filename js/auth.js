//function alerta() {
//    Swal.fire({
//        icon: "success",
//        title: "Bem vindo",
//    })
//}

//background: "#343A40",
//text: "A custom <span style="color:#000">html<span> message.",


function login() {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut()
    }
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        swal
          .fire({
            icon: "success",
            title: "<span style='color:#fff'>Login realizado com sucesso!<span>",
            background: "#343A40",
          })
          .then(() => {
            setTimeout(() => {
              window.location.replace("index.html")
            }, 1000)
          })
      })
      .catch((error) => {
        const errorCode = error.code
        switch (errorCode) {
          case "auth/wrong-password":
            swal.fire({
              icon: "error",
              title: "<span style='color:#fff'>Senha inválida<span>",
              background: "#343A40",
            })
            break
          case "auth/invalid-email":
            swal.fire({
              icon: "error",
              title: "<span style='color:#fff'>E-mail inválido<span>",
              background: "#343A40",
            })
            break
          case "auth/user-not-found":
            swal
              .fire({
                icon: "warning",
                title: "<span style='color:#fff'>Usuário não encontrado<span>",
                text: "<span style='color:#fff'>Deseja criar esse usuário?<span>",
                showCancelButton: true,
                cancelButtonText: "Não",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sim",
                confirmButtonColor: "#3085d6",
                background: "#343A40",
              })
              .then((result) => {
                if (result.value) {
                  signUp(email, password)
                }
              })
            break
          default:
            swal.fire({
              icon: "error",
              title: error.message,
            })
        }
      })
  }
  
  function signUp(email, password) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        swal
          .fire({ 
              icon: "success", 
              title: "<span style='color:#fff'>Usuário foi criado com sucesso<span>",
              background: "#343A40",
            })
          .then(() => {
            setTimeout(() => {
              window.location.replace("index.html")
            }, 1000)
          })
      })
      .catch((error) => {
        const errorCode = error.code
        switch (errorCode) {
          case "auth/weak-password":
            swal.fire({
              icon: "error",
              title: "<span style='color:#fff'>Senha muito fraca<span>",
              background: "#343A40",
            })
            break
          default:
            swal.fire({
              icon: "error",
              title: error.message,
              background: "#343A40",
            })
        }
      })
  }
  
  function logout() {
    firebase.auth().signOut()
  }
  