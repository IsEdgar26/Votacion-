"use client";

import React, { useState, FormEvent, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Cambiado de next/navigation a next/router
import "/app/globals.css";

// Define el tipo de las credenciales
interface Credentials {
  numero_control: string;
  password: string;
  correo_institucional?: string;
  nombre_completo?: string;
  carrera?: string;
  area_admin?: string;
}

// Definimos un tipo para manejar la carta activa
type ActiveCard = "loginUser" | "loginAdmin" | "registerUser" | "registerAdmin" | null;

// Componente funcional Home
const Home: React.FC = () => {
  const [activeCard, setActiveCard] = useState<ActiveCard>(null);
  const [credentials, setCredentials] = useState<Credentials>({
    numero_control: "",
    password: "",
    correo_institucional: "",
    nombre_completo: "",
    carrera: "",
    area_admin: "",
  });
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Manejador de evento para cerrar la carta al hacer clic fuera de ella
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveCard(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", credentials);
      console.log(res);

      if (res.status === 200) {
        console.log(res.data);
        const { rol_usuario } = res.data;
        console.log(rol_usuario);

        if (rol_usuario === "ADMIN") {
          router.push("/dashboard");
        } else if (rol_usuario === "ALUMNO") {
          router.push("/vote");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/register", credentials);
      console.log(res);

      if (res.status === 200) {
        console.log(res.data);
        // Redirigir o mostrar mensaje de registro exitoso
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const cards = [
    {
      type: "loginUser" as ActiveCard,
      title: "Login Usuario",
      image: "images/user-login.png", // Reemplaza con la ruta de tu imagen
    },
    {
      type: "loginAdmin" as ActiveCard,
      title: "Login Administrador",
      image: "images/admin-login.png", // Reemplaza con la ruta de tu imagen
    },
    {
      type: "registerUser" as ActiveCard,
      title: "Registro Usuario",
      image: "images/user-registration.png", // Reemplaza con la ruta de tu imagen
    },
    {
      type: "registerAdmin" as ActiveCard,
      title: "Registro Administrador",
      image: "images/user-registration.png", // Reemplaza con la ruta de tu imagen
    },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center h-screen space-y-8">
      <div className="absolute top-0 left-0 p-7">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/d/d4/Logo-TecNM-2017.png" 
          alt="Logo TecNM" 
          className="w-124 h-60"
        />
      </div>
      <div className="absolute top-0 right-0 p-2">
        <img 
          src="https://www.chihuahua2.tecnm.mx/wp-content/uploads/2023/03/cropped-ICONO-itchii-300x300-1.jpg" 
          alt="Logo ITCH II" 
          className="w-100 h-100"
        />
      </div>
      <div className="flex flex-col items-center justify-center space-y-10">
        <h1 className="text-3xl font-bold text-center">
          ¡Bienvenido a VotaTec!
        </h1>
        <p className="text-lg text-center">
          Todos podemos hacer el cambio.
        </p>
        <div className="flex justify-center space-x-4" ref={containerRef}>
          {cards.map((card) => (
            <div
              key={card.type}
              className="flex-shrink-0 border border-black p-4 rounded-lg cursor-pointer"
              onClick={() => setActiveCard(card.type)}
            >
              <div
                className={`transition-transform transform ${
                  activeCard === card.type ? "scale-105" : ""
                }`}
                style={{ width: "200px", height: "350px" }} // Tamaño fijo para cada carta
              >
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-cover mb-4 rounded-lg" 
                  style={{ objectFit: "cover" }} // Hacer que las imágenes se ajusten al contenedor
                />
                <h2 className="text-center mb-2">{card.title}</h2>
                {activeCard === card.type && (
                  <form
                    onSubmit={card.type.includes("login") ? handleSubmit : handleRegister}
                  >
                    <input
                      type="text"
                      placeholder="Número de control"
                      value={credentials.numero_control}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          numero_control: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded px-2 py-1 mb-4 w-full dark:text-gray-800"
                    />
                    {card.type.includes("register") && (
                      <>
                        <input
                          type="email"
                          placeholder="Correo Institucional"
                          value={credentials.correo_institucional}
                          onChange={(e) =>
                            setCredentials({
                              ...credentials,
                              correo_institucional: e.target.value,
                            })
                          }
                          className="border border-gray-300 rounded px-2 py-1 mb-4 w-full dark:text-gray-800"
                        />
                        <input
                          type="text"
                          placeholder="Nombre Completo"
                          value={credentials.nombre_completo}
                          onChange={(e) =>
                            setCredentials({
                              ...credentials,
                              nombre_completo: e.target.value,
                            })
                          }
                          className="border border-gray-300 rounded px-2 py-1 mb-4 w-full dark:text-gray-800"
                        />
                        <input
                          type="text"
                          placeholder="Carrera"
                          value={credentials.carrera}
                          onChange={(e) =>
                            setCredentials({
                              ...credentials,
                              carrera: e.target.value,
                            })
                          }
                          className="border border-gray-300 rounded px-2 py-1 mb-4 w-full dark:text-gray-800"
                        />
                        {card.type.includes("Admin") && (
                          <input
                            type="text"
                            placeholder="Área de Administración"
                            value={credentials.area_admin}
                            onChange={(e) =>
                              setCredentials({
                                ...credentials,
                                area_admin: e.target.value,
                              })
                            }
                            className="border border-gray-300 rounded px-2 py-1 mb-4 w-full dark:text-gray-800"
                          />
                        )}
                      </>
                    )}
                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          password: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded px-2 py-1 mb-4 w-full dark:text-gray-800"
                    />
                    <button
                      type="submit"
                      className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300 w-full"
                    >
                      {card.type.includes("login") ? "Acceder" : "Registrar"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

