import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryCreateDTO, CategoryResponseDTO, CategoryUpdateDTO } from '../../DTOs/category-dtos';

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

  updateCategory(categoryId: number, category: CategoryUpdateDTO): Observable<CategoryResponseDTO> {
    const url = `${this.baseUrl}${categoryId}`;
    return this.httpClient.patch<CategoryResponseDTO>(url, category, {
      headers: this.httpHeaders
    });
  }

  deleteCategory(categoryId: number): Observable<void> {
    const url = `${this.baseUrl}${categoryId}`;
    return this.httpClient.delete<void>(url, {
      headers: this.httpHeaders
    });
  }
}
