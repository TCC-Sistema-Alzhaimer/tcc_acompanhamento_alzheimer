import requests
import random

url_base = "http://localhost:8080"


def login_admin(email, password):
    url = f"{url_base}/api/auth/login"
    headers = {"Content-Type": "application/json"}
    payload = {"email": email, "password": password}

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        return response.json().get("token")
    print("Falha no login:", response.status_code, response.text)
    return None


def generate_unique_user(base_name):
    num = random.randint(1000, 9999)
    cpf = f"12345678{num:02d}"
    email = f"{base_name.lower()}{num}@example.com"
    phone = f"1199{num}9999"
    name = f"{base_name} {num}"
    return cpf, email, phone, name


def request_entity(method, url, token=None, payload=None, entity_name="Entity"):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    response = requests.request(method, url, json=payload, headers=headers)
    print(f"{entity_name} {method}:", response.status_code, response.text)
    if response.status_code in [200, 201]:
        return response.json()
    return None


# --- CRUDs ---


def create_admin(token):
    url = f"{url_base}/administrators"
    cpf, email, phone, name = generate_unique_user("Admin")
    payload = {
        "cpf": cpf,
        "name": name,
        "email": email,
        "phone": phone,
        "password": "senha123",
        "type": "ADMINISTRATOR"
    }
    return request_entity("POST", url, token, payload)


def get_admin_by_id(token, id):
    url = f"{url_base}/administrators/{id}"
    return request_entity("GET", url, token)


def update_admin(token, id, name=None, email=None):
    url = f"{url_base}/administrators/{id}"
    # Recupera o admin atual
    current = get_admin_by_id(token, id)
    if not current:
        return None
    # Atualiza campos
    if name:
        current["name"] = name
    if email:
        current["email"] = email
    return request_entity("PUT", url, token, current)


def create_doctor(token):
    url = f"{url_base}/doctors"
    cpf, email, phone, name = generate_unique_user("Doctor")
    payload = {
        "cpf": cpf,
        "name": name,
        "email": email,
        "phone": phone,
        "password": "senha123",
        "crm": f"{random.randint(100000, 999999)}",
        "speciality": "Cardiologista",
        "type": "DOCTOR"
    }
    return request_entity("POST", url, token, payload)


def get_doctor_by_id(token, id):
    url = f"{url_base}/doctors/{id}"
    return request_entity("GET", url, token)


def update_doctor(token, id, name=None, email=None, speciality=None):
    url = f"{url_base}/doctors/{id}"
    current = get_doctor_by_id(token, id)
    if not current:
        return None
    if name:
        current["name"] = name
    if email:
        current["email"] = email
    if speciality:
        current["speciality"] = speciality
    return request_entity("PUT", url, token, current)


def create_caregiver(token, patient_emails):
    if not patient_emails or len(patient_emails) == 0:
        print("Erro: não é possível criar cuidador sem pelo menos um paciente vinculado.")
        return None

    url = f"{url_base}/carregivers"
    cpf, email, phone, name = generate_unique_user("Caregiver")
    payload = {
        "cpf": cpf,
        "name": name,
        "email": email,
        "phone": phone,
        "password": "senha123",
        "birthdate": "1940-01-01",
        "gender": "M",
        "address": "Rua das Flores, 123",
        "type": "CAREGIVER",
        "patientEmails": patient_emails
    }
    return request_entity("POST", url, token, payload)


def get_caregiver_by_id(token, id):
    url = f"{url_base}/carregivers/{id}"
    return request_entity("GET", url, token)


def update_caregiver(token, id, name=None, email=None):
    url = f"{url_base}/carregivers/{id}"
    current = get_caregiver_by_id(token, id)
    if not current:
        return None
    if name:
        current["name"] = name
    if email:
        current["email"] = email
    return request_entity("PUT", url, token, current)


def create_patient(token, doctor_emails=[], caregiver_emails=[]):
    url = f"{url_base}/patients"
    cpf, email, phone, name = generate_unique_user("Patient")
    payload = {
        "cpf": cpf,
        "name": name,
        "email": email,
        "phone": phone,
        "password": "senha123",
        "birthdate": "1940-01-01",
        "gender": "M",
        "address": "Rua das Flores, 123",
        "type": "PATIENT",
        "doctorEmails": doctor_emails,
        "caregiverEmails": caregiver_emails
    }
    return request_entity("POST", url, token, payload, "Patient")


def get_patient_by_id(token, id):
    url = f"{url_base}/patients/{id}"
    return request_entity("GET", url, token, entity_name="Patient GET")


def get_patients_by_doctor_id(token, id):
    url = f"{url_base}/doctors/{id}/patients"
    return request_entity("GET", url, token, entity_name="DOCTORS PATIENT GET")


def update_patient(token, id, name=None, email=None, doctor_emails=None, caregiver_emails=None):
    url = f"{url_base}/patients/{id}"
    current = get_patient_by_id(token, id)
    if not current:
        return None
    if name:
        current["name"] = name
    if email:
        current["email"] = email
    if doctor_emails is not None:
        current["doctorEmails"] = doctor_emails
    if caregiver_emails is not None:
        current["caregiverEmails"] = caregiver_emails
    return request_entity("PUT", url, token, current, "Patient PUT")


# --- Execução ---
token = login_admin("admin@gmail.com", "123456")
if token:

    print("\n--- Operações CRUD Exemplos ---")
    print("\n--- Add Admin ---\n")
    admin = create_admin(token)
    print("\n--- Add Doctor ---\n")
    doctor = create_doctor(token)
    print("\n--- Add Patient ---\n")
    patient = create_patient(token, doctor_emails=[doctor["email"]])
    patient = create_patient(token, doctor_emails=[doctor["email"]])
    patient = create_patient(token, doctor_emails=[doctor["email"]])
    print("\n--- Add Carregiver ---\n")
    caregiver = create_caregiver(token, patient_emails=[patient["email"]])

    print("\n--- Operações GET Exemplos ---")

    
    print("\n--- Get patient ---\n")
    get_patient_by_id(token, patient["id"])
    print("\n--- Get doctor ---\n")
    get_doctor_by_id(token, doctor["id"])
    print("\n--- Get patients by doctor ---\n")
    get_patients_by_doctor_id(token, doctor["id"])
    print("\n--- Get carregiver ---\n")
    get_caregiver_by_id(token, caregiver["id"])
    

    print("\n--- Operações PUT Exemplos ---\n")
    print("\n--- Put patient ---\n")
    update_patient(token, patient["id"], name="Paciente Atualizado")
    print("\n--- Put doctor ---\n")
    update_doctor(token, doctor["id"], speciality="Neurologista")
    print("\n--- Put carrigiver ---\n")
    update_caregiver(token, caregiver["id"], name="Cuidador Atualizado")
    print("\n--- Put admin ---\n")
    update_admin(token, admin["id"], name="Administrador Atualizado")
