import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, Validators} from '@angular/forms';
import { Producto } from '../../models/producto';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss']
})
export class CrearProductoComponent implements OnInit{
productoForm:FormGroup;
titulo='crear producto';
id:string | null;

  constructor(private fb : FormBuilder, 
    private router:Router, 
    private toastr: ToastrService,
    private _productoServices:ProductoService,
    private aRouter:ActivatedRoute){
    this.productoForm=this.fb.group({
      producto:['',Validators.required],
      categoria:['',Validators.required],
      ubicacion:['',Validators.required],
      precio:['',Validators.required],
    });
    this.id=this.aRouter.snapshot.paramMap.get('id');
  }

  agregarProducto(){
  console.log(this.productoForm);
  console.log(this.productoForm.get('producto')?.value);
const PRODUCTO:Producto={
  nombre:this.productoForm.get('producto')?.value,
  categoria:this.productoForm.get('categoria')?.value,
  ubicacion:this.productoForm.get('ubicacion')?.value,
  precio:this.productoForm.get('precio')?.value,
}  
if(this.id !==null){
//editamos producto
this._productoServices.editarProducto(this.id,PRODUCTO).subscribe(data=>{
  this.toastr.success(PRODUCTO.nombre, 'Producto fue Actualizado con éxito');
  this.router.navigate(['/']);
},error=>{
  console.log(error);
  this.productoForm.reset();
})
}else{
//agregamos producto
console.log(PRODUCTO);
this._productoServices.registarProducto(PRODUCTO).subscribe(data=>{
  this.toastr.success(PRODUCTO.nombre, 'Producto Registrado');
this.router.navigate(['/']);
},error=>{
  console.log(error);
  this.productoForm.reset();
});
}
}

esEditar(){
  
  if(this.id !== null){
    this.titulo='Editar producto';
    this._productoServices.obtenerProducto(this.id).subscribe(data=>{
      this.productoForm.setValue({
        producto:data.nombre,
        categoria:data.categoria,
        ubicacion:data.ubicacion,
        precio:data.precio,
      })
    })
  }
}

  ngOnInit(): void {
  this.esEditar();
}
}


