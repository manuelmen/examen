var firebaseConfig = {
    apiKey: "AIzaSyAN0pQGsJqTV95wSvUfvFQOjMLz9QK_bvA",
    authDomain: "biketours-f3d93.firebaseapp.com",
    projectId: "biketours-f3d93",
    storageBucket: "biketours-f3d93.appspot.com",
    messagingSenderId: "742697361966",
    appId: "1:742697361966:web:3b1050192666a00cf3b5bf",
    measurementId: "G-RLTL755PRQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
///
const formregis = document.querySelector('#formregis');

//expresiones iregulares
const expresiones ={
  ExprexionPalabra: /^[a-zA-ZÀ-ÿ\s]{1,50}$/, // Letras y espacios, pueden llevar acentos.
  ExprexionPassword: /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/, // 4 a 12 digitos.
  ExprexionCorreo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  Exprexioncedula: /^\d{10,10}$/,
}

/////

if(formregis){
    const inputs = document.querySelectorAll('#formregis input');
    const campos={
        Vnombre: false,
        Vapellido: false,
        Vcorreo: false,
        Vpassword: false
    }
    //velidamos los inputs
    const ValidarInputs = (e) => {
        console.log(e.target.name);
        switch(e.target.name){
            case 'nombre':
                validadCampo(expresiones.ExprexionPalabra, e.target, 'Vnombre')
            break;
            case 'apellido':
                validadCampo(expresiones.ExprexionPalabra, e.target, 'Vapellido')
            break;
            case 'correo':
                validadCampo(expresiones.ExprexionCorreo, e.target, 'Vcorreo')
            break;
            case 'password':
                validadCampo(expresiones.ExprexionPassword, e.target, 'Vpassword')
            break;
        }
    }
    const validadCampo= (expresion, input, campo)=>{
        const error = document.querySelector(`#Error${campo}`)
        if(expresion.test(input.value)){
            console.log('correcto');
            error.style.visibility = 'hidden';
            campos[campo] = true;
        }else{
            console.log('incorrecto');
            error.style.visibility = 'visible';
            campos[campo] = false;
        }
    }
    inputs.forEach((input) => {
      input.addEventListener('keyup', ValidarInputs);
    });
    formregis.addEventListener('submit', e =>{
        e.preventDefault();
        if(campos.Vnombre && campos.Vapellido && campos.Vcorreo && campos.Vpassword){
            const nombre = document.querySelector('#nombre').value;
            const apellido = document.querySelector('#apellido').value;
            const correo = document.querySelector('#correo').value;
            const password = document.querySelector('#password').value;
            console.log('correcto');
            auth
            .createUserWithEmailAndPassword(correo,password)
            .then(userCredential => {
                db.collection('ciclista').doc().set({
                    nombre,
                    apellido,
                    correo,
                    password
                })
                .then(function() {
                  window.alert("Usuario Registrado");
                  window.location.href='login.html';
                  console.log('registrado')
                })
                .catch(function(error) {
                  window.alert("Usuario No Registrado");
                });

            })

            .catch(function(error) {
                console.log('ERRO');
                if(error.code =='auth/invalid-email'){
                  window.alert("El correo en invalido o ya existe en nuestra base de datos");
                }
            });
        }else{
            console.log('no correcto');
        }
    })
}

////

///Ingreso de usuario
const formIngresar = document.querySelector('#formIngresar');
if(formIngresar){
    formIngresar.addEventListener('submit', e =>{
        e.preventDefault();
        const correo = document.querySelector('#logiCorreo').value;
        const password = document.querySelector('#logiPassword').value;
        auth
            .signInWithEmailAndPassword(correo,password)
            .then(userCredential=>{
                console.log('ingreso')
                VerificaElUsuario();
            })
            .catch(function(error) {
                Carga.style.visibility = 'hidden';
                Carga.style.opacity = '0';
                if(error.code == 'auth/user-not-found' || error.code =='auth/invalid-email'){
                  window.alert('El usuario no esta registrado');
                }else if(error.code == 'auth/wrong-password'){
                  window.alert('La contraseña esta incorrecta');
                }
            });
            
    })
}

//Verificamos al usuario
const VerificaElUsuario = ()=>{
  auth.onAuthStateChanged( async user =>{
      if(user){
          const getCivlistas = await db.collection("ciclista").where("correo", "==", `${user.email}`).get();
          if(getCivlistas.docChanges().length >= 1){
              getCivlistas.forEach(doc => {
                  //menuOcul2.style.display= 'none';
                  window.location.href='reserva.html';
              })
          }else{
              window.location.href='consulta.html';
          }
      }else{
          console.log('no login');
      }
  });
}

///Guardar Ruta
const RegisRuta = document.querySelector('#RegisRuta');
const GuardaRuta = (nombres,apellidos,cedula,edad,ruta,fecha,hora,estado) =>
    db.collection('rutas').doc().set({
        nombres,
        apellidos,
        cedula,
        edad,
        ruta,
        fecha,
        hora,
        estado
    }).then(registrado =>{
        window.alert('Ruta Registrada')
    })
if(RegisRuta){
    const inputs = document.querySelectorAll('#RegisRuta input');
    const campos2={
        Vnombre: false,
        Vapellido: false,
        Vcedula: false,
        Vedad: false
    }
    //validamos los inputs
    const ValidarInputs = (e) => {
        console.log(e.target.name);
        switch(e.target.name){
            case 'nombres':
                validadCampo2(expresiones.ExprexionPalabra, e.target, 'Vnombre')
            break;
            case 'apellidos':
                validadCampo2(expresiones.ExprexionPalabra, e.target, 'Vapellido')
            break;
            case 'cedula':
                validadCampo2(expresiones.Exprexioncedula, e.target, 'Vcedula')
            break;
            case 'edad':
                const error = document.querySelector('#ErrorVedad')
                if(e.target.value > 0 && e.target.value < 150){
                    console.log('correcto');
                    error.style.visibility = 'hidden';
                    campos2['Vedad'] = true;
                }else{
                    console.log('incorrecto');
                    error.style.visibility = 'visible';
                    campos2['Vedad'] = false;
                }
            break;
        }
    }
    const validadCampo2= (expresion, input, campo)=>{
        const error = document.querySelector(`#Error${campo}`)
        if(expresion.test(input.value)){
            console.log('correcto');
            error.style.visibility = 'hidden';
            campos2[campo] = true;
        }else{
            console.log('incorrecto');
            error.style.visibility = 'visible';
            campos2[campo] = false;
        }
    }
    inputs.forEach((input) => {
      input.addEventListener('keyup', ValidarInputs);
    });
    RegisRuta.addEventListener('submit', async (e) =>{
        e.preventDefault();
        const nombres = RegisRuta['nombres'];
        const apellidos = RegisRuta['apellidos'];
        const cedula = RegisRuta['cedula'];
        const edad = RegisRuta['edad'];
        const ruta = RegisRuta['ruta'];
        const fecha = RegisRuta['fecha'];
        const hora = RegisRuta['hora'];
        const estado = 'revisar'
        if(campos2.Vnombre && campos2.Vapellido && campos2.Vcedula && campos2.Vedad ){
            await GuardaRuta(
                nombres.value,
                apellidos.value,
                cedula.value,
                edad.value,
                ruta.value,
                fecha.value,
                hora.value,
                estado
            );
            RegisRuta.reset();
            nombres.focus();
        }else{
            console.log('no correcto');
        }
        
    });
}
/////

///Mostrar Rutas
const ContenidoConsulta = document.querySelector('#ContenidoConsulta');
if(ContenidoConsulta){
    window.addEventListener("DOMContentLoaded", (e) => {
        const onGetRutas = (callback) => db.collection('rutas').onSnapshot(callback);
        onGetRutas((querySnapshot)=>{
            Datos(querySnapshot);
        })
    });
    //Cerrar sesión
    const sesion = document.querySelector('#sesion');
    sesion.addEventListener('click',e =>{
        console.log('cerrar');
        e.preventDefault();
        auth.signOut().then(()=>{
            window.location.href='login.html';
        })
    })
}
///Buscar por rutas
const BusquedaRuta = document.querySelector('#BusquedaRuta');
if(BusquedaRuta){
    BusquedaRuta.addEventListener('submit', async (e) =>{
        e.preventDefault();
        const Busqueda = BusquedaRuta['Busqueda'];
        console.log(Busqueda.value);
        var getssRutas = () =>  db.collection("rutas").where("ruta", "==", `${Busqueda.value}`).get();
        const querySnapshot = await getssRutas();
        Datos(querySnapshot);
    })
}

//Buscar por fecha
//FILTAR FECHA
const FiltrarFecha = document.querySelector('#FiltrarFecha');
if(FiltrarFecha){
    FiltrarFecha.addEventListener('submit', async (e) =>{ 
        e.preventDefault();
        const desde = FiltrarFecha['desde'];
        const hasta = FiltrarFecha['hasta'];
        const getssRutas = () =>  db.collection("rutas").where("fecha", ">=", `${desde.value}`).where("fecha", "<=", `${hasta.value}`).get();
        const querySnapshot = await getssRutas();
        Datos(querySnapshot);
    });
}

///Datos en la tabla
const ActualizaRuta = (id, ActualizaCita) => db.collection('rutas').doc(id).update(ActualizaCita);
function Datos(querySnapshot){
    if(querySnapshot.docChanges().length >= 1){
        BodyRutas.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const ruta = doc.data();
            ruta.id= doc.id;
            BodyRutas.innerHTML += `
                <tr>
                    <td>${doc.data().cedula}</td>
                    <td>${doc.data().nombres}</td>
                    <td>${doc.data().apellidos}</td>
                    <td>${doc.data().edad}</td>
                    <td>${doc.data().ruta}</td>
                    <td>${doc.data().estado}</td>
                    <td>
                        <button class='btnAceptar' data-id='${ruta.id}'>Aceptar</button>
                        <button class='btnRechazar' data-id='${ruta.id}'>Rechazar</button>
                    </td>
                </tr>`;
            const btnAceptar = document.querySelectorAll('.btnAceptar');
            btnAceptar.forEach(btn =>{
                btn.addEventListener('click', async (e) => {
                    await ActualizaRuta(e.target.dataset.id,{
                        estado: 'Aceptado'
                    })
                })
            });
            const btnRechazar = document.querySelectorAll('.btnRechazar');
            btnRechazar.forEach(btn =>{
                btn.addEventListener('click', async (e) => {
                    await ActualizaRuta(e.target.dataset.id,{
                        estado: 'Rechazado'
                    })
                })
            });
        }); 
    }else{
        window.alert('No se encontraron datos')
    }
}

//session
auth.onAuthStateChanged( async user =>{
    if(user){
        console.log('logiado');
        men.innerHTML += `
        <a href="inicio.html">Inicio</a>
        <a href="reserva.html">Solucitud Ruta</a>
        <a href="nosotros.html">¿Quiénes somos?</a>
        <a href="#" id="sesion">Cerrar sesión</a>
        `
        //Cerrar sesión
        const sesion = document.querySelector('#sesion');
        sesion.addEventListener('click',e =>{
            console.log('cerrar');
            e.preventDefault();
            auth.signOut().then(()=>{
                window.location.href='login.html';
            })
        })
    }else{
        men.innerHTML += `
        <a href="inicio.html"">Inicio</a>
        <a href="nosotros.html">¿Quiénes somos?</a>
        <a href="login.html" >iniciar sesión</a>
        `
        //Cerrar sesión
        const sesion = document.querySelector('#sesion');
        sesion.addEventListener('click',e =>{
            console.log('cerrar');
            e.preventDefault();
            auth.signOut().then(()=>{
                window.location.href='login.html';
            })
        })
    }
});
