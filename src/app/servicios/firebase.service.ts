import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore,getDoc,getDocs,doc,updateDoc, deleteDoc,arrayUnion, arrayRemove   } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "firebase/storage";
import {AngularFireAuth} from '@angular/fire/compat/auth';
import { getAuth } from "firebase/auth";
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);
  
  constructor(public auth: AngularFireAuth,) {}
  async BorrarDatoColeccion(coleccion:string,id:string){
    await deleteDoc(doc(this.db,coleccion,id));
  }
  async subirFoto(nombre:string,foto:any)
  {
    const storage = getStorage();
    const storageRef = ref(storage, `fotos/${nombre}`);
    const uploadTask = await uploadBytesResumable(storageRef, foto);
    let url = await getDownloadURL(storageRef);
    return url;
  }
  async añadirPacientes(paciente:any){
    addDoc(collection(this.db,"pacientes"), {paciente});
  }
  async esPaciente(){
    let returned;
    this.getCollection("pacientes").then(async (pacientesAux)=>{
      let usuario = await this.InfoUsuario();
      console.log(usuario);
      pacientesAux.forEach((paciente:any)=>{
        if(usuario?.email==paciente.data.paciente.email)
        {
          returned=paciente;
        }
      })
    })
    return returned;
  }
  async añadirAdmin(admin:any){
    addDoc(collection(this.db,"admins"), {admin});
  }
  async añadirEpecialistas(especialista:any){
    addDoc(collection(this.db,"especialistas"), {especialista});
  }
  async AñadirColeccion(data:any,coleccion:string){
    addDoc(collection(this.db,coleccion), {data});
  }
  public async getCollection(collectionName:string){
    let data:any[]=[];
    const docSnap = await getDocs(collection(this.db, collectionName));
    docSnap.forEach((doc) => {
      data.push({data:doc.data(),id:doc.id});
    });
    return data;
  }
  async UpdatePaciente(data:any){
    const washingtonRef = doc(this.db,"pacientes",data.id);
    await updateDoc(washingtonRef,{
      paciente:{
        "nombre":data.nombre,
        "apellido":data.apellido,
        "edad":data.edad,
        "dni":data.dni,
        "email":data.email,
        "contrasena":data.contrasena,
        "obraSocial":data.obraSocial,
        "fotoUno":data.fotoUno,
        "fotoDos":data.fotoDos,
        "tipo":"paciente",
        "historia":{
          "altura":data.historia.altura,
          "peso":data.historia.peso,
          "temperatura":data.historia.temperatura,
          "presion":data.historia.presion,
        }
      }
    });
  }
  async UpdateTurno(data:any){
    const washingtonRef = doc(this.db,"turnos",data.id);
    await updateDoc(washingtonRef, {
      data:{
        "especialista":data.data.data.especialista,
        "paciente": data.data.data.paciente,
        "fecha": data.data.data.fecha,
        "hora": data.data.data.hora,
        "especialidad": data.data.data.especialidad,
        "estado": data.data.data.estado,
        "calificacion": data.data.data.calificacion,
        "resena":data.data.data.resena},
    });
  }
  async ActualizarEspecialidadArray(data:any,id:string)
  {
    const washingtonRef = doc(this.db,"especialistas",id);
    await updateDoc(washingtonRef, {
      especialista:{
        "apellido":data.apellido,
        "contrasena": data.contrasena,
        "dni": data.dni,
        "edad": data.edad,
        "email": data.email,
        "especialidad": data.especialidad,
        "fotoUno": data.fotoUno,
        "nombre": data.nombre,
        "tipo": data.tipo,
        "verificado":data.verificado,
        "horaMin":data.horaMin,
        "horaMax":data.horaMax,
      },
  });
  }
  async VerificarEspecialista(collection:string,data:any,id:string){
    const washingtonRef = doc(this.db,collection,id);
    await updateDoc(washingtonRef, {
      //@ts-ignore
      especialista:{
        "apellido":data.apellido,
        "contrasena": data.contrasena,
        "dni": data.dni,
        "edad": data.edad,
        "email": data.email,
        "especialidad": data.especialidad,
        "fotoUno": data.fotoUno,
        "nombre": data.nombre,
        "tipo": data.tipo,
        "verificado":data.verificado,
        "horaMin":data.horaMin,
        "horaMax":data.horaMax,
        },
    });
  }
  async RegisterUser(email:string, password:string) {
    let mail=this.auth.createUserWithEmailAndPassword(email, password);
    (await mail).user?.sendEmailVerification();
    return mail;
  }
  async SignIn(email:string, password:string)
  {
    return this.auth.signInWithEmailAndPassword(email, password);
}
  isLoggedIn() {
    return this.auth.authState;
  }
  LogOut() {
    return this.auth.signOut();
  }
  async InfoUsuario(){
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
      return user;
    }
    return user;
  }
  async enviarVerificacion(){
    this.auth.authState.subscribe((mail) => {
      return mail?.emailVerified;
    })
    /*user:FirebaseUser = this.db.getCurrentUser();
    user.sendEmailVerification()
    .addOnCompleteListener(this, new OnCompleteListener() {
    @Override
    public void onComplete(@NonNull Task task) {
      // Re-enable button
      findViewById(R.id.verify_email_button).setEnabled(true);

      if (task.isSuccessful()) {
        Toast.makeText(EmailPasswordActivity.this,
          "Verification email sent to " + user.getEmail(),
          Toast.LENGTH_SHORT).show();
      } else {
        Log.e(TAG, "sendEmailVerification", task.getException());
        Toast.makeText(EmailPasswordActivity.this,
          "Failed to send verification email.",
          Toast.LENGTH_SHORT).show();
      }
    }
  });*/
  }
}
