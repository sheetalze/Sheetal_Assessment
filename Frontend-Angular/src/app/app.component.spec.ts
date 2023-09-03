import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should make an HTTP GET request when calling getItems', () => {
    const testData = [{ id: 1, description: 'Item 1' }, { id: 2, description: 'Item 2' }];
    
    spyOn(httpClient, 'get').and.returnValue(of(testData));

    component.getItems();

    expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/TodoItems');
    expect(component.items).toEqual(testData);
  });

  it('should handle errors when making an HTTP GET request', () => {
    spyOn(httpClient, 'get').and.returnValue(
      // Simulate an HTTP error response using RxJS throwError
      throwError(new ErrorEvent('Network error', {
        message: 'An error occurred during the request.',
      }))
    );

    component.getItems();

    expect(httpClient.get).toHaveBeenCalledWith('http://localhost:8080/api/TodoItems');
    expect(component.errorMessages).toContain('An error occurred while fetching items. Please try again.');
  });

  
  it('should make an HTTP PUT request when calling handleMarkAsComplete', () => {
    const item = { id: 1, description: 'Item', isCompleted: false };
    const updatedItem = { ...item, isCompleted: true };

    spyOn(httpClient, 'put').and.returnValue(of(updatedItem));

    component.handleMarkAsComplete(item);

    expect(httpClient.put).toHaveBeenCalledWith(
      `http://localhost:8080/api/TodoItems/${item.id}`,
      updatedItem
    );
    expect(item.isCompleted).toBe(true);
  });

  it('should handle errors when making an HTTP PUT request', () => {
    const item = { id: 1, description: 'Item', isCompleted: false };

    spyOn(httpClient, 'put').and.returnValue(
      // Simulate an HTTP error response using RxJS throwError
      throwError(new ErrorEvent('Network error', {
        message: 'An error occurred during the request.',
      }))
    );

    component.handleMarkAsComplete(item);

    expect(httpClient.put).toHaveBeenCalledWith(
      `http://localhost:8080/api/TodoItems/${item.id}`,
      jasmine.any(Object)
    );
    expect(component.errorMessages).toContain('An error occurred while marking the item as complete. Please try again.');
  });

  afterEach(() => {
    // Verify that there are no outstanding HTTP requests
    httpTestingController.verify();
  });
});
