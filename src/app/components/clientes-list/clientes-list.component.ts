import { CommonModule, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './clientes-list.component.html',
  styleUrl: './clientes-list.component.css',
})
export class ClientesListComponent {
  clientes: any[] = [];
  confirmMessage: string = '';

  clienteForm: FormGroup = this.form.group({
    nombre: ['', [Validators.required, Validators.minLength(5)]],
    direcciones: this.form.array([]),
  });
  errorMessage = {
    nombre: [
      { type: 'required', mensaje: 'Este campo es obligatorio.' },
      {
        type: 'minlength',
        mensaje: 'El nombre debe tener al menos 5 caracteres.',
      },
    ],
    calle: [{ type: 'required', mensaje: 'La calle es obligatoria.' }],
    ciudad: [{ type: 'required', mensaje: 'La ciudad es obligatoria.' }],
    estado: [{ type: 'required', mensaje: 'El estado es obligatorio.' }],
    codigoPostal: [
      { type: 'required', mensaje: 'El código postal es obligatorio.' },
    ],
  };
  clienteIdToDelete: number = 0;

  constructor(
    private clienteService: ClientService,
    private form: FormBuilder,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.addDireccion();
  }

  loadData() {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        console.log('Clientes recibidos:', data); // Agrega el console.log aquí
        this.clientes = data;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      },
    });
  }
  get direcciones(): FormArray {
    return this.clienteForm.get('direcciones') as FormArray;
  }
  public get nombre(): AbstractControl<string> | null {
    return this.clienteForm?.get('nombre');
  }
  addDireccion(): void {
    const direccionGroup = this.form.group({
      calle: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required]],
    });
    this.direcciones.push(direccionGroup);
  }
  public getDireccionControl(
    index: number,
    field: string
  ): AbstractControl | null {
    return this.direcciones?.get([index])?.get(field) || null;
  }
  removeDireccion(index: number): void {
    this.direcciones.removeAt(index);
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      const cliente = this.clienteForm.value;

      this.clienteService.addCliente(cliente).subscribe({
        next: (response) => {
          console.log('Cliente agregado con éxito:', response);
          alert('Cliente agregado correctamente.');
          this.clienteForm.reset();
          this.direcciones.clear();
          this.addDireccion();
          this.loadData();
        },
        error: (error) => {
          console.error('Error al agregar cliente:', error);
          alert('Error al agregar cliente.');
        },
      });
    } else {
      console.log('Formulario inválido', this.clienteForm.value);
      alert('Por favor, completa todos los campos requeridos.');
    }
  }
  openModal(id: number): void {
    this.clienteIdToDelete = id;
    this.confirmMessage = '¿Seguro que quieres eliminar este cliente?'; // Aquí puedes personalizar el mensaje
    const myModal = new bootstrap.Modal(document.getElementById('deleteModal')); // Crear una instancia del modal de Bootstrap
    myModal.show(); // Mostrar el modal
  }
  confirmDelete(): void {
    // Lógica para eliminar el cliente
    console.log(this.clienteIdToDelete);

    if (this.clienteIdToDelete !== null) {
      this.clienteService.deleteCliente(this.clienteIdToDelete).subscribe({
        next: () => {
          console.log('Cliente eliminado');
          // Eliminar el cliente de la lista local
          this.clientes = this.clientes.filter(
            (cliente) => cliente.clienteId !== this.clienteIdToDelete
          );
          const myModal = bootstrap.Modal.getInstance(
            document.getElementById('deleteModal')
          ); // Obtener instancia del modal
          myModal.hide();
          this.loadData();
        },
        error: (err) => {
          console.error('Error al eliminar el cliente:', err);
        },
      });
    }

    /*console.log('Cliente eliminado');
    const myModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal')); // Obtener instancia del modal
    myModal.hide(); */ // Cerrar el modal
  }
}
