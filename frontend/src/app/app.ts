import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Todo {
  _id?: string;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/todos';

  todos = signal<Todo[]>([]);
  newTodoTitle = signal<string>('');
  editingTodoId = signal<string | null>(null);
  editingTitle = signal<string>('');

  // Computed stats for UI badges
  completedCount = computed(() => this.todos().filter(t => t.completed).length);
  totalCount = computed(() => this.todos().length);

  ngOnInit() {
    this.fetchTodos();
  }


  // READ: Fetch all todos
  fetchTodos() {
    this.http.get<Todo[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.todos.set(data || []);
      },
      error: (err) => console.error('Error fetching todos:', err)
    });
  }

  // CREATE: Add new todo
  addTodo() {
    const title = this.newTodoTitle().trim();
    if (!title) return;

    const newTodo: Todo = { title, completed: false };
    this.http.post<Todo>(this.apiUrl, newTodo).subscribe({
      next: (createdTodo) => {
        this.todos.update(items => [...items, createdTodo]);
        this.newTodoTitle.set('');
      },
      error: (err) => console.error('Error adding todo:', err)
    });
  }

  // UPDATE: Toggle completion status
  toggleTodo(todo: Todo) {
    if (!todo._id) return;
    const updated = { ...todo, completed: !todo.completed };
    this.http.put<Todo>(`${this.apiUrl}/${todo._id}`, updated).subscribe({
      next: (res) => {
        this.todos.update(items =>
          items.map(item => item._id === res._id ? res : item)
        );
      },
      error: (err) => console.error('Error toggling todo:', err)
    });
  }

  // UPDATE: Start editing title
  startEditing(todo: Todo) {
    if (todo._id) {
      this.editingTodoId.set(todo._id);
      this.editingTitle.set(todo.title);
    }
  }

  // UPDATE: Save edited title
  saveEdit(todo: Todo) {
    const title = this.editingTitle().trim();
    if (!todo._id || !title) return;
    const updated = { ...todo, title };
    this.http.put<Todo>(`${this.apiUrl}/${todo._id}`, updated).subscribe({
      next: (res) => {
        this.todos.update(items =>
          items.map(item => item._id === res._id ? res : item)
        );
        this.editingTodoId.set(null);
      },
      error: (err) => console.error('Error updating todo title:', err)
    });
  }

  cancelEdit() {
    this.editingTodoId.set(null);
  }

  // DELETE: Delete a todo
  deleteTodo(id?: string) {
    if (!id) return;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.todos.update(items => items.filter(t => t._id !== id));
      },
      error: (err) => console.error('Error deleting todo:', err)
    });
  }
}


