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
const inputs = document.querySelectorAll('#formregis input');
//expresiones iregulares
const expresiones ={
  ExprexionPalabra: /^[a-zA-ZÀ-ÿ\s]{1,50}$/, // Letras y espacios, pueden llevar acentos.
  ExprexionPassword: /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/, // 4 a 12 digitos.
  ExprexionCorreo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
}
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
/////

if(formregis){
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
                window.location.href='../html/login.html';
                console.log('registrado')
              })
              .catch(function(error) {
                window.alert("Usuario No Registrado");
              });
              
          })
          
          .catch(function(error) {
              console.log('ERRO');
              if(error.code =='auth/invalid-email'){
              }
          });
      }else{
          console.log('no correcto');
      }
  })
}