import mysql.connector
import subprocess
import argparse
import datetime
import os
from mysql.connector.constants import ClientFlag

# Configuración

#Cambia aqui el nombre del user y el pasword segun tu base de datos
# El BINLOG_INDEX tienes que colocar la ruta correcta para tu compu, esta generalmente en ProgamData, solo debes de 
# cambiar el archivo KARLA_MATIAS-bin.index por el nombre del  tuyo

#DATA COMPU HANIA
#USER = " "
#PASSWORD = " "
#BINLOG_INDEX = " "

USER = "root"
PASSWORD = "12345"
DATABASE = "hotelera"
CSV_DIR = "./archivos"
OUTPUT_DIR = "./resultados"
INCREMENTAL_BACKUP_DIR = "./incrementales"
BINLOG_INDEX = "C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Data\\KARLA_MATIAS-bin.index"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(INCREMENTAL_BACKUP_DIR, exist_ok=True)

#Cargamos las tablas por dia (Pareja 3)
TABLAS_POR_DIA = {
    1: ["cliente", "habitacion"],
    2: ["log_habitacion1"],
    3: ["reserva"],
    4: ["log_habitacion2"],
    5: ["pago"]
}

#Cargamos lo archivos que estan en la carpeta "archivos"
ARCHIVOS_CSV = {
    "cliente": "cliente.csv",
    "habitacion": "habitacion.csv",
    "reserva": "reserva.csv",
    "pago": "pago.csv",
    "log_habitacion1": "log_habitacion1.csv",
    "log_habitacion2": "log_habitacion2.csv"
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
        IGNORE 1 ROWS;
    """)

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
    if dia not in TABLAS_POR_DIA:
        print("Día no válido. Debe estar entre 1 y 5.")
        return

    now = datetime.datetime.now()
    start_time = now.replace(hour=0, minute=0, second=0).strftime('%Y-%m-%d %H:%M:%S')
    end_time = now.replace(hour=23, minute=59, second=59).strftime('%Y-%m-%d %H:%M:%S')

    conn = conectar()
    cursor = conn.cursor()

    for tabla in TABLAS_POR_DIA[dia]:
        archivo = ARCHIVOS_CSV.get(tabla)
        if not archivo:
            print(f"No se encontró archivo CSV para la tabla {tabla}")
            continue
        cargar_csv(cursor, tabla, os.path.join(CSV_DIR, archivo))  
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
