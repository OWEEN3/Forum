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
<img height="400" align="center" alt="image" src="https://github.com/user-attachments/assets/f1841ae7-5db1-4773-bcb8-626f94065016" />

* **Search**: Search topics by words in the title.
<img height="200" alt="image" src="https://github.com/user-attachments/assets/2ed614bf-04ae-4190-8032-9cba0b3b5f8e" />
<img height="400" alt="image" src="https://github.com/user-attachments/assets/579239d8-dbd1-4138-a675-fef725c1adb3" />

* **Topic page**: Detailed information about the topic, its author and comments on it
<img height="400" alt="image" src="https://github.com/user-attachments/assets/fc25f452-c1fd-4ee6-b572-43df228942c0" />

* **Login/Register**: Login and registration of users
<img height="300" alt="image" src="https://github.com/user-attachments/assets/702f7e80-79b2-430d-aa34-da0f596e0204" />
<img height="300" alt="image" src="https://github.com/user-attachments/assets/b0f2e5c6-df69-4ce5-844e-865c2f1f2c52" />

* **User Page**: Information about the user and a list of his topics
<img height="400" alt="image" src="https://github.com/user-attachments/assets/4ce32615-cca5-42bc-b5fe-3788ec659d51" />





