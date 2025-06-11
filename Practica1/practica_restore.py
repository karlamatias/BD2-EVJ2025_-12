import mysql.connector
import subprocess
import argparse
import os
import time

# DATA COMPU KARLA
#USER = "root"
#PASSWORD = "12345"

# DATA COMPU HANIA
USER = "root"
PASSWORD = "4321"

DATABASE = "hotelera"
FULL_BACKUP_DIR = "./resultados"
INCREMENTAL_DIR = "./incrementales"

TABLAS = ["pago", "log_habitacion", "reserva", "habitacion", "cliente"]  # en orden de borrado

def conectar():
    return mysql.connector.connect(
        host='localhost',
        user=USER,
        password=PASSWORD,
        database=DATABASE
    )

def limpiar_base(cursor, conn):
    print("\nLimpiando todas las tablas...")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
    for tabla in TABLAS:
        cursor.execute(f"TRUNCATE TABLE {tabla};")
        print(f"-> Tabla {tabla} vaciada.")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
    conn.commit()

def restaurar_sql(archivo):
    if not os.path.exists(archivo):
        print(f"Archivo no encontrado: {archivo}")
        return False

    print(f"Ejecutando restauración desde: {archivo}...")
    comando = f'"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe" -u {USER} -p{PASSWORD} {DATABASE} < "{archivo}"'
    resultado = subprocess.run(comando, shell=True)
    return resultado.returncode == 0

def restaurar_backup_completo(dia):
    archivo = os.path.join(FULL_BACKUP_DIR, f"backup_dia{dia}_completo.sql")
    print(f"\nRestaurando backup completo del día {dia}...")
    return restaurar_sql(archivo)

def restaurar_backup_incremental(dia):
    archivo = os.path.join(INCREMENTAL_DIR, f"backup_dia{dia}_incremental_binario.sql")
    print(f"\nRestaurando backup incremental del día {dia}...")
    return restaurar_sql(archivo)

def mostrar_resultados(cursor):
    for tabla in reversed(TABLAS):  # mostrar en orden lógico
        print(f"\nPrimeros registros de {tabla}:")
        cursor.execute(f"SELECT * FROM {tabla} LIMIT 5")
        filas = cursor.fetchall()
        for fila in filas:
            print(fila)

    print("\nConteo total por tabla:")
    cursor.execute("""
        SELECT
            (SELECT COUNT(*) FROM CLIENTE) AS total_clientes,
            (SELECT COUNT(*) FROM HABITACION) AS total_habitaciones,
            (SELECT COUNT(*) FROM RESERVA) AS total_reservas,
            (SELECT COUNT(*) FROM PAGO) AS total_pagos,
            (SELECT COUNT(*) FROM LOG_HABITACION) AS total_logs;
    """)
    conteos = cursor.fetchone()
    print(f"""
    Clientes:     {conteos[0]}
    Habitaciones: {conteos[1]}
    Reservas:     {conteos[2]}
    Pagos:        {conteos[3]}
    Logs:         {conteos[4]}
    """)

def main(act):
    conn = conectar()
    cursor = conn.cursor()

    operation_type = ""
    day = 0
    restore_function = None
    if 6 <= act <= 10:
        operation_type = "completo"
        day = act - 5
        restore_function = restaurar_backup_completo
        limpiar_base(cursor, conn)
    else:  # 11 <= act <= 15
        operation_type = "incremental"
        day = act - 10
        restore_function = restaurar_backup_incremental
        if act == 11:
            print("\nActividad 11: borrado antes de restaurar incremental 1.")
            limpiar_base(cursor, conn)

    start_time = time.time()
    exito = restore_function(day)
    end_time = time.time()

    if exito:
        print(f"\nBackup {operation_type} del día {day} restaurado correctamente.")
        print(f"\nTiempo de restauración: {end_time - start_time:.2f} segundos.")
        mostrar_resultados(cursor)
    else:
        print("Error al restaurar el backup")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Restauración de backups por número de actividad")
    parser.add_argument("--act", type=int, required=True, help="Número de actividad (6-15)")
    args = parser.parse_args()

    main(args.act)
