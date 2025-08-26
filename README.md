# Forum

A simple web forum that allows users to communicate by creating topics and leaving comments under them.

## 🛠️ Technologies
### Backend:
* **Python**, **FastAPI**, **SQLAlchemy**, **Alembic**, **PyJWT**, **Pydantic**, **Passlib**, **PostgreSQL**

### Frontend:
* **HTML**, **CSS**, **JavaScript**, **Vite**, **React**

## 📦 Installation and launch
* **With docker**: 
```docker compose build ```
```docker compose up```
 
* **Without docker**:
~~I do not recommend~~

## 🚀 Functionality
* **Registration and login**:

Registration is done by username, email and password.

Login is possible by email/username and password.

Passwords are stored in the database only in hashed form.

After successful login, the user is issued a JWT token with a limited validity period, which is saved in a cookie and used for further authentication.

* **Topics and comments**:

Authorized users can create new topics and leave comments.

The user can edit and delete their own topics and comments.

* **Search**:

A search by topics using keywords in the title is implemented.

* **User page**:

From any topic, you can go to its author's page.

The page displays: username, registration date, user about information, list of all topics created by the user.

If the user has not filled in information about themselves, a standard placeholder text is displayed.

* **Editing a profile**:

The user can change all the data specified during registration: name, e-mail, password and additional information.

When changing the user name or e-mail, a uniqueness check is performed: if the data is already used by another user, updating is impossible.

## 🎨 Screenshots
* **Main page**: Displays a list of all created discussion topics.
<img height="400" alt="image" src="https://github.com/user-attachments/assets/21ae5272-1872-463e-9a4e-dff5dbb118b2" />

* **Search**: Search topics by words in the title.
<img height="200" alt="image" src="https://github.com/user-attachments/assets/ca445ae1-e45f-4591-9e20-af18e2b45f32" />
<img height="400" alt="image" src="https://github.com/user-attachments/assets/3e85e116-dcaf-4d1f-9db3-44fe1a17b897" />

* **Topic page**: Detailed information about the topic, its author and comments on it
<img height="400" alt="image" src="https://github.com/user-attachments/assets/e1c3d89b-2c2d-4a90-a1ec-5599441e9ce1" />

* **Login/Register**: Login and registration of users
<img height="300" alt="image" src="https://github.com/user-attachments/assets/814df777-6225-4f07-83bf-5492ceef7855" />
<img height="300" alt="image" src="https://github.com/user-attachments/assets/999563a6-4ec8-428c-8a66-45155a19e387" />

* **User Page**: Information about the user and a list of his topics
<img height="400" alt="image" src="https://github.com/user-attachments/assets/0c122d24-e1ba-4030-9411-d73bfaa44fcb" />






