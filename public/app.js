new Vue({el: '#app',
	data() {
		return {
			isDark: true,
			show: true,
			todoTitle: '',
			todos: []
		}
	},
	// lyfecycle
	created() {
		fetch('/api/todo', {
			method: 'get'
		})
			.then(res => res.json())
			.then(todos => {
				console.log('get todos: ', todos)
				this.todos = todos
			})
			.catch(error => console.log(error))
	},
	methods: {
		addTodo() {
			const title = this.todoTitle.trim()
			if (!title) {
				return
			}
			// console.log(JSON.stringify({title}))
			fetch('/api/todo', {
				method: 'post',
				headers: {'Content-type': 'application/json'},
				body: JSON.stringify({title})
			})
			.then(res => res.json())
			.then(({newItem}) => {
				console.log(newItem)
				this.todos.push(newItem)
				this.todoTitle = ''
			})
			.catch(error => console.log(error))
		},
		doneTodo(id) {
			console.log('done', id);
			fetch('/api/todo/' + id, {
				method: 'put',
				headers: {'Content-type': 'application/json'},
				body: JSON.stringify({done: true})
			})
			.then(res => res.json())
			.then(({item}) => {
				console.log(item)
				this.todos = this.todos.map(oldItem => (item.id === oldItem.id ? item : oldItem))
				console.log(this.todos)
			})
			.catch(error => console.log(error))
		},
		removeTodo(id) {
			console.log('delete', id);
			fetch('/api/todo/' + id, {method: 'delete'})
				.then(res => res.status ===200 ? res.json() : false)
				.then(response => {
					if (response && response.message) {
						console.log(response.message);
						alert(response.message);
					} else {
						this.todos = this.todos.filter(t => t.id !== id);
					}
				})
				.catch(error => console.log(error.message));
		}
	},
	filters: {
		capitalize(value) {
			return value.toString().charAt(0).toUpperCase() + value.slice(1)
		},
		date(value, withTime) {
			const options = {
				year: 'numeric',
				month: 'long',
				day: '2-digit'
			}
			if (withTime) {
				options.hour = '2-digit',
				options.minute = '2-digit',
				options.second = '2-digit'
			}
			return new Intl.DateTimeFormat('ru-RU', options).format(new Date(value))
		}
	}
})
