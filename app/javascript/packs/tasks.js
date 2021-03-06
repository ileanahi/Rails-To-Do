document.addEventListener('DOMContentLoaded', e => {
    let htmlString = '';
    const url = './tasks/';

    const taskHtml = (task) => {
        let checkedStatus = task.done ? "checked" : "";
        let liClass = task.done ? "completed" : "";
        let ele = `<li id="listItem-${task.id}" class="${liClass}"><div class="view"><input class="toggle" type="checkbox" data-id="${task.id}" ${checkedStatus}><label>${task.title}</label></div></li>`
        return ele
    }

    const toggleTask = e => {
        const taskId = e.target.dataset.id;
                
        const doneValue = Boolean(e.target.checked);

        data = {"task": {"done": doneValue}}
        const csrfToken = document.querySelector("[name='csrf-token']").content

        fetch(url + taskId, {
            method: 'PUT',
            headers: {
                'X-CSRF-Token': csrfToken,
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(resp => resp.json())
            .then(data => {
                console.log('Success:', data)
                let liHtml = taskHtml(data);
                let li = document.getElementById(`listItem-${data.id}`)
                li.replaceWith(document.createRange().createContextualFragment(liHtml));
            })
            .catch(err => console.log('Error:', err))
    }

    
    fetch(url)
    .then(resp => resp.json())
    .then(data => {
        data.forEach(task => {
            htmlString += taskHtml(task);
        });
        let ulTodo = document.getElementsByClassName('todo-list')[0];
        ulTodo.innerHTML = htmlString;

        document.querySelectorAll('.toggle').forEach(task => {
            task.addEventListener('change', toggleTask);
        })
        
    })
    .catch(err => console.log('Fetch error', err))

    const form = document.getElementById('new-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const text = document.getElementsByClassName('new-todo')[0];
        console.log("task: ", text.value);
        let payload = {
            task: {title: text.value}
        }
        const csrfToken = document.querySelector("[name='csrf-token']").content

        fetch(url, {
            method: 'POST',
            headers: {
                'X-CSRF-Token': csrfToken,
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
            .then(resp => resp.json())
            .then(data => {
                console.log('Success:', data);
                let htmlString = taskHtml(data);
                const ulTodos = document.getElementsByClassName('todo-list')[0];
                ulTodos.innerHTML += htmlString;
                const task = document.getElementsByClassName('toggle')[0]
                task.addEventListener('click', toggleTask);
                document.getElementsByClassName('new-todo')[0].value = '';
            })
            .catch(err => console.log('Error:', err))
    })
})