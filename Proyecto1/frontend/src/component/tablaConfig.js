// Configuración de títulos y orden por consulta
const tablaConfigPorConsulta = {
  "Aspirantes por tipo de institución educativa": {
    alias: {
      _id: "Institucion",
      total_aspirantes: "Total de aspirantes",
    },
    orden: ["_id", "total_aspirantes"],
  },
  "Cantidad de aprobados por materia": {
    alias: {
      _id: "Materia",
      aprobados: "Total de Aprobados",
    },
    orden: ["_id", "aprobados"],
  },
  "Aprobados por carrera y año": {
    alias: {
      carrera: "Carrera",
      anio: "Año",
      aprobados: "Aprobados",
    },
    orden: ["anio", "carrera", "aprobados"],
  },
  "Porcentaje de aprobación por materia": {
    alias: {
      _id: "Materia",
      porcentaje_aprobacion: "Porcentaje de Aprobacion (%)",
    },
    orden: ["_id", "porcentaje_aprobacion"],
  },
  "Promedio de edad por carrera": {
    alias: {
      _id: "Carrera",
      promedio_edad: "Promedio de edad",
    },
    orden: ["_id", "promedio_edad"],
  },
  "Promedio edad de aprobados por carrera e institución": {
    alias: {
      carrera: "Carrera",
      tipo_institucion: "Tipo de Institucion",
      promedio_edad: "Promedio de Edad",
    },
    orden: ["carrera", "tipo_institucion", "promedio_edad"],
  },
  "Distribución de aprobados por municipio y carrera": {
    alias: {
      municipio: "Municipio",
      carrera: "Carrera",
      total_aprobados: "Total Aprobados",
    },
    orden: ["municipio", "carrera", "total_aprobados"],
  },
  "Evaluaciones públicas por mes y materia": {
    alias: {
      mes: "Mes (Num)",
      materia: "Materia",
      cantidad: "Cantidad de Pruebas",
    },
    orden: ["mes", "materia", "cantidad"],
  },
  "Top 5 carreras (16-18 años)": {
    alias: {
      _id: "Carrera",
      total_aspirantes: "Total de Apirantes",
    },
    orden: ["_id", "total_aspirantes"],
  },
  "Historial por aspirante": {
    alias: {
      correlativo_aspirante: "Codigo Aspirante",
      materia: "Materia",
      intentos: "Intentos",
      aprobados: "Aprobados",
      reprobados: "Reprobados",
    },
    orden: [
      "correlativo_aspirante",
      "materia",
      "intentos",
      "aprobados",
      "reprobados",
    ],
  },
  "Distribución por sexo e institución": {
    alias: {
      sexo: "Sexo",
      tipo_institucion: "Tipo de Institucion",
      cantidad: "Cantidad",
    },
    orden: [
      "sexo",
      "tipo_institucion",
      "cantidad",
    ],
  },
   "Tasa aprobación por edad": {
    alias: {
      edad: "Edad",
      tasa_aprobacion: "Tasa de Aprobacion",
    },
    orden: [
      "edad",
      "tasa_aprobacion",
    ],
  },
  "Prom intentos por materia": {
    alias: {
      materia: "Materia",
      promedio_intentos: "Promedio de Intentos",
    },
    orden: [
      "materia",
      "promedio_intentos",
    ],
  },
  "Historial completo de un aspirante": {
    alias: {
      fecha_asignacion: "Fecha de Asignacion",
      sexo: "Sexo",
      anio_nacimiento: "Año de Nacimiento",
      materia: "Materia",
      aprobacion: "Aprobado",
      carrera_objetivo: "Carrera Objetivo",
      departamento_institucion_ed: "Departamento Institucion",
      municipio_institucion_: "Municipio Institucion",
      tipo_institucion_educativa: "Tipo de Institucion"
    },
    orden: [
      "fecha_asignacion",
      "sexo",
      "anio_nacimiento",
      "materia",
      "carrera_objetivo",
      "aprobacion",
      "departamento_institucion_ed",
      "municipio_institucion_",
      "tipo_institucion_educativa"
    ],
  },
  "Carreras con más reprobados primer intento": {
    alias: {
      reprobados_primera: "Reprobados (Primera Oportunidad)",
      carrera: "Carrera",
    },
    orden: [
      "carrera",
      "reprobados_primera",
    ],
  },
};

export default tablaConfigPorConsulta;