import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client-front';
  public APIUrl = "http://localhost:8002/api";

  constructor(private http: HttpClient) {
  }
  products: any = [];
  getProducts() {
    this.http.get<{ success: boolean, message: string, data: any[] }>(this.APIUrl + '/products')
      .subscribe((response) => {
        console.log(response);
        this.products = response.data || [];
      });
  }
  increaseLikes(productId: number) {
    this.http.post(`${this.APIUrl}/products/${productId}/like`, {})
      .subscribe((response) => {
        console.log(response);
        this.getProducts();
      });
  }
  ngOnInit() {
    this.getProducts();
  }

}
