import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  items: any[] = [];
  description: string = '';
  errorMessages: string[] = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this.httpClient
      .get<any[]>('http://localhost:8080/api/TodoItems')
      .pipe(
        catchError((error) => {
          console.error('Error fetching items:', error);
          this.errorMessages.push('An error occurred while fetching items. Please try again.');
          return throwError('An error occurred while fetching items. Please try again.');
        })
      )
      .subscribe((data) => {
        this.items = data;
      });
  }

  handleAdd() {
    const newItem = { description: this.description };
    this.httpClient
      .post<any>('http://localhost:8080/api/TodoItems', newItem)
      .pipe(
        catchError((error) => {
          console.error('Error adding item:', error);
          this.errorMessages.push('An error occurred while adding the item. Please try again.');
          return throwError('An error occurred while adding the item. Please try again.');
        })
      )
      .subscribe(
        (data) => {
          this.items.push(data);
          this.description = ''; // Clear the description field
        }
      );
  }

  handleClear() {
    this.description = '';
  }

  handleMarkAsComplete(item: any) {
    const updatedItem = { ...item, isCompleted: true };
    this.httpClient
      .put(`http://localhost:8080/api/TodoItems/${item.id}`, updatedItem)
      .pipe(
        catchError((error) => {
          console.error('Error marking item as complete:', error);
          this.errorMessages.push('An error occurred while marking the item as complete. Please try again.');
          return throwError('An error occurred while marking the item as complete. Please try again.');
        })
      )
      .subscribe(
        () => {
          item.isCompleted = true;
        }
      );
  }

  clearErrors() {
    this.errorMessages = [];
  }
}
