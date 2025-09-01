import requests
import random

url_base = "http://localhost:8080"

def login_admin(email, password):
    url = f"{url_base}/api/auth/login"
    headers = {"Content-Type": "application/json"}
    payload = {"email": email, "password": password}

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        token = response.json().get("token")
        return token
    else:
        print("Falha no login:", response.status_code, response.text)
        return False

def generate_unique_user(base_name):
    """Gera dados únicos de CPF, email e telefone"""
    num = random.randint(1000, 9999)
    cpf = f"12345678{num:02d}"          # CPF genérico
    email = f"{base_name.lower()}{num}@example.com"
    phone = f"1199{num}9999"
    name = f"{base_name} {num}"
    return cpf, email, phone, name

def test_create_admin(token):
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
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}
    response = requests.post(url, json=payload, headers=headers)
    print("Admin:", response.status_code, response.text)

def test_create_doctor(token):
    url = f"{url_base}/doctors"
    cpf, email, phone, name = generate_unique_user("Doctor")
    payload = {
        "cpf": cpf,
        "name": name,
        "email": email,
        "phone": phone,
        "password": "senha123",
        "crm": f"{random.randint(100000,999999)}",
        "speciality": "Cardiologista",
        "type": "DOCTOR"
    }
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}
    response = requests.post(url, json=payload, headers=headers)
    print("Doctor:", response.status_code, response.text)

def test_create_patient(token):
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
        "type": "PATIENT"
    }
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}
    response = requests.post(url, json=payload, headers=headers)
    print("Patient:", response.status_code, response.text)

def test_create_caregiver(token):
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
        "type": "CAREGIVER"
    }
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}
    response = requests.post(url, json=payload, headers=headers)
    print("Caregiver:", response.status_code, response.text)



token = login_admin("admin@gmail.com","123456")
if token:
    test_create_admin(token)
    test_create_doctor(token)
    test_create_patient(token)
    test_create_caregiver(token)
