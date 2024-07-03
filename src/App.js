import React, { useEffect, useState } from "react";
import "./App.css";
import AddUser from "./Components/AddUser";
import User from "./Components/User";

function App() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.log(err);
      });
  };

  const addUser = async (name, email, address, phone) => {
    await fetch("http://localhost:5000/users", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        email: email,
        address: address,
        phone: phone

      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        if (res.status !== 201) {
          return;
        } else {
          return res.json();
        }
      })
      .then((data) => {
        setUsers((users) => [...users, data]);
      })
      .catch((error) => console.log(error));
  };

  const deleteUser = async (id) => {
    await fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status !== 200) {
          return;
        } else {
          setUsers(
            users.filter((user) => {
              return user.id !== id;
            })
          );
        }
      })
      .catch((error) => console.log(error));
  };

  const onEdit = async (id, name, email, address, phone) => {
    await fetch(`http://localhost:5000/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: name,
        email: email,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          return;
        } else {
          return res.json();
        }
      })
      .then((data) => {
        const updatedUsers = users.map((user) => {
          if (user.id === id) {
            user.name = name;
            user.email = email;
            user.address = address;
            user.phone = phone;

          }
          return user;
        });

        setUsers((users) => updatedUsers);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="text-center p-3 container">
      <h2>CRUD operations with JSON PlaceHolder</h2>
      <AddUser addUser={addUser} />
      {users.map((user) => (
        <User
          id={user.id}
          key={user.id}
          name={user.name}
          email={user.email}
          address={user.address}
          phone={user.phone}

          deleteUser={deleteUser}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default App;
