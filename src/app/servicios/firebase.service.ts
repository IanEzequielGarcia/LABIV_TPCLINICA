import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore,getDoc,getDocs,doc,updateDoc  } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "firebase/storage";
import {AngularFireAuth} from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);
  
  constructor(public auth: AngularFireAuth,) {}
  
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
  async añadirAdmin(admin:any){
    addDoc(collection(this.db,"admins"), {admin});
  }
  async añadirEpecialistas(especialista:any){
    addDoc(collection(this.db,"especialistas"), {especialista});
  }
  public async getCollection(collectionName:string){
    let data:any[]=[];
    const docSnap = await getDocs(collection(this.db, collectionName));
    docSnap.forEach((doc) => {
      data.push({data:doc.data(),id:doc.id});
    });
    return data;
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
        "verificado":data.verificado},
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
  async enviarVerificacion(){
    await this.auth.authState.subscribe((mail)=>{
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
