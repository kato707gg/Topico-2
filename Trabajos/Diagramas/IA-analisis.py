from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite las solicitudes desde cualquier origen

# Configura tu API Key de Gemini
GOOGLE_API_KEY = 'AIzaSyBgRLbxF1_8xbaTGKw31zLnY89XWkeGKDQ'
genai.configure(api_key=GOOGLE_API_KEY)

# Diagrama FODA
@app.route('/generar-preguntas-foda', methods=['POST'])
def generar_preguntas_foda():
    data = request.json
    tema = data.get('tema', '')

    if not tema:
        return jsonify({"error": "No se ha proporcionado un tema"}), 400

    modelo = genai.GenerativeModel('gemini-pro')

    fortalezas_prompt = f"Genera una pregunta clave sobre fortalezas para el análisis FODA del tema: {tema}"
    oportunidades_prompt = f"Genera una pregunta clave sobre oportunidades para el análisis FODA del tema: {tema}"
    debilidades_prompt = f"Genera una pregunta clave sobre debilidades para el análisis FODA del tema: {tema}"
    amenazas_prompt = f"Genera una pregunta clave sobre amenazas para el análisis FODA del tema: {tema}"

    fortalezas_respuesta = modelo.generate_content(fortalezas_prompt).text
    oportunidades_respuesta = modelo.generate_content(oportunidades_prompt).text
    debilidades_respuesta = modelo.generate_content(debilidades_prompt).text
    amenazas_respuesta = modelo.generate_content(amenazas_prompt).text

    response = {
        "fortalezas": fortalezas_respuesta.strip(),
        "oportunidades": oportunidades_respuesta.strip(),
        "debilidades": debilidades_respuesta.strip(),
        "amenazas": amenazas_respuesta.strip()
    }
    
    print(response) 

    return jsonify(response)

@app.route('/procesar-respuestas-foda', methods=['POST'])
def procesar_respuestas_foda():
    data = request.json
    fortalezas = data.get('fortalezas', '')
    oportunidades = data.get('oportunidades', '')
    debilidades = data.get('debilidades', '')
    amenazas = data.get('amenazas', '')

    modelo = genai.GenerativeModel('gemini-pro')

    def extraer_puntos_clave_foda(respuesta):
        prompt = f"Extrae los 2 a 5 puntos más importantes de la siguiente respuesta: {respuesta}. Solo pon los puntos importantes, sin un titulo que diga *Puntos importantes* o algo parecido y procura iniciar los puntos importantes con un guion -"
        return modelo.generate_content(prompt).text.strip()

    fortalezas_clave = extraer_puntos_clave_foda(fortalezas)
    oportunidades_clave = extraer_puntos_clave_foda(oportunidades)
    debilidades_clave = extraer_puntos_clave_foda(debilidades)
    amenazas_clave = extraer_puntos_clave_foda(amenazas)

    response = {
        "fortalezas_clave": fortalezas_clave.split('\n'),
        "oportunidades_clave": oportunidades_clave.split('\n'),
        "debilidades_clave": debilidades_clave.split('\n'),
        "amenazas_clave": amenazas_clave.split('\n')
    }

    return jsonify(response)

# Diagrama CATWDA
@app.route('/generar-preguntas-catwda', methods=['POST'])
def generar_preguntas_catwda():
    data = request.json
    tema = data.get('tema', '')

    if not tema:
        return jsonify({"error": "No se ha proporcionado un tema"}), 400

    modelo = genai.GenerativeModel('gemini-pro')

    clientes_prompt = f"Genera una pregunta clave sobre Clientes para el análisis CATWDA del tema: {tema}. Solo pon la pregunta, sin un titulo que diga *Pregunta clave* o algo parecido"
    actores_prompt = f"Genera una pregunta clave sobre Actores para el análisis CATWDA del tema: {tema}. Solo pon la pregunta, sin un titulo que diga *Pregunta clave* o algo parecido"
    transformaciones_prompt = f"Genera una pregunta clave sobre Transformaciones para el análisis CATWDA del tema: {tema}. Solo pon la pregunta, sin un titulo que diga *Pregunta clave* o algo parecido"
    weltanschaung_prompt = f"Genera una pregunta clave sobre Weltanschaung para el análisis CATWDA del tema: {tema}. Solo pon la pregunta, sin un titulo que diga *Pregunta clave* o algo parecido"
    dueño_prompt = f"Genera una pregunta clave sobre Dueño para el análisis CATWDA del tema: {tema}. Solo pon la pregunta, sin un titulo que diga *Pregunta clave* o algo parecido"
    ambiente_prompt = f"Genera una pregunta clave sobre Ambiente para el análisis CATWDA del tema: {tema}. Solo pon la pregunta, sin un titulo que diga *Pregunta clave* o algo parecido"

    clientes_respuesta = modelo.generate_content(clientes_prompt).text
    actores_respuesta = modelo.generate_content(actores_prompt).text
    transformaciones_respuesta = modelo.generate_content(transformaciones_prompt).text
    weltanschaung_respuesta = modelo.generate_content(weltanschaung_prompt).text
    dueño_respuesta = modelo.generate_content(dueño_prompt).text
    ambiente_respuesta = modelo.generate_content(ambiente_prompt).text

    response = {
        "clientes": clientes_respuesta.strip(),
        "actores": actores_respuesta.strip(),
        "transformaciones": transformaciones_respuesta.strip(),
        "weltanschaung": weltanschaung_respuesta.strip(),
        "dueño": dueño_respuesta.strip(),
        "ambiente": ambiente_respuesta.strip()
    }

    print(response)

    return jsonify(response)

@app.route('/procesar-respuestas-catwda', methods=['POST'])
def procesar_respuestas_catwda():
    data = request.json
    clientes = data.get('clientes', '')
    actores = data.get('actores', '')
    transformaciones = data.get('transformaciones', '')
    weltanschaung = data.get('weltanschaung', '')
    dueño = data.get('dueño', '')
    ambiente = data.get('ambiente', '')

    modelo = genai.GenerativeModel('gemini-pro')

    def extraer_puntos_clave_catwda(respuesta):
        prompt = f"Extrae los 2 a 5 puntos más importantes de la siguiente respuesta: {respuesta}. Solo pon los puntos importantes sin un titulo que diga *Puntos importantes* o algo parecido, procura iniciar los puntos importantes con un guion, evita el uso de signos como el asterisco y ademas quiero que sean puntos concisos sin recurrir a poner mucho texto para cada punto"
        return modelo.generate_content(prompt).text.strip()

    clientes_clave = extraer_puntos_clave_catwda(clientes)
    actores_clave = extraer_puntos_clave_catwda(actores)
    transformaciones_clave = extraer_puntos_clave_catwda(transformaciones)
    weltanschaung_clave = extraer_puntos_clave_catwda(weltanschaung)
    dueño_clave = extraer_puntos_clave_catwda(dueño)
    ambiente_clave = extraer_puntos_clave_catwda(ambiente)

    response = {
        "clientes_clave": clientes_clave.split('\n'),
        "actores_clave": actores_clave.split('\n'),
        "transformaciones_clave": transformaciones_clave.split('\n'),
        "weltanschaung_clave": weltanschaung_clave.split('\n'),
        "dueño_clave": dueño_clave.split('\n'),
        "ambiente_clave": ambiente_clave.split('\n')
    }

    return jsonify(response)

@app.route('/generar-preguntas-ishikawa', methods=['POST'])
def generar_preguntas_ishikawa():
    tema = request.json.get('tema', '')

    if not tema:
        return jsonify({"error": "No se ha proporcionado un tema"}), 400

    modelo = genai.GenerativeModel('gemini-pro')

    # Generar preguntas para las causas principales
    causa_prompt = f"Genera 6 preguntas para identificar una causa principal relacionada con el siguiente tema o problema: {tema}. No es necesario que las enumeres ni pongas signos como asterisco o guion, ni un titulo de la pregunta, solo la pura pregunta. Procura hacer una pregunta entendible fácilmente que logre sacar una respuesta concisa sobre una causa principal del problema o tema"
    causas_respuestas = modelo.generate_content(causa_prompt).text.splitlines()

    # Generar título clave para cada causa principal
    resumen_causa_prompt = f"Para cada una de las siguientes causas principales, genera un título clave conciso y representativo: {', '.join(causas_respuestas)}"
    resumen_causas = modelo.generate_content(resumen_causa_prompt).text.splitlines()

    print(causas_respuestas)
    print(resumen_causas)

    return jsonify({"preguntasCausas": causas_respuestas, "resumenCausas": resumen_causas})


@app.route('/generar-subcausa-pregunta-ishikawa', methods=['POST'])
def generar_subcausa_pregunta_ishikawa():
    data = request.json
    causa = data.get('causa', '')

    if not causa:
        return jsonify({"error": "No se ha proporcionado una causa"}), 400

    modelo = genai.GenerativeModel('gemini-pro')

    # Generar la pregunta para las subcausas
    subcausa_prompt = f"Genera una pregunta que pueda desglosar la causa principal '{causa}' en 2 o 3 subcausas. No es necesario que las enumeres ni pongas signos como asterisco o guion, ni un titulo de la pregunta, solo la pura pregunta. Procura hacer una pregunta entendible fácilmente que logre sacar una respuesta concisa"
    subcausa_respuesta = modelo.generate_content(subcausa_prompt).text

    print(subcausa_respuesta)

    return jsonify({"preguntaSubcausa": subcausa_respuesta})

@app.route('/crear-diagrama-ishikawa', methods=['POST'])
def crear_diagrama_ishikawa():
    data = request.json
    causas = data.get('causas', [])
    subcausas = data.get('subcausas', [])

    if len(causas) != len(subcausas):
        return jsonify({"error": "La cantidad de causas no coincide con la cantidad de subcausas"}), 400

    return jsonify({"causas": causas, "subcausas": subcausas})

@app.route('/generar-preguntas-seissombrero', methods=['POST'])
def generar_preguntas_seissombrero():
    tema = request.json.get('tema', '')
    if not tema:
        return jsonify({"error": "No se ha proporcionado un tema"}), 400
    modelo = genai.GenerativeModel('gemini-pro')
    # Generar preguntas para los 6 sombreros
    sombreros = ['blanco', 'rojo', 'negro', 'amarillo', 'verde', 'azul']
    preguntas = {}
    for sombrero in sombreros:
        prompt = f"Genera una pregunta clave sobre el sombrero {sombrero} para el análisis del tema: {tema}. Solo pon la pregunta, sin título."
        pregunta = modelo.generate_content(prompt).text.strip()
        preguntas[sombrero] = pregunta

        print(pregunta)
    return jsonify(preguntas)

@app.route('/procesar-respuestas-seissombrero', methods=['POST'])
def procesar_respuestas_seissombrero():
    data = request.json
    respuestas = {sombrero: data.get(sombrero, '') for sombrero in ['blanco', 'rojo', 'negro', 'amarillo', 'verde', 'azul']}
    modelo = genai.GenerativeModel('gemini-pro')
    def extraer_puntos_clave(respuesta):
        prompt = f"Extrae los 2 a 5 puntos más importantes de la siguiente respuesta: {respuesta}. Solo pon los puntos importantes sin título."
        return modelo.generate_content(prompt).text.strip()
    puntos_clave = {sombrero: extraer_puntos_clave(respuesta) for sombrero, respuesta in respuestas.items()}
    response = {f"{sombrero}_clave": puntos.split('\n') for sombrero, puntos in puntos_clave.items()}
    return jsonify(response)

@app.route('/generar-preguntas-pareto', methods=['POST'])
def generar_preguntas_pareto():
    tema = request.json.get('tema', '')

    if not tema:
        return jsonify({"error": "No se ha proporcionado un tema"}), 400

    modelo = genai.GenerativeModel('gemini-pro')

    # Generar preguntas para identificar causas
    causa_prompt = f"Genera 5 preguntas para identificar causas relacionadas con el siguiente tema o problema: {tema}. No es necesario que las enumeres ni pongas signos como asterisco o guion, ni un titulo de la pregunta, solo la pura pregunta. Procura hacer una pregunta entendible fácilmente que logre sacar una respuesta concisa sobre una causa del problema o tema"
    causas_preguntas = modelo.generate_content(causa_prompt).text.splitlines()

    return jsonify({"preguntasCausas": causas_preguntas})

@app.route('/generar-pregunta-frecuencia-pareto', methods=['POST'])
def generar_pregunta_frecuencia_pareto():
    causa = request.json.get('causa', '')

    if not causa:
        return jsonify({"error": "No se ha proporcionado una causa"}), 400

    modelo = genai.GenerativeModel('gemini-pro')


    # Generar la pregunta para la frecuencia, contextualizando con la causa específica
    frecuencia_prompt = (f"Genera una pregunta que permita estimar la frecuencia o el impacto del siguiente factor: {causa}. "
                       f"Indicale al usuario que su respuesta sea en porcentaje"
                       f"Evita usar términos genéricos como 'X' y proporciona una pregunta que permita obtener una respuesta precisa sobre la frecuencia o impacto de este factor.")
    
    pregunta_frecuencia = modelo.generate_content(frecuencia_prompt).text.strip()

    # Generar un título clave para la causa
    resumen_causa_prompt = f"Genera un título clave conciso y representativo para la siguiente causa: {causa}. Hazlo en pocas palabras."
    resumen_causa = modelo.generate_content(resumen_causa_prompt).text.strip()

    return jsonify({"preguntaFrecuencia": pregunta_frecuencia, "resumenCausa": resumen_causa})

@app.route('/procesar-respuestas-pareto', methods=['POST'])
def procesar_respuestas_pareto():
    causas = request.json.get('causas', [])
    frecuencias = request.json.get('frecuencias', [])

    # Se espera que causas y frecuencias tengan el mismo tamaño
    if len(causas) != len(frecuencias):
        return jsonify({"error": "La cantidad de causas no coincide con la cantidad de frecuencias"}), 400

    # Aquí se puede aplicar una lógica para ordenar las causas según las frecuencias
    # Ejemplo simple: emparejar y ordenar
    datos_pareto = sorted(zip(causas, frecuencias), key=lambda x: x[1], reverse=True)

    # Generar los puntos acumulados para la línea de Pareto
    total = sum(frecuencias)
    acumulado = 0
    puntos_acumulados = []

    for _, freq in datos_pareto:
        acumulado += freq
        puntos_acumulados.append((acumulado / total) * 100)

    return jsonify({"datosPareto": datos_pareto, "puntosAcumulados": puntos_acumulados})

if __name__ == '__main__':
    app.run(debug=True)
