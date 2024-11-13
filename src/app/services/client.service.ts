import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'https://localhost:7239/api/Clientes';
 
  constructor(private http: HttpClient) {}

  // Métodos para Clientes
  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getCliente(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clientes/${id}`);
  }

  addCliente(cliente: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, cliente);
  }

  updateCliente(id: number, cliente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/clientes/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos para Direcciones
  addDireccion(direccion: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/direcciones`, direccion);
  }
}
