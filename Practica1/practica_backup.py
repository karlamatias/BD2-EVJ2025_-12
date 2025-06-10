import mysql.connector
import subprocess
import argparse
import datetime
import os
from mysql.connector.constants import ClientFlag

# Configuración

# Cambia aqui el nombre del user y el pasword segun tu base de datos
# El BINLOG_INDEX tienes que colocar la ruta correcta para tu compu, esta generalmente en ProgamData, solo debes de 
# cambiar el archivo KARLA_MATIAS-bin.index por el nombre del  tuyo

# DATA COMPU HANIA
USER = "root"
PASSWORD = "4321"
BINLOG_INDEX = "C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Data\\LAPLNVIP5-WIN-bin.index"

# DATA COMPU KARLA
#USER = "root"
#PASSWORD = "12345"
#BINLOG_INDEX = "C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Data\\KARLA_MATIAS-bin.index"

DATABASE = "hotelera"
CSV_DIR = "./archivos"
OUTPUT_DIR = "./resultados"
INCREMENTAL_BACKUP_DIR = "./incrementales"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(INCREMENTAL_BACKUP_DIR, exist_ok=True)

# Cargamos las tablas por dia (Pareja 3)
CARGAS_POR_DIA = {
    1: [{"tabla": "cliente", "archivo": "cliente.csv"},
        {"tabla": "habitacion", "archivo": "habitacion.csv"}],
    2: [{"tabla": "log_habitacion", "archivo": "log_habitacion1.csv"}],
    3: [{"tabla": "reserva", "archivo": "reserva.csv"}],
    4: [{"tabla": "log_habitacion", "archivo": "log_habitacion2.csv"}],
    5: [{"tabla": "pago", "archivo": "pago.csv"}]
}

# Nombres de las columnas en la base de datos, coincidiendo en orden con el csv
COLUMNAS_POR_TABLA = {
    "cliente": "(id_cliente, nombre, correo, telefono)",
    "habitacion": "(id_habitacion, tipo, precio)",
    "log_habitacion": "(time_estampx, status, id_habitacion)",
    "reserva": "(id_reserva, id_cliente, id_habitacion, fecha_entrada, fecha_salida)",
    "pago": "(id_pago, id_reserva, fecha_pago, monto, metodo_pago)"
}

#Conexion base de datos y conexion hacia los bin
def conectar():
    conn = mysql.connector.connect(
        host='localhost',
        user=USER,
        password=PASSWORD,
        database=DATABASE,
        allow_local_infile=True
    )
    cursor = conn.cursor()
    cursor.execute("SET GLOBAL local_infile=1;")
    cursor.close()
    return conn


def cargar_csv(cursor, tabla, archivo_relativo):
    ruta_base = os.path.dirname(os.path.abspath(__file__))
    ruta_csv = os.path.join(ruta_base, archivo_relativo).replace("\\", "/")

    if not os.path.exists(ruta_csv):
        print(f"Archivo no encontrado: {ruta_csv}")
        return

    print(f"Cargando datos en '{tabla}' desde '{ruta_csv}'...")

    cursor.execute(f"""
        LOAD DATA LOCAL INFILE '{ruta_csv}'
        INTO TABLE {tabla}
        FIELDS TERMINATED BY ',' 
        ENCLOSED BY '"'
        LINES TERMINATED BY '\\n'
        IGNORE 1 ROWS 
        {COLUMNAS_POR_TABLA.get(tabla, "")};
    """)
    print(f"Filas insertadas: {cursor.rowcount}")

def mostrar_resultados(cursor, tabla):
    print(f"\nResultados SELECT * FROM {tabla}:")
    cursor.execute(f"SELECT * FROM {tabla}")
    rows = cursor.fetchall()
    for row in rows:
        print(row)

    cursor.execute(f"SELECT COUNT(*) FROM {tabla}")
    count = cursor.fetchone()[0]
    print(f"Total registros en {tabla}: {count}\n")

def crear_backup_completo(dia):
    nombre_backup = f"{OUTPUT_DIR}/backup_dia{dia}_completo.sql"
    mysqldump_path = r'"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe"'
    comando = f'{mysqldump_path} -u {USER} -p{PASSWORD} {DATABASE} > "{nombre_backup}"'
    print(f"Creando backup completo en {nombre_backup}...")
    subprocess.run(comando, shell=True)
    print("Backup completo generado.")

def crear_backup_incremental_binario(dia, start_time, end_time):
    nombre_backup = f"{INCREMENTAL_BACKUP_DIR}/backup_dia{dia}_incremental_binario.sql"

    # Leer lista de binlogs
    with open(BINLOG_INDEX, 'r') as f:
        binlogs = [line.strip() for line in f.readlines()]
        binlog_file_name = binlogs[-1]

    # Extraer la carpeta base del índice para formar ruta completa
    binlog_dir = os.path.dirname(BINLOG_INDEX)
    binlog_file_path = os.path.join(binlog_dir, binlog_file_name)

    mysqlbinlog_path = r'"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqlbinlog.exe"'

    comando = f'{mysqlbinlog_path} --start-datetime="{start_time}" --stop-datetime="{end_time}" "{binlog_file_path}" > "{nombre_backup}"'

    print(f"Creando backup incremental binario en {nombre_backup}...")
    subprocess.run(comando, shell=True)
    print("Backup incremental binario generado.")

def main(dia):
    if dia not in CARGAS_POR_DIA:
        print("Día no válido. Debe estar entre 1 y 5.")
        return

    now = datetime.datetime.now()
    start_time = now.replace(hour=0, minute=0, second=0).strftime('%Y-%m-%d %H:%M:%S')
    end_time = now.replace(hour=23, minute=59, second=59).strftime('%Y-%m-%d %H:%M:%S')

    conn = conectar()
    cursor = conn.cursor()

    for item in CARGAS_POR_DIA[dia]:
        tabla = item["tabla"]
        archivo = item["archivo"]
        ruta_archivo = os.path.join(CSV_DIR, archivo)

        cargar_csv(cursor, tabla, ruta_archivo)
        conn.commit()
        mostrar_resultados(cursor, tabla)  

    crear_backup_completo(dia)
    crear_backup_incremental_binario(dia, start_time, end_time)

    cursor.close()
    conn.close()
    print(f"\nDía {dia} completado correctamente.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Carga de datos y backup por día")
    parser.add_argument("--dia", type=int, required=True, help="Número del día (1-5)")
    args = parser.parse_args()

    main(args.dia)
