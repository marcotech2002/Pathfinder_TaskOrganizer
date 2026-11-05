import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:5000/api/categories/';
  private httpHeaders = new HttpHeaders({ 'content-type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

  getCategories(): Observable<CategoryResponseDTO[]> {
    return this.httpClient.get<CategoryResponseDTO[]>(this.baseUrl, {
      headers: this.httpHeaders
    });
  }

  createCategory(category: CategoryCreateDTO): Observable<CategoryResponseDTO> {
    return this.httpClient.post<CategoryResponseDTO>(this.baseUrl, category, {
      headers: this.httpHeaders
    });
  }
}
