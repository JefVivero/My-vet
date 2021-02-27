import React, {useState, useEffect} from 'react'
import { isEmpty, size } from 'lodash'
import { addDocument, deleteDocument, updateDocument, getCollection } from './actions'
import { Button, Modal } from 'react-bootstrap'


function App() {
  const [Pet, setPet] = useState("")
  const [Patients, setPatients] = useState([])
  const [Id, setId] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [Create, setCreate] = useState(false)
  const [Delete, setDelete] = useState(false)
  const [IdDel, setIdDel] = useState("")
  const [error, seterror] = useState(null)

  useEffect(() => {
    (async () => {
      const result = await getCollection("Patients")
      if (result.statusResponse) {
        setPatients(result.data)
      }
    })()
  }, [])

  const validForm = () => {
    let isValid = true
    seterror(null)

    if (isEmpty(Pet)) {
      seterror("Debes ingresar la informacion de la mascota.")
      isValid = false
    }
    
    return isValid
  }

  const addPatient = async(e) => {
    e.preventDefault()

    if (!validForm()) {
      return
    }
    
    const result = await addDocument("Patients", Pet)
    if (!result.statusResponse) {
      seterror(result.error)
      return
    }
    console.log(Patients)
    setPatients([ ...Patients, { id: result.data.id, ...Pet } ])
    console.log("result")
    console.log(result.data.id)
    setPet("")
  }

  const savePatient = async(e) => { 
    e.preventDefault()

    if (!validForm()) {
      return
    }

    const result = await updateDocument("Patients", Id, Pet)
    if (!result.statusResponse) {
      seterror(result.error)
      return
    } 

    const editedPatients = Patients.map(item => item.id === Id ? { Id, ...Pet} : item)
    setPatients(editedPatients)
    setEditMode(false)
    setPet("")
    setId("")
    setCreate(false)
  }

  const deletePatient = async() => {
    setDelete(false)
    console.log("delete:"+IdDel)
    
    const result = await deleteDocument("Patients", IdDel)
    if (!result.statusResponse) {
      seterror(result.error)
      return
    }

    const filteredPatients= Patients.filter(Pet => Pet.id !== IdDel)
    setPatients(filteredPatients)
    return
  }

  const editPatient = (thePatient) => {
    setPet(thePatient)
    setEditMode(true)
    setId(thePatient.id)
    setCreate(true)
  }

  const OpenCreatePet= (TheState)=>{
    setCreate(TheState)
  }

  const OpenAlertDelete=(Boole, id)=>{
    setDelete(Boole)
    setIdDel(id)
  }

 

  return (
    
    <div className="container mt-5">
      <h1>Veterinaria</h1>
      <hr/>
      <div className="row">
        <div >
          <h4 className="text-center">Zona de Información</h4>
          {
            size(Patients)===0 ? (
            <li className="list-group-item">No se ha encontrado información.</li>
            ) : (
              
                <ul className="row">
                  <table className="table table-striped">
                    <thead>
                       <tr>
                          <th className="text-center" scope="col">Name</th>
                          <th className="text-center" scope="col">Tipo</th>
                          <th className="text-center" scope="col">Raza</th>
                          <th className="text-center" scope="col">BirthDate</th>
                          <th className="text-center" scope="col">Owner</th>
                          <th className="text-center" scope="col">Telefono</th>
                          <th className="text-center" scope="col">Direccion</th>
                          <th className="text-center" scope="col">Email</th>
                          <th><button className="btn btn-danger btn-sm float-center" onClick={()=>OpenCreatePet(true)}>
                                Agregar Mascotas
                              </button>
                          </th>
                       </tr>
                    

                  {
                    Patients.map((Pet) => ( 
                          
                        <tr className="text-left" key={Pet.id}>
                          <td >{Pet.name}</td>
                          <td >{Pet.TypeMascot}</td>
                          <td >{Pet.race}</td>
                          <td >{Pet.BirdDate}</td>
                          <td >{Pet.owner}</td>
                          <td >{Pet.phoneOwner}</td>
                          <td >{Pet.address}</td>
                          <td >{Pet.Email}</td>
                          <tr >
                            <td ><button
                            className="btn btn-danger btn-sm float-center mx--2"
                            onClick={()=>OpenAlertDelete(true,Pet.id)}>
                            Eliminar
                          </button></td>
                          <th>
                          <button className="btn btn-warning btn-sm float-center"
                             onClick={() => editPatient(Pet)}>
                             Editar
                          </button></th>
                          </tr>
                        </tr>
                    
                    ))
                  }
                  </thead>
                  </table>
                </ul>
            )
          }
          
        </div>
      </div>
      
      <div >
      <Modal show={Create} onHide={() =>OpenCreatePet(true)}>
        <Modal.Header >
          <Modal.Title>{editMode ? "Modificar Mascota" : "Registrar Mascota"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <form className="row" onSubmit={editMode ? savePatient : addPatient}>
              {
              error &&<span className="text-danger">{error}</span>
              }
              Nombre Mascota:
              <input type="text" className="form-control mb-2" placeholder="Ingrese el nombre.." onChange={(text) => setPet({...Pet, name:text.target.value})} name="name" value={Pet.name} required> 
                </input>
              Tipo Mascota:
                <input type="text" className="form-control mb-2" placeholder="Ingrese el tipo.." onChange={(text) => setPet({...Pet, TypeMascot:text.target.value})} name="TypeMascot" value={Pet.TypeMascot} required> 
                </input>
                <span className="text-center">  Raza:</span> 
                <input type="text" className="form-control mb-2" placeholder="Ingrese la Raza.." onChange={(text) => setPet({...Pet, race:text.target.value})} name="race" value={Pet.race} required> 
                </input>
                Fecha Nacimiento:
                <input type="text" className="form-control mb-2" placeholder="Ingrese la fecha de nacimiento." onChange={(text) => setPet({...Pet, BirdDate:text.target.value})} name="BirdDate"value={Pet.BirdDate} required> 
                </input>
                Propietario:
                <input type="text" className="form-control mb-2" placeholder="Ingrese el propietario.." onChange={(text) => setPet({...Pet, owner:text.target.value})} name="owner" value={Pet.owner} required> 
                </input>
                Telefono Propietario:
                <input type="text" className="form-control mb-2" placeholder="Ingrese el Telefono.." onChange={(text) => setPet({...Pet, phoneOwner:text.target.value})} name="phoneOwner" value={Pet.phoneOwner} required> 
                </input>
                Direccion:
                <input type="text" className="form-control mb-2" placeholder="Ingrese el Direccion.." onChange={(text) => setPet({...Pet, address:text.target.value})} name="address" value={Pet.address} required> 
                </input>
                Email:
                <input type="text" className="form-control mb-2" placeholder="Ingrese el email.." onChange={(text) => setPet({...Pet, Email:text.target.value})} name="Email" value={Pet.Email} required> 
                </input>  
                  <Button className="btn btn-warning btn-block" type="submit" onClick={()=>OpenCreatePet(false)}>{editMode ? "Guardar": "Crear"}</Button>          
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-danger btn-block" onClick={()=>OpenCreatePet(false)}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    </div>
    <div>
        <Modal show={Delete} >
           <Modal.Header> Desea Eliminarlo?</Modal.Header>
              <Modal.Body>
                <div>
                    <Button className="btn btn-danger btn-block" type="submit" onClick={()=>deletePatient(IdDel)}>Eliminar</Button>
                </div>
              </Modal.Body>
            <Modal.Footer>
            <Button className="close" data-dismiss="modal" aria-label="Cerrar" onClick={()=>OpenAlertDelete(false,"")}>
                    <span aria-hidden="true">Cerrar</span>
            </Button>
            </Modal.Footer>
          </Modal>
       </div>     
    </div>
  )
}

export default App
