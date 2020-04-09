const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');
const search = document.querySelector('#search');

// Create and render list elements.
function renderCafeList(doc) {
	let li = document.createElement('li');
	let name = document.createElement('span');
	let city = document.createElement('span');
	let deleteBtn = document.createElement('div');

	li.setAttribute('data-id', doc.id);
	name.textContent = doc.data().name;
	name.contentEditable = true;
	city.textContent = doc.data().city;
	city.contentEditable = true;
	deleteBtn.textContent = 'x';

	li.appendChild(name);
	li.appendChild(city);
	li.appendChild(deleteBtn);

	cafeList.appendChild(li);

	// Delete data from firebase.
	deleteBtn.addEventListener('click', (e) => {
		e.stopPropagation();

		let id = e.target.parentElement.getAttribute('data-id');
		db.collection('cafes').doc(id).delete();
	});

	name.addEventListener('blur', (e) => {
		e.stopPropagation();

		let newName = e.target.textContent;
		let id = e.target.parentElement.getAttribute('data-id');
		db.collection('cafes').doc(id).update({
			name: newName,
		});
	});

	city.addEventListener('blur', (e) => {
		e.stopPropagation();

		let newCity = e.target.textContent;
		let id = e.target.parentElement.getAttribute('data-id');
		db.collection('cafes').doc(id).update({
			city: newCity,
		});
	});
}

// Getting data from firebase.
// db.collection('cafes')
// 	.orderBy('name')
// 	.get()
// 	.then((snapshot) => {
// 		snapshot.docs.forEach((doc) => {
// 			renderCafeList(doc);
// 		});
// 	});

// Saving data into firebase.
form.addEventListener('submit', (e) => {
	e.preventDefault();

	db.collection('cafes').add({
		name: form.name.value,
		city: form.city.value,
	});

	form.name.value = '';
	form.city.value = '';
});

search.addEventListener('keyup', (e) => {
	let searchText = e.target.value.toLowerCase();
	let ul = document.querySelector('#cafe-list');
	let li = ul.getElementsByTagName('li');

	for (let i = 0; i < li.length; i++) {
		let name = li[i]
			.getElementsByTagName('span')[0]
			.textContent.toLowerCase();
		let city = li[i]
			.getElementsByTagName('span')[1]
			.textContent.toLowerCase();

		if (name.startsWith(searchText) || city.startsWith(searchText)) {
			li[i].style.display = '';
		} else {
			li[i].style.display = 'none';
		}
	}
});

// Real time data from firebase.
db.collection('cafes')
	.orderBy('name')
	.onSnapshot((snapshot) => {
		let changes = snapshot.docChanges();

		changes.forEach((change) => {
			if (change.type === 'added') {
				renderCafeList(change.doc);
			} else if (change.type === 'removed') {
				let li = cafeList.querySelector(`[data-id='${change.doc.id}']`);
				cafeList.removeChild(li);
			}
		});
	});
