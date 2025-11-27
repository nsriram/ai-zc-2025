# Create your views here.


from django.shortcuts import render, redirect, get_object_or_404

from .models import Todo


def todo_list(request):
    """List all TODOs"""
    todos = Todo.objects.all().order_by('-created_at')
    return render(request, 'todo/list.html', {'todos': todos})


def todo_create(request):
    """Create a new TODO"""
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description', '')
        due_date = request.POST.get('due_date') or None

        Todo.objects.create(
            title=title,
            description=description,
            due_date=due_date
        )
        return redirect('todo_list')

    return render(request, 'todo/create.html')


def todo_edit(request, pk):
    """Edit an existing TODO"""
    todo = get_object_or_404(Todo, pk=pk)

    if request.method == 'POST':
        todo.title = request.POST.get('title')
        todo.description = request.POST.get('description', '')
        todo.due_date = request.POST.get('due_date') or None
        todo.save()
        return redirect('todo_list')

    return render(request, 'todo/edit.html', {'todo': todo})


def todo_delete(request, pk):
    """Delete a TODO"""
    todo = get_object_or_404(Todo, pk=pk)

    if request.method == 'POST':
        todo.delete()
        return redirect('todo_list')

    return render(request, 'todo/delete.html', {'todo': todo})


def todo_resolve(request, pk):
    """Mark TODO as resolved"""
    todo = get_object_or_404(Todo, pk=pk)
    todo.is_resolved = True
    todo.save()
    return redirect('todo_list')
