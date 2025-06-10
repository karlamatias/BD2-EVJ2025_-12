CREATE DATABASE hotelera;
USE hotelera;

CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY,
    nombre VARCHAR (150),
    correo VARCHAR(75),
    telefono VARCHAR(8)
);

CREATE TABLE habitacion (
    id_habitacion INT PRIMARY KEY,
    tipo VARCHAR(45),
    precio DECIMAL(10,2)
);

CREATE TABLE reserva (
    id_reserva INT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_habitacion INT NOT NULL,
    fecha_entrada DATETIME,
    fecha_salida DATETIME,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_habitacion) REFERENCES habitacion(id_habitacion)
);

CREATE TABLE pago (
    id_pago INT PRIMARY KEY,
    id_reserva INT,
    fecha_pago DATETIME,
    monto DECIMAL(10,2),
    metodo_pago VARCHAR(25),
    id_empleado INT,
    FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva)
);

CREATE TABLE log_habitacion (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    time_estampx DATETIME,
    status VARCHAR (100),
    id_habitacion INT NOT NULL,
    FOREIGN KEY (id_habitacion) REFERENCES habitacion(id_habitacion)
);