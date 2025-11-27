from django.test import TestCase, Client
from django.urls import reverse
from .models import Todo
from datetime import date, timedelta


class TodoModelTest(TestCase):
    def test_create_todo_with_all_fields(self):
        """Test creating a TODO with all fields"""
        todo = Todo.objects.create(
            title="Test TODO",
            description="Test description",
            due_date=date.today() + timedelta(days=1),
            is_resolved=False
        )
        self.assertEqual(todo.title, "Test TODO")
        self.assertEqual(todo.description, "Test description")
        self.assertIsNotNone(todo.created_at)
        self.assertIsNotNone(todo.updated_at)

    def test_create_todo_minimal_fields(self):
        """Test creating a TODO with only required fields"""
        todo = Todo.objects.create(title="Minimal TODO")
        self.assertEqual(todo.title, "Minimal TODO")
        self.assertEqual(todo.description, "")
        self.assertIsNone(todo.due_date)
        self.assertFalse(todo.is_resolved)


class TodoViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.todo = Todo.objects.create(
            title="Test TODO",
            description="Test description"
        )

    def test_todo_list_view(self):
        """Test listing all TODOs"""
        response = self.client.get(reverse('todo_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test TODO")

    def test_create_todo_view(self):
        """Test creating a new TODO"""
        response = self.client.post(reverse('todo_create'), {
            'title': 'New TODO',
            'description': 'New description',
            'due_date': date.today()
        })
        self.assertEqual(response.status_code, 302)  # Redirect after creation
        self.assertTrue(Todo.objects.filter(title='New TODO').exists())

    def test_edit_todo_view(self):
        """Test editing an existing TODO"""
        response = self.client.post(reverse('todo_edit', args=[self.todo.pk]), {
            'title': 'Updated TODO',
            'description': 'Updated description'
        })
        self.assertEqual(response.status_code, 302)
        self.todo.refresh_from_db()
        self.assertEqual(self.todo.title, 'Updated TODO')

    def test_delete_todo_view(self):
        """Test deleting a TODO"""
        response = self.client.post(reverse('todo_delete', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Todo.objects.filter(pk=self.todo.pk).exists())

    def test_resolve_todo_view(self):
        """Test marking a TODO as resolved"""
        response = self.client.post(reverse('todo_resolve', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)
        self.todo.refresh_from_db()
        self.assertTrue(self.todo.is_resolved)